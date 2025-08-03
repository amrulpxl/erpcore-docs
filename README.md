# ERPCore Documentation

 web application for managing and displaying server rules and gamemode changelogs for SA-MP (San Andreas Multiplayer) roleplay servers.

## Features

### Frontend
- **React.js** with Tailwind CSS for modern, responsive design
- **Markdown rendering** for rules and changelog content
- **Responsive navigation** with mobile support
- **Search and filtering** capabilities
- **Visual indicators** for new/updated content
- **Admin panel** with authentication

### Backend
- **Node.js** with Express.js REST API
- **SQLite** database for data persistence
- **JWT authentication** for admin access
- **Rate limiting** and security middleware
- **Full CRUD operations** for rules and changelog entries

### Admin Features
- Token-based authentication system
- Built-in Markdown editor for content creation
- Create, edit, and delete rules and changelog entries
- Version control and release date management
- Real-time content preview

## Project Structure

```
erpcore-docs/
├── backend/                 # Express.js API server
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API route handlers
│   ├── scripts/            # Database seeding scripts
│   └── server.js           # Main server file
├── frontend/               # React.js application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   └── main.jsx        # Application entry point
│   └── package.json
├── package.json            # Root package.json for scripts
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone and setup the project:**
```bash
git clone https://github.com/amrulpxl/erpcore-docs.git
cd erpcore-docs
npm run setup
```

**For Server Owners:** See [INSTALL.md](INSTALL.md) for a simplified installation guide.

2. **Configure environment variables:**
```bash
cp .env.example backend/.env
# Edit backend/.env with your configuration
```

3. **Seed the database with example data:**
```bash
cd backend
npm run seed
```

4. **Start the development servers:**
```bash
# From the root directory
npm run dev
```

This will start:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:3000

## Environment Configuration

Create a `backend/.env` file with the following variables:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
DB_PATH=./database/erpcore.db
FRONTEND_URL=http://localhost:3000
```

## Default Admin Credentials

For initial setup and testing:
- **Username:** admin
- **Password:** admin123

**Important:** Change these credentials in production by creating a proper admin user through the API.

## API Endpoints

### Public Endpoints
- `GET /api/rules` - Get all active rules
- `GET /api/rules/:id` - Get specific rule
- `GET /api/rules/meta/categories` - Get all rule categories
- `GET /api/changelog` - Get all published changelog entries
- `GET /api/changelog/:id` - Get specific changelog entry
- `GET /api/changelog/meta/latest` - Get latest changelog entry

### Admin Endpoints (Require Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/rules` - Create new rule
- `PUT /api/rules/:id` - Update rule
- `DELETE /api/rules/:id` - Delete rule
- `POST /api/changelog` - Create changelog entry
- `PUT /api/changelog/:id` - Update changelog entry
- `DELETE /api/changelog/:id` - Delete changelog entry

## Database Schema

### Rules Table
- `id` - Primary key
- `title` - Rule title
- `content` - Markdown content
- `category` - Rule category
- `version` - Rule version
- `is_active` - Active status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Changelog Table
- `id` - Primary key
- `title` - Update title
- `content` - Markdown content
- `version` - Release version
- `release_date` - Release date
- `is_published` - Published status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Admin Users Table
- `id` - Primary key
- `username` - Admin username
- `password_hash` - Hashed password
- `created_at` - Creation timestamp
- `last_login` - Last login timestamp

## Development Scripts

### Root Directory
```bash
npm run dev          # Start both frontend and backend in development mode
npm run setup        # Install all dependencies
npm run server:dev   # Start only backend server
npm run client:dev   # Start only frontend server
npm run client:build # Build frontend for production
```

### Backend Directory
```bash
npm start           # Start production server
npm run dev         # Start development server with nodemon
npm run seed        # Seed database with example data
```

### Frontend Directory
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## Production Deployment

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Configure production environment:**
```bash
# Update backend/.env for production
NODE_ENV=production
JWT_SECRET=your-production-secret
# ... other production settings
```

3. **Start the production server:**
```bash
cd backend
npm start
```

4. **Serve frontend static files:**
Configure your web server (nginx, Apache) to serve the `frontend/dist` directory and proxy API requests to the backend server.

## Security Considerations

- Change default admin credentials
- Use strong JWT secrets in production
- Enable HTTPS in production
- Configure proper CORS settings
- Implement rate limiting (already included)
- Regular database backups
- Keep dependencies updated

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
