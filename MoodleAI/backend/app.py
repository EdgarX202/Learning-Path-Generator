import sys
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import json
from werkzeug.utils import secure_filename

# --- New Imports for AI and PDF Parsing (Now using OpenAI) ---
from openai import OpenAI, Timeout
from dotenv import load_dotenv
import fitz

# --- Load Environment Variables ---
load_dotenv()

# --- Basic Flask App Setup ---
app = Flask(__name__)
CORS(app)

# --- AI Configuration (Now using Ollama) ---
try:
    # Point the client to your local Ollama server
    # The api_key can be any string, it's required by the library but not used by Ollama
    client = OpenAI(
        base_url='http://localhost:11434/v1',
        api_key='ollama',
        timeout=60.0,
    )
    # Test the connection
    client.models.list()
    print("Ollama client configured successfully.")
except Exception as e:
    print(f"Error configuring Ollama client: {e}")
    print("Please ensure the Ollama application is running.")
    client = None

# --- File Upload Configuration ---
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the upload folder exists

# --- MySQL Database Configuration ---
db_config = {
    'user': 'root',
    'password': '',
    'host': '127.0.0.1',
    'database': 'university_db'
}


# --- Existing API Endpoints (Login, Courses, etc.) ---
# ... (Your existing endpoints for /api/login, /api/courses, etc. remain here) ...
# I am omitting them for brevity, but you should keep them in your file.

@app.route('/api/login', methods=['POST'])
def login():
    """ Handles user login requests. """
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "SELECT user_id, username, password, role, first_name FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and user[2] == password:
            return jsonify({
                "message": f"Login successful! Welcome {user[4]}.",
                "userId": user[0],
                "role": user[3],
                "firstName": user[4]
            })
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


