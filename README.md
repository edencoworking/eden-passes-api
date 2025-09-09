# Eden Passes API

A Node.js backend API for storing and retrieving passes using Express.js and MongoDB.

## Features

- Create new passes with type and date
- Retrieve all passes with timestamps
- RESTful API design
- MongoDB integration with Mongoose
- CORS enabled for cross-origin requests
- Environment variable configuration

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

3. Create environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/eden-passes
NODE_ENV=development
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### Root Endpoint
- **GET** `/`
  - Returns API information and available endpoints

### Passes Endpoints

#### Get All Passes
- **GET** `/api/passes`
  - Returns a list of all passes sorted by creation date (newest first)
  - Response:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
          "type": "day-pass",
          "date": "2023-09-15T00:00:00.000Z",
          "createdAt": "2023-09-15T10:30:00.000Z",
          "updatedAt": "2023-09-15T10:30:00.000Z"
        }
      ]
    }
    ```

#### Create a New Pass
- **POST** `/api/passes`
  - Creates a new pass
  - Request body:
    ```json
    {
      "type": "day-pass",
      "date": "2023-09-15"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "message": "Pass created successfully",
      "data": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "type": "day-pass",
        "date": "2023-09-15T00:00:00.000Z",
        "createdAt": "2023-09-15T10:30:00.000Z",
        "updatedAt": "2023-09-15T10:30:00.000Z"
      }
    }
    ```

## Data Schema

### Pass Model
- `type` (String, required): The type of pass
- `date` (Date, required): The date for the pass
- `createdAt` (Date, auto-generated): Creation timestamp
- `updatedAt` (Date, auto-generated): Last update timestamp

## Error Handling

All API responses include a `success` field indicating the status of the request. Error responses include an error message and appropriate HTTP status codes.

Example error response:
```json
{
  "success": false,
  "message": "Type and date are required"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

ISC