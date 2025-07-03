from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid
import re
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Create data directory if it doesn't exist
DATA_DIR = 'data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Security: Get absolute path to prevent path traversal
DATA_DIR_ABS = os.path.abspath(DATA_DIR)

def sanitize_filename_component(value, max_length=50):
    """Sanitize a filename component to prevent path traversal and other attacks."""
    if not value or not isinstance(value, (str, int)):
        return 'unknown'
    
    # Convert to string and limit length
    value = str(value)[:max_length]
    
    # Remove or replace dangerous characters
    # Allow only alphanumeric, underscore, dash, and dot
    sanitized = re.sub(r'[^a-zA-Z0-9_.-]', '_', value)
    
    # Remove leading/trailing dots and spaces
    sanitized = sanitized.strip('. ')
    
    # Ensure it's not empty after sanitization
    if not sanitized:
        sanitized = 'unknown'
    
    return sanitized

def validate_json_data(data):
    """Validate the structure and content of incoming JSON data."""
    if not isinstance(data, dict):
        return False, 'Data must be a JSON object'
    
    # Check data size (limit to 1MB)
    data_str = json.dumps(data)
    if len(data_str) > 1024 * 1024:  # 1MB limit
        return False, 'Data too large'
    
    return True, 'Valid'

@app.route('/', methods=['POST'])
def save_data():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate JSON data
        is_valid, validation_msg = validate_json_data(data)
        if not is_valid:
            return jsonify({'error': validation_msg}), 400
        
        # Extract and sanitize key information
        raw_user_id = data.get('userId', 'unknown')
        raw_session_id = data.get('sessionId', 'unknown')
        
        user_id = sanitize_filename_component(raw_user_id)
        session_id = sanitize_filename_component(raw_session_id)
        timestamp = datetime.now().isoformat()
        
        # Create filename with timestamp and user info
        filename = f"{user_id}_session_{session_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        # Security: Construct filepath and validate it stays within data directory
        filepath = os.path.join(DATA_DIR, filename)
        filepath_abs = os.path.abspath(filepath)
        
        # Ensure the resolved path is within the data directory
        if not filepath_abs.startswith(DATA_DIR_ABS + os.sep):
            return jsonify({'error': 'Invalid file path'}), 400
        
        # Add metadata to the data
        data['saved_at'] = timestamp
        data['filename'] = filename
        data['sanitized_user_id'] = user_id
        data['sanitized_session_id'] = session_id
        
        # Save to JSON file
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Data saved to {filename}")
        print(f"User ID: {user_id}, Session ID: {session_id}")
        
        return jsonify({
            'status': 'success',
            'message': 'Data saved successfully',
            'filename': filename,
            'timestamp': timestamp
        }), 200
        
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON data'}), 400
    except PermissionError:
        return jsonify({'error': 'Permission denied'}), 500
    except OSError as e:
        return jsonify({'error': 'File system error'}), 500
    except Exception as e:
        # Log the actual error for debugging, but don't expose it to the client
        print(f"Error saving data: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'social-rl-data-server'}), 200

if __name__ == '__main__':
    print("Starting Social RL Data Server...")
    print(f"Data will be saved to: {os.path.abspath(DATA_DIR)}")
    app.run(host='0.0.0.0', port=5000, debug=False)
