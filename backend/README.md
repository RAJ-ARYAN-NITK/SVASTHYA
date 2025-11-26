# Svasthya Backend

This is the backend for the Svasthya Healthtech AI Agent application.

## Structure

- `src/controllers`: Request handlers
- `src/routes`: API routes
- `src/services`: Business logic (including AI)
- `src/models`: Database models
- `src/utils`: Utility functions
- `src/config`: Configuration files

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. Run the server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /health`: Health check
- `POST /api/agent/chat`: Chat with the AI agent
- `POST /api/agent/analyze-report`: Analyze a medical report
