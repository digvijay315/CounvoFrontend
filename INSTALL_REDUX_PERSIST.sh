#!/bin/bash

# Redux Persist Installation Script
# Run this script to install redux-persist if not already installed

echo "🚀 Installing redux-persist..."
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the counvo_frontend directory"
    exit 1
fi

# Install redux-persist
npm install redux-persist

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ redux-persist installed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. The code is already updated to use redux-persist"
    echo "2. Just run: npm start"
    echo "3. Test login/logout functionality"
    echo "4. Check browser localStorage for 'persist:root' key"
    echo ""
    echo "📖 For migration guide, see:"
    echo "   - REDUX_PERSIST_SETUP.md"
    echo "   - redux/MIGRATION_GUIDE_REDUX_PERSIST.md"
else
    echo ""
    echo "❌ Installation failed!"
    echo "Please try manually: npm install redux-persist"
    exit 1
fi

