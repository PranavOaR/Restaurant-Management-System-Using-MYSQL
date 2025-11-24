#!/bin/bash

# Restaurant Management System - Quick Start Script

echo "=========================================="
echo "🍽️  Restaurant Management System"
echo "Quick Start Setup"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ npm version: $(npm -v)"

# Setup Backend
echo ""
echo "=========================================="
echo "Setting up Backend..."
echo "=========================================="

cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✓ Backend dependencies already installed"
fi

echo "✓ Backend ready!"
echo "To start backend: cd backend && npm run dev"

# Setup Frontend
echo ""
echo "=========================================="
echo "Setting up Frontend..."
echo "=========================================="

cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✓ Frontend dependencies already installed"
fi

echo "✓ Frontend ready!"
echo "To start frontend: cd frontend && npm run dev"

# Print instructions
echo ""
echo "=========================================="
echo "🚀 Ready to Start!"
echo "=========================================="
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open in Browser:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo ""
echo "Admin Password: admin123"
echo ""
echo "=========================================="
