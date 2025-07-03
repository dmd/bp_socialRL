from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Create data directory if it doesn't exist
DATA_DIR = 'data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

@app.route('/save-data', methods=['POST'])
def save_data():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract key information
        user_id = data.get('userId', 'unknown')
        session_id = data.get('sessionId', 'unknown')
        timestamp = datetime.now().isoformat()
        
        # Create filename with timestamp and user info
        filename = f"{user_id}_session_{session_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        filepath = os.path.join(DATA_DIR, filename)
        
        # Add metadata to the data
        data['saved_at'] = timestamp
        data['filename'] = filename
        
        # Save to JSON file
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Data saved to {filepath}")
        print(f"User ID: {user_id}, Session ID: {session_id}")
        
        return jsonify({
            'status': 'success',
            'message': 'Data saved successfully',
            'filename': filename,
            'timestamp': timestamp
        }), 200
        
    except Exception as e:
        print(f"Error saving data: {str(e)}")
        return jsonify({'error': f'Failed to save data: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'social-rl-data-server'}), 200

if __name__ == '__main__':
    print("Starting Social RL Data Server...")
    print(f"Data will be saved to: {os.path.abspath(DATA_DIR)}")
    app.run(host='0.0.0.0', port=5000, debug=True)