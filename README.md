# Eden Passes API

A backend server for storing and retrieving passes using Node.js, Express, and MongoDB.

## Features

- Create passes with type and date
- Retrieve all passes
- MongoDB integration with Mongoose
- CORS enabled
- Environment-based configuration
- RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/edencoworking/eden-passes-api.git
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

4. Update the `.env` file with your MongoDB connection string and desired port:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/eden-passes
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eden-passes
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
- **GET** `/`
  - Returns API status message

### Passes

#### Get All Passes
- **GET** `/api/passes`
  - Returns array of all passes, sorted by creation date (newest first)
  - Response: `200 OK`
  ```json
  [
    {
      "_id": "64f...",
      "type": "day-pass",
      "date": "2023-09-15T00:00:00.000Z",
      "createdAt": "2023-09-10T10:30:00.000Z",
      "updatedAt": "2023-09-10T10:30:00.000Z"
    }
  ]
  ```

#### Create Pass
- **POST** `/api/passes`
  - Creates a new pass
  - Request body:
  ```json
  {
    "type": "day-pass",
    "date": "2023-09-15"
  }
  ```
  - Response: `201 Created`
  ```json
  {
    "_id": "64f...",
    "type": "day-pass",
    "date": "2023-09-15T00:00:00.000Z",
    "createdAt": "2023-09-10T10:30:00.000Z",
    "updatedAt": "2023-09-10T10:30:00.000Z"
  }
  ```

## Data Model

### Pass
- `type` (String, required): The type of pass
- `date` (Date, required): The date associated with the pass
- `createdAt` (Date, auto): Timestamp when the pass was created
- `updatedAt` (Date, auto): Timestamp when the pass was last updated

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK`: Successful GET requests
- `201 Created`: Successful POST requests
- `400 Bad Request`: Invalid request data
- `500 Internal Server Error`: Server errors

## Development

### Project Structure
```
eden-passes-api/
├── models/
│   └── Pass.js          # Mongoose model for passes
├── routes/
│   └── passes.js        # API routes for passes
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variables template
└── README.md           # Documentation
```

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with auto-reload

## License

ISC