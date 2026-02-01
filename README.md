# HRM Project Setup Guide

A comprehensive guide for teammates to set up and run the HRM (Human Resource Management) project locally.

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **MySQL Server** (v8.0 or higher)
   - Download from: https://www.mysql.com/downloads/mysql/
   - For Windows, you can use MySQL Community Server
   - Verify installation: `mysql --version`

3. **Git** (for version control)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **Code Editor** (VS Code recommended)
   - Download from: https://code.visualstudio.com/

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd HRM
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Create Environment Variables
Create a `.env` file in the `backend` folder with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hrm_database

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_secret_key_here

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# AI/Chatbot Configuration (Optional)
GOOGLE_AI_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

> **Note:** Replace placeholder values with your actual credentials.

#### 2.4 Create MySQL Database

Option A: Using MySQL Command Line
```bash
# Open MySQL Command Line
mysql -u root -p

# Create database
CREATE DATABASE hrm_database;
EXIT;
```

Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Create a new database named `hrm_database`

#### 2.5 Seed Database (Optional but Recommended)
```bash
npm run seed
```

This will populate your database with sample data.

#### 2.6 Migration Scripts (Only if needed)
In the backend root folder, there are migration/fix scripts:
- `fix_db.js` - Adds attendance status column
- `fix_db_schema.js` - Adds roleId column and constraints
- `fix_enum.js` - Updates employment type enum values

**You typically don't need to run these manually** - they're for fixing specific schema issues. Run them only if you encounter database column errors:

```bash
# Only run if specifically instructed or if you get column-related errors
node fix_db.js
node fix_db_schema.js
node fix_enum.js
```

#### 2.7 Start Backend Server
```bash
npm run dev
```

The backend should be running at: `http://localhost:5000`

You should see a message: `MySQL connected` and `Models synced`

---

### Step 3: Frontend Setup

#### 3.1 Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Create Environment Variables (if needed)
Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

#### 3.4 Start Frontend Server
```bash
npm run dev
```

The frontend should be running at: `http://localhost:5173`

---

## ✅ Verification Checklist

- [ ] Backend server is running on `http://localhost:5000`
- [ ] Frontend is running on `http://localhost:5173`
- [ ] MySQL database is connected (check backend terminal)
- [ ] No console errors in frontend
- [ ] You can navigate to `http://localhost:5173` in your browser

## 🔧 Troubleshooting

### MySQL Connection Error
**Problem:** "ER_ACCESS_DENIED_FOR_USER"
- Check your DB_USER and DB_PASSWORD in `.env`
- Ensure MySQL server is running
- Verify the database exists: `SHOW DATABASES;`

### Port Already in Use
**Problem:** "Error: listen EADDRINUSE :::5000"
- Change the PORT in `.env` file
- Or kill the process: `netstat -ano | findstr :5000` (Windows)

### Dependencies Installation Failed
**Problem:** npm install errors
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### Module Not Found Errors
- Ensure you're in the correct directory (backend or frontend)
- Run `npm install` again
- Verify the import paths in error messages

### Database Seeding Issues
```bash
# First, check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# If needed, manually reset:
mysql -u root -p -e "DROP DATABASE IF EXISTS hrm_database; CREATE DATABASE hrm_database;"

# Then run seed again
npm run seed
```

## 📁 Project Structure

```
HRM/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Express middlewares
│   │   ├── utils/           # Utility functions
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── scripts/             # Database scripts (seed, sync, etc.)
│   ├── public/uploads/      # File uploads directory
│   ├── .env                 # Environment variables (create this)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   ├── contexts/       # React contexts
    │   ├── App.jsx         # Main App component
    │   └── main.jsx        # Entry point
    ├── .env                # Environment variables (create this)
    └── package.json
```

## 🔐 Important Security Notes

1. **Never commit `.env` files** to git
2. **Use strong passwords** for database and JWT
3. **Update API keys and credentials** regularly
4. **Use environment-specific configs** (dev, staging, production)

## 📚 Available Scripts

### Backend
```bash
npm run dev      # Start development server with hot-reload
npm run seed     # Seed database with initial data
npm test         # Run tests (if available)
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 🆘 Still Having Issues?

1. Check console errors carefully
2. Verify all environment variables are set correctly
3. Ensure MySQL server is running
4. Check if ports 5000 and 5173 are available
5. Try restarting both servers
6. Ask a team member for help or check project documentation

## 📞 Team Support

For additional help:
- Contact the project lead or senior developer
- Check internal documentation or wiki
- Review git commit messages for context
- Check issue tracker for similar problems

---

**Last Updated:** January 30, 2026
