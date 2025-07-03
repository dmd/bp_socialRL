# Social RL Data Server Setup

This setup replaces the AWS backend with a local Python service that saves data to JSON files.

## Quick Start

1. **Start the data server:**
   ```bash
   docker-compose up -d
   ```

2. **Set up reverse proxy:**
   - Configure your reverse proxy to route `/save-data` to `http://localhost:5000/save-data`
   - Serve the experiment files from this directory

3. **View saved data:**
   - Data files are saved to `./data/` directory
   - Format: `{userId}_session_{sessionId}_{timestamp}.json`

## Services

- **Data Server (Flask)**: `http://localhost:5000` - receives and saves data

## Data Server Endpoints

- `POST /save-data` - saves experiment data to JSON file
- `GET /health` - health check

## Development

To run without Docker:

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start data server:**
   ```bash
   python data_server.py
   ```

3. **Serve experiment files:**
   ```bash
   # Simple HTTP server
   python -m http.server 8080
   ```

## Data Format

Each JSON file contains:
- `results`: Array of trial data from jsPsych
- `userId`: Participant identifier
- `sessionId`: Session number (1-12)
- `totalDuration`: Experiment duration in seconds
- `saved_at`: Timestamp when data was saved
- `filename`: Name of the JSON file

## Notes

- Data is automatically saved when participants complete the experiment
- The `data/` directory is created automatically
- Each participant session creates a separate JSON file
- Files are timestamped to prevent overwrites