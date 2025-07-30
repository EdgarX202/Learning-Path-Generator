from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import json

# --- Basic Flask App Setup ---
app = Flask(__name__)
CORS(app)

# --- MySQL Database Configuration ---
db_config = {
    'user': 'root',
    'password': '',
    'host': '127.0.0.1',
    'database': 'university_db'
}


# --- API Endpoints ---

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
    """ Fetches courses based on the user's role and enrollment. """
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
        # Assumes you have a 'modules' table with 'module_id', 'module_name', and a 'course_id' foreign key
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
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "DELETE FROM notes WHERE note_id = %s"
        cursor.execute(query, (note_id,))
        conn.commit()

        # Check if a row was actually deleted
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

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=5001)

