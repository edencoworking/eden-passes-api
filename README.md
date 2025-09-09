# Eden Passes API

A Node.js backend API for managing Eden passes using Express.js and MongoDB.

## Features

- Create new passes (day, week, month)
- Retrieve all passes
- MongoDB integration with Mongoose
- CORS enabled
- Environment variable configuration
- Comprehensive error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eden-passes-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/eden-passes
PORT=3000
NODE_ENV=development
```

5. Make sure MongoDB is running on your system

## Running the Application

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Root Endpoint
- **GET** `/`
  - Returns API information and available endpoints

### Passes

#### Get All Passes
- **GET** `/api/passes`
- **Description**: Retrieve all passes, sorted by creation date (newest first)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "type": "day",
      "date": "2023-09-09T10:00:00.000Z",
      "createdAt": "2023-09-09T10:00:00.000Z",
      "updatedAt": "2023-09-09T10:00:00.000Z"
    }
  ]
}
```

#### Create New Pass
- **POST** `/api/passes`
- **Description**: Create a new pass
- **Request Body**:
```json
{
  "type": "day",        // Required: "day", "week", or "month"
  "date": "2023-09-09"  // Optional: ISO date string, defaults to current date
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "type": "day",
    "date": "2023-09-09T00:00:00.000Z",
    "createdAt": "2023-09-09T10:00:00.000Z",
    "updatedAt": "2023-09-09T10:00:00.000Z"
  },
  "message": "Pass created successfully"
}
```

## Data Schema

### Pass Model
```javascript
{
  type: {
    type: String,
    required: true,
    enum: ['day', 'week', 'month']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdAt: Date,  // Auto-generated
  updatedAt: Date   // Auto-generated
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage

### Using curl

Create a day pass:
```bash
curl -X POST http://localhost:3000/api/passes \
  -H "Content-Type: application/json" \
  -d '{"type": "day"}'
```

Get all passes:
```bash
curl http://localhost:3000/api/passes
```

### Using JavaScript (fetch)

```javascript
// Create a pass
const response = await fetch('http://localhost:3000/api/passes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'week',
    date: '2023-09-09'
  })
});

const result = await response.json();
console.log(result);

// Get all passes
const passes = await fetch('http://localhost:3000/api/passes');
const data = await passes.json();
console.log(data);
```

## Development

The project structure:
```
eden-passes-api/
├── models/
│   └── Pass.js          # Mongoose schema for Pass
├── routes/
│   └── passes.js        # Express routes for passes
├── server.js            # Main application file
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variables template
└── README.md           # This file
```

## Dependencies

- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling
- **cors**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable loader
- **nodemon**: Development server with auto-restart (dev dependency)

## License

ISC