@app.route('/api/courses', methods=['GET'])
def get_courses():
    """ Fetches courses based on the users role and enrolment. """
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT role, enrolled_courses FROM users WHERE user_id = %s", (user_id,))
        user_data = cursor.fetchone()

        if not user_data:
            return jsonify({"error": "User not found"}), 404

        role = user_data['role']

        courses = []
        if role == 'staff':
            cursor.execute("SELECT course_id as id, course_name as name FROM courses")
            courses = cursor.fetchall()
        elif role == 'student':
            enrolled_ids_str = user_data.get('enrolled_courses')
            if enrolled_ids_str:
                enrolled_ids = json.loads(enrolled_ids_str)
                if enrolled_ids:
                    format_strings = ','.join(['%s'] * len(enrolled_ids))
                    query = f"SELECT course_id as id, course_name as name FROM courses WHERE course_id IN ({format_strings})"
                    cursor.execute(query, tuple(enrolled_ids))
                    courses = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify(courses)

    except Exception as e:
        print(f"An error occurred while fetching courses: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


@app.route('/api/modules', methods=['GET'])
def get_modules():
    """ Fetches all modules for a given course ID. """
    course_id = request.args.get('courseId')
    if not course_id:
        return jsonify({"error": "Course ID is required"}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT module_id, module_name FROM modules WHERE course_id = %s"
        cursor.execute(query, (course_id,))
        modules = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(modules)
    except Exception as e:
        print(f"Error fetching modules: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


@app.route('/api/notes', methods=['GET'])
def get_notes():
    """ Fetch all the notes """
    user_id = request.args.get('userId')
    module_id = request.args.get('moduleId')
    if not user_id or not module_id:
        return jsonify({"error": "User ID and Module ID are required"}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM notes WHERE user_id = %s AND module_id = %s ORDER BY created_at DESC"
        cursor.execute(query, (user_id, module_id))
        notes = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(notes)
    except Exception as e:
        print(f"Error fetching notes: {e}")
        return jsonify({"error": "Failed to fetch notes"}), 500


@app.route('/api/notes', methods=['POST'])
def add_note():
    """ Adds a single note to the database """
    data = request.get_json()
    user_id = data.get('userId')
    module_id = data.get('moduleId')
    content = data.get('content')
    color = data.get('color')

    if not all([user_id, module_id, content, color]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "INSERT INTO notes (user_id, module_id, content, color) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (user_id, module_id, content, color))
        conn.commit()
        note_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return jsonify({"message": "Note added successfully", "note_id": note_id}), 201
    except Exception as e:
        print(f"Error adding note: {e}")
        return jsonify({"error": "Failed to add note"}), 500


@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    """ Deletes notes from the database """
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "DELETE FROM notes WHERE note_id = %s"
        cursor.execute(query, (note_id,))
        conn.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "Note not found or already deleted"}), 404

        cursor.close()
        conn.close()
        return jsonify({"message": "Note deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting note: {e}")
        return jsonify({"error": "Failed to delete note"}), 500


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """ Uploads files to the database """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    module_id = request.form.get('moduleId')
    week_title = request.form.get('weekTitle')
    file_type = request.form.get('fileType')  # 'theory' or 'practical'

    if not all([module_id, week_title, file_type]):
        return jsonify({"error": "Missing metadata"}), 400

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Save file info to the database
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()
            query = """
                INSERT INTO module_files (module_id, week_title, file_type, file_name, file_path) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (module_id, week_title, file_type, filename, file_path))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "File uploaded successfully", "filename": filename}), 201
        except Exception as e:
            print(f"Database error on upload: {e}")
            return jsonify({"error": "Failed to save file information"}), 500


@app.route('/api/files', methods=['GET'])
def get_files():
    """ Retrieve all files from the database """
    module_id = request.args.get('moduleId')
    week_title = request.args.get('weekTitle')
    if not all([module_id, week_title]):
        return jsonify({"error": "Module ID and Week Title are required"}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM module_files WHERE module_id = %s AND week_title = %s"
        cursor.execute(query, (module_id, week_title))
        files = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(files)
    except Exception as e:
        print(f"Error fetching files: {e}")
        return jsonify({"error": "Failed to fetch files"}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/api/files/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT file_path FROM module_files WHERE file_id = %s", (file_id,))
        file_record = cursor.fetchone()

        if not file_record:
            return jsonify({"error": "File not found in database"}), 404

        file_path = file_record['file_path']

        # Delete the file from the filesystem
        if os.path.exists(file_path):
            os.remove(file_path)

        # Delete the record from the database
        cursor.execute("DELETE FROM module_files WHERE file_id = %s", (file_id,))
        conn.commit()

        return jsonify({"message": "File deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting file: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# --- NEW: Helper function to summarize text ---
def summarize_text(full_text):
    """
    Uses the LLM to perform a quick summarization task.
    """
    print("Starting summarization of PDF content...")
    try:
        response = client.chat.completions.create(
            model="llama3",
            messages=[
                {"role": "system",
                 "content": "You are a text summarization assistant. Your job is to extract the key topics, headings, and core concepts from the provided text. Present them as a concise list."},
                {"role": "user",
                 "content": f"Please summarize the key topics from the following university module text:\n\n{full_text}"}
            ]
        )
        summary = response.choices[0].message.content
        print("Summarization complete.")
        return summary
    except Exception as e:
        print(f"Error during summarization: {e}")
        # If summarization fails, we can fall back to using the full text,
        # but this might still time out. A better approach is to signal an error.
        raise e  # Re-raise the exception to be caught by the main function


# --- UPDATED: AI Learning Path Generator Endpoint ---
@app.route('/api/generate-path', methods=['POST'])
def generate_path():
    """
    Generates a learning path by first summarizing module files, then generating the path.
    """
    if not client:
        return jsonify({"error": "Ollama client not configured. Is the Ollama application running?"}), 500

    data = request.get_json()
    module_id = data.get('moduleId')
    difficulty = data.get('difficulty')
    target_language = data.get('language')

    if not all([module_id, difficulty, target_language]):
        return jsonify({"error": "moduleId, difficulty, and language are required"}), 400

    try:
        # Step 1: Retrieve file paths from the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT file_path, week_title FROM module_files WHERE module_id = %s AND file_name LIKE '%%.pdf'"
        cursor.execute(query, (module_id,))
        files = cursor.fetchall()
        cursor.close()
        conn.close()

        if not files:
            return jsonify({"error": "No PDF files found for this module to generate a path from."}), 404

        # Step 2: Extract text from each PDF to get the core concepts
        full_module_text = ""
        for file_info in files:
            file_path = file_info['file_path']
            if os.path.exists(file_path):
                try:
                    doc = fitz.open(file_path)
                    text = ""
                    for page in doc:
                        text += page.get_text()
                    full_module_text += f"\n--- Content from {file_info['week_title']} ---\n{text}\n"
                except Exception as e:
                    print(f"Could not read or process existing file {file_path}: {e}")
            else:
                print(f"File not found on disk, skipping: {file_path}")

        if not full_module_text.strip():
            return jsonify({
                               "error": "Could not extract any text from the module's PDF files. All files were missing or unreadable."}), 500

        # --- Step 2.5: Summarize the extracted text ---
        module_summary = summarize_text(full_module_text)

        # Step 3: Construct the prompt for the Ollama API using the SUMMARY
        system_prompt = f"""
        You are an expert academic advisor and curriculum designer who can translate educational concepts between programming languages.
        Your task is to generate a structured, practical learning path for a student.
        The output MUST be a single, valid JSON object and nothing else.
        """

        user_prompt = f"""
        The student's desired parameters are:
        - Difficulty Level: '{difficulty}'
        - Target Programming Language: '{target_language}'

        CRITICAL INSTRUCTION: The following is a SUMMARY of the core concepts for a university module. Your primary job is to take these summarized topics and create a detailed learning path.

        All explanations, project ideas, and code examples in your output MUST be in the student's target language: '{target_language}'.

        --- SOURCE SUMMARY (for concept extraction only) ---
        {module_summary}
        --- END OF SOURCE SUMMARY ---

        The JSON object you return must have a root key 'learningPath' which is an array of 'modules'.
        Each module object in the array must contain:
        1. "module_number": An integer (e.g., 1).
        2. "title": A string (e.g., "Week 1: Core Concepts in {target_language}"). This should correspond to the weekly topics from the source summary.
        3. "description": A brief string explaining the module's goals in the context of the target language.
        4. "topics": An array of topic objects, breaking down the module's key concepts.

        Each topic object in the 'topics' array must contain:
        1. "topic_number": An integer (e.g., 1).
        2. "title": A string (e.g., "Variables and Data Types in {target_language}").
        3. "concept": A string (2-3 sentences) explaining the core concept in simple terms, specifically for '{target_language}'.
        4. "project": A string describing a small, practical exercise or a thought-provoking question that requires writing code in '{target_language}'.
        5. "resource_link": A valid, high-quality URL to a relevant resource for the topic (e.g., MDN for JavaScript, python.org for Python).
        """

        # Step 4: Call the Ollama API for the final generation
        print("Starting final path generation from summary...")
        response = client.chat.completions.create(
            model="llama3",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )

        response_content = response.choices[0].message.content
        print("Final path generation complete.")
        return jsonify(json.loads(response_content))

    except Timeout:
        print("Ollama request timed out.")
        return jsonify({
                           "error": "The request to the local AI model timed out (60s). Your computer may be too slow for the amount of PDF content. Try a module with fewer files."}), 408
    except Exception as e:
        print(f"An unexpected error occurred in AI path generation: {e}")
        return jsonify({"error": "An internal server error occurred during path generation. Is Ollama running?"}), 500

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=5001)

