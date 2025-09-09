# Eden Passes API

A comprehensive Node.js/Express/MongoDB RESTful API for managing coworking space passes at Eden Coworking. This API provides full CRUD operations for pass management, user check-ins, and analytics.

## 🚀 Features

- **Complete CRUD Operations**: Create, read, update, and delete passes
- **Multiple Pass Types**: Support for day, weekly, monthly, quarterly, annual, guest, and event passes
- **Access Level Management**: Basic, premium, VIP, and admin access levels
- **Check-in System**: Track user check-ins and usage
- **Validation & Security**: Input validation, security headers, and error handling
- **Analytics**: Pass statistics and usage insights
- **Pagination & Filtering**: Efficient data retrieval with query options
- **MongoDB Integration**: Robust data persistence with Mongoose ODM

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **MongoDB** (v4.4 or higher) - Local installation or MongoDB Atlas
- **npm** or **yarn** package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/edencoworking/eden-passes-api.git
   cd eden-passes-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/eden-passes
   JWT_SECRET=your-super-secret-jwt-key-here
   SESSION_SECRET=your-session-secret-here
   API_VERSION=v1
   LOG_LEVEL=info
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   
   **For local MongoDB:**
   ```bash
   sudo systemctl start mongod  # Linux
   brew services start mongodb  # macOS
   ```
   
   **For MongoDB Atlas:**
   - Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string and update `MONGODB_URI` in `.env`

5. **Start the server**
   
   **Development mode (with nodemon):**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm start
   ```

## 🌐 API Endpoints

### Base URL
```
http://localhost:3000
```

### Health & Documentation
- `GET /` - Welcome message and API info
- `GET /health` - Health check endpoint
- `GET /api/docs` - API documentation

### Pass Management

#### Get All Passes
```http
GET /api/passes
```

**Query Parameters:**
- `page` (integer): Page number for pagination (default: 1)
- `limit` (integer): Number of results per page (default: 10, max: 100)
- `status` (string): Filter by status (`active`, `expired`, `suspended`, `cancelled`)
- `passType` (string): Filter by pass type
- `accessLevel` (string): Filter by access level
- `holderEmail` (string): Search by holder email (partial match)
- `sortBy` (string): Sort field and direction (e.g., `createdAt:desc`)

**Example:**
```bash
curl "http://localhost:3000/api/passes?page=1&limit=5&status=active&sortBy=createdAt:desc"
```

#### Get Single Pass
```http
GET /api/passes/:id
```

#### Create New Pass
```http
POST /api/passes
Content-Type: application/json

{
  "holderName": "John Doe",
  "holderEmail": "john.doe@example.com",
  "holderPhone": "+1234567890",
  "passType": "monthly_pass",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "accessLevel": "premium",
  "price": 299.99,
  "currency": "USD",
  "amenitiesIncluded": ["wifi", "coffee", "meeting_rooms"],
  "issuedBy": "Admin User",
  "notes": "Corporate membership"
}
```

#### Update Pass
```http
PUT /api/passes/:id
Content-Type: application/json

{
  "status": "suspended",
  "notes": "Payment overdue"
}
```

#### Delete Pass
```http
DELETE /api/passes/:id
```

#### Check-in with Pass
```http
POST /api/passes/:id/checkin
```

#### Get Pass Statistics
```http
GET /api/passes/stats/summary
```

## 📊 Pass Schema

### Pass Types
- `day_pass` - Single day access
- `weekly_pass` - 7-day access
- `monthly_pass` - 30-day access
- `quarterly_pass` - 90-day access
- `annual_pass` - 365-day access
- `guest_pass` - Temporary guest access
- `event_pass` - Event-specific access

### Access Levels
- `basic` - Standard workspace access
- `premium` - Enhanced amenities access
- `vip` - Full facility access
- `admin` - Administrative access

### Pass Status
- `active` - Currently valid and usable
- `expired` - Past end date
- `suspended` - Temporarily disabled
- `cancelled` - Permanently disabled

### Available Amenities
- `wifi` - Internet access
- `printing` - Printing services
- `meeting_rooms` - Meeting room access
- `coffee` - Coffee and beverages
- `parking` - Parking space
- `storage` - Storage locker
- `mail_service` - Mail handling
- `phone_booth` - Private phone booth
- `24_7_access` - Round-the-clock access

## 🔒 Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "passes": [
      // Array of pass objects
    ],
    "pagination": {
      "current": 1,
      "pages": 10,
      "total": 95,
      "limit": 10
    }
  }
}
```

## 🧪 Testing the API

### Using cURL

**Create a new pass:**
```bash
curl -X POST http://localhost:3000/api/passes \
  -H "Content-Type: application/json" \
  -d '{
    "holderName": "Alice Smith",
    "holderEmail": "alice@example.com",
    "passType": "weekly_pass",
    "startDate": "2024-01-15",
    "endDate": "2024-01-21",
    "accessLevel": "basic",
    "price": 99.99,
    "issuedBy": "Front Desk"
  }'
```

**Get all passes:**
```bash
curl http://localhost:3000/api/passes
```

**Check-in with a pass:**
```bash
curl -X POST http://localhost:3000/api/passes/PASS_ID/checkin
```

### Using a REST Client

Import the following into Postman or similar tools:

**Base URL:** `http://localhost:3000`

**Headers:**
```
Content-Type: application/json
```

## 🚦 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or validation errors
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

All errors include descriptive messages to help with debugging.

## 📈 Development

### Project Structure
```
eden-passes-api/
├── models/
│   └── Pass.js          # MongoDB schema and model
├── routes/
│   └── passes.js        # API routes and handlers
├── server.js            # Main application file
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variables template
└── README.md           # This file
```

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Development Tips

1. **Use nodemon for development** - Automatically restarts server on file changes
2. **Check logs** - Monitor console output for errors and requests
3. **Use MongoDB Compass** - GUI tool for viewing database contents
4. **Test with different data** - Try various pass types and scenarios

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/eden-passes` |
| `JWT_SECRET` | JWT signing secret | Required |
| `SESSION_SECRET` | Session secret | Required |
| `API_VERSION` | API version | `v1` |
| `LOG_LEVEL` | Logging level | `info` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [API documentation](#-api-endpoints)
2. Review the [error responses](#-response-format)
3. Ensure MongoDB is running and accessible
4. Verify environment variables are set correctly
5. Check server logs for detailed error messages

## 🎯 Roadmap

Future enhancements planned:
- [ ] User authentication and authorization
- [ ] Pass templates and bulk creation
- [ ] Email notifications for pass expiry
- [ ] Advanced analytics and reporting
- [ ] Mobile app integration
- [ ] Payment processing integration
- [ ] Audit logging
- [ ] Rate limiting
- [ ] API versioning
- [ ] Comprehensive test suite

---

**Eden Coworking** - Empowering collaborative workspaces 🌱