# 🔗 URL Shortener

A Node.js backend REST API service for URL shortening with MySQL database integration. Provides a robust, production-ready API for creating, managing, and tracking shortened URLs.
## Features

- ✨ **Create Short URLs** - Convert long URLs into short, shareable links
- 🔍 **URL Management** - View, retrieve, and delete shortened URLs
- 📊 **Click Tracking** - Track the number of clicks on each shortened URL
- 🚀 **REST API** - Complete RESTful API for URL operations
- 💾 **MySQL Database** - Reliable data persistence with MySQL

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MySQL with Sequelize ORM
- **Runtime**: Node.js v14+
- **HTTP Client**: Axios / Fetch API

## Project Structure

```
url-shortener/
│   ├── Url.js              # URL database model
│   ├── routes/
│   │   └── url.js          # URL API routes
│   └── index.js            # Database initialization
├── server.js               # Express server setup
├── package.json            # Dependencies
├── .env.example            # Environment variables template
├── Procfile                # Heroku deployment file
└── README.md              # This file
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server (local or remote)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/jaiswalrohit207/url-shortener.git
cd url-shortener
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your MySQL configuration:

```env
PORT=3000
BASE_URL=http://localhost:3000

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=url_shortener
DB_PORT=3306

NODE_ENV=development
```

### Step 4: Create MySQL Database

```sql
CREATE DATABASE url_shortener;
```

### Step 5: Run the Application

```bash
npm start
```

The application will start on `http://localhost:3000`

## API Endpoints

### Create Short URL

```
POST /shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com/very/long/url"
}

Response (201):
{
  "id": 1,
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/abc123",
  "clicks": 0,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Get All URLs

```
GET /

Response (200):
[
  {
    "id": 1,
    "originalUrl": "https://example.com/very/long/url",
    "shortCode": "abc123",
    "shortUrl": "http://localhost:3000/abc123",
    "clicks": 5,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  ...
]
```

### Get URL by Short Code

```
GET /:shortCode

Response (200):
{
  "id": 1,
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/abc123",
  "clicks": 6,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Delete URL

```
DELETE /:shortCode

Response (200):
{
  "message": "URL deleted successfully"
}
```

## Usage

### Web Interface

1. Open `http://localhost:3000` in your browser
2. Enter a long URL in the input field
3. Click "Shorten URL" button
4. Copy the generated short URL
5. Share the short URL with others

### Using cURL

```bash
# Create a short URL
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/very/long/url"}'

# Get all URLs
curl http://localhost:3000/

# Get URL by short code
curl http://localhost:3000/abc123

# Delete URL
curl -X DELETE http://localhost:3000/abc123
```

## Database Schema

### URLs Table

```sql
CREATE TABLE urls (
  id INT PRIMARY KEY AUTO_INCREMENT,
  originalUrl VARCHAR(2048) NOT NULL,
  shortCode VARCHAR(10) UNIQUE NOT NULL,
  shortUrl VARCHAR(2048) NOT NULL,
  clicks INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(shortCode)
);
```

## Deployment

### Deploy to Heroku

1. Install Heroku CLI:
   ```bash
   npm install -g heroku
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```

4. Add MySQL database (using JawsDB or ClearDB):
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

5. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set BASE_URL=https://your-app-name.herokuapp.com
   ```

6. Deploy:
   ```bash
   git push heroku main
   ```

7. View logs:
   ```bash
   heroku logs --tail
   ```

### Deploy to Other Platforms

- **DigitalOcean App Platform**: Connect GitHub repo, set environment variables
- **Railway**: Similar to Heroku, connect GitHub and deploy
- **Render**: Support for Node.js apps with PostgreSQL/MySQL
- **AWS**: Use EC2, RDS for database, and configure with application load balancer

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| PORT | Server port | 3000 |
| DB_HOST | MySQL host | localhost |
| DB_USER | MySQL user | root |
| DB_PASSWORD | MySQL password | - |
| DB_NAME | Database name | url_shortener |
| DB_PORT | MySQL port | 3306 |
| BASE_URL | Base URL for shortened links | http://localhost:3000 |
| NODE_ENV | Environment | development |

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful request
- `201 Created` - URL successfully created
- `400 Bad Request` - Invalid input
- `404 Not Found` - URL not found
- `500 Internal Server Error` - Server error

## Performance Tips

- Use database indexes on `shortCode` for faster lookups
- Implement caching for frequently accessed short URLs
- Monitor database performance and optimize queries
- Use connection pooling for database connections
- Implement rate limiting to prevent abuse

## Security Considerations

- Validate and sanitize all user inputs
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Add CORS headers if serving from different domain
- Validate URL format before shortening
- Consider adding authentication for admin operations

## Troubleshooting

### Connection refused error
- Ensure MySQL server is running
- Check database credentials in `.env`
- Verify host and port configuration

### Port already in use
- Change PORT in `.env` or stop the process using the port

### Database sync errors
- Drop existing tables and restart (development only)
- Check Sequelize configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## Changelog

### v2.0.0 (Current)
- ✅ Migrated from MongoDB to MySQL
- ✅ Implemented Sequelize ORM
- ✅ Added responsive web UI
- ✅ Improved API endpoints
- ✅ Enhanced error handling
- ✅ Added deployment documentation

### v1.0.0
- Initial release with MongoDB backend
