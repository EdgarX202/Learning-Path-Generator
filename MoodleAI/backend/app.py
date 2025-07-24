from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

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
    """
    Handles user login requests.
    Expects a JSON payload with 'username' and 'password'.
    """
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        conn = mysql.connector.connect(**db_config)
        # We are no longer relying on dictionary=True
        cursor = conn.cursor()

        # The order of columns in the SELECT statement is now very important
        query = "SELECT user_id, username, password, role FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        user = cursor.fetchone() # This will return a tuple, e.g., (1, 'staffpass1', 'password123')

        # This print statement is for debugging. Check your Flask terminal for this output.
        print(f"DEBUG: User data from DB: {user}")

        cursor.close()
        conn.close()

        # Check if a user was found and if the password matches.
        # We access the data by its index: 0=user_id, 1=username, 2=password, 3=role
        if user and user[2] == password:
            # Login successful
            return jsonify({
                "message": f"Login successful! Welcome {user[1]}.",  # user[1] is the username
                "userId": user[0],  # user[0] is the user_id
                "role": user[3]  # user[3] is the role
            })
        else:
            # Login failed
            return jsonify({"error": "Invalid username or password"}), 401

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        return jsonify({"error": "A database error occurred."}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=5001)