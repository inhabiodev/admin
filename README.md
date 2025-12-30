# Blog Backend API with Admin Panel

A Node.js REST API for managing blog posts with MongoDB and a built-in React admin panel.

## Features

- Full CRUD operations for blog posts
- **Built-in React Admin Panel** - Create, edit, delete, and preview blogs
- **Quill.js Rich Text Editor** with Delta format storage
- Auto-generated slugs from titles
- Image upload support
- Input validation
- Filtering and pagination
- Tag-based categorization

## Blog Post Schema

- **title**: String (required, max 255 characters)
- **slug**: Auto-generated from title (unique)
- **content**: Quill Delta JSON (required)
- **description**: String (required, max 500 characters)
- **tag**: Enum (appliance care, flooring care, home painting, bathroom remodeling, kitchen remodeling)
- **image**: File upload (images only)
- **keyTakeaways**: String (optional)
- **author**: String (required)
- **estimatedDuration**: Number (optional, min 1)

## Installation

1. Install dependencies (backend + admin panel):
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```
Edit `.env` and set your MongoDB connection string.

3. Build the admin panel:
```bash
npm run build
```

4. Start the server:
```bash
# Development mode (API only)
npm run dev

# Production mode (API + Admin Panel)
npm start
```

5. Access the application:
- **Admin Panel**: http://localhost:5000/
- **API**: http://localhost:5000/api/blogs

## API Endpoints

### Create Blog Post
```
POST /api/blogs
Content-Type: multipart/form-data

Body:
- title (required)
- content (required - Quill Delta JSON string)
- description (required)
- author (required)
- tag (optional)
- image (optional, file)
- keyTakeaways (optional)
- estimatedDuration (optional)
```

**Note**: Content must be in Quill Delta JSON format:
```json
{
  "ops": [
    {"insert": "Hello "},
    {"insert": "World", "attributes": {"bold": true}},
    {"insert": "\n"}
  ]
}
```

### Get All Blog Posts
```
GET /api/blogs?tag=appliance care&page=1&limit=10&sort=-createdAt
```

Query parameters:
- `tag`: Filter by tag
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (default: -createdAt)

### Get Blog Post by Slug
```
GET /api/blogs/slug/:slug
```

### Get Blog Post by ID
```
GET /api/blogs/:id
```

### Update Blog Post
```
PUT /api/blogs/:id
Content-Type: multipart/form-data

Body: (all fields optional)
- title
- content
- description
- author
- tag
- image (file)
- keyTakeaways
- estimatedDuration
```

### Delete Blog Post
```
DELETE /api/blogs/:id
```

## Response Format

Success response:
```json
{
  "success": true,
  "data": { ... }
}
```

Error response:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

## MongoDB Setup

### Local MongoDB
```bash
# Start MongoDB
mongod
```

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env

## Project Structure

```
├── admin-panel/             # React Admin Panel
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── BlogList.js
│   │   │   ├── BlogForm.js
│   │   │   └── BlogPreview.js
│   │   ├── services/        # API services
│   │   └── styles/          # CSS files
│   └── build/               # Production build (served by backend)
├── controllers/
│   └── blogController.js    # Route handlers
├── middleware/
│   ├── upload.js            # File upload config
│   └── validation.js        # Input validation
├── models/
│   └── BlogPost.js          # MongoDB schema (Delta format)
├── routes/
│   └── blogRoutes.js        # API routes
├── uploads/                 # Uploaded images
├── .env                     # Environment variables
├── server.js                # Express app + Static file server
└── package.json
```

## Admin Panel Features

- **Blog List**: View all blogs with filtering and pagination
- **Create/Edit**: Rich text editor (Quill.js) with Delta format
- **Preview**: See how the blog will be displayed
- **Delete**: Remove blog posts
- **Image Upload**: Upload featured images
- **Responsive Design**: Works on desktop and mobile

## Development

### Backend Development
Run in development mode with auto-reload:
```bash
npm run dev
```

### Admin Panel Development
For React development with hot reload:
```bash
cd admin-panel
npm start
```
This runs the React dev server on port 3000 with API proxying.

### Production Build
Build the admin panel for production:
```bash
npm run build
```

## Deployment

1. Set environment variables (MongoDB URI, PORT)
2. Run `npm install` (installs both backend and admin panel)
3. Run `npm run build` (builds React app)
4. Run `npm start` (serves both API and admin panel)

## License

ISC
