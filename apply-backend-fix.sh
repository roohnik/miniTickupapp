#!/bin/bash
# Backend Fix Script for KeyResult.hasMany Error
# This script applies the fix to the Tickappback backend repository

set -e

echo "========================================="
echo "Backend Fix Script"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "models/keyResult.js" ] || [ ! -f "models/process.js" ]; then
    echo "❌ Error: This script must be run from the Tickappback root directory"
    echo "   Please navigate to the backend repository first:"
    echo "   cd /path/to/Tickappback"
    exit 1
fi

echo "✅ Found backend repository"
echo ""

# Backup files
echo "📦 Creating backups..."
cp models/keyResult.js models/keyResult.js.bak
cp models/process.js models/process.js.bak
echo "   ✅ Backed up keyResult.js"
echo "   ✅ Backed up process.js"
echo ""

# Fix keyResult.js
echo "🔧 Fixing models/keyResult.js..."
sed -i.tmp '72,75s/^/    \/\/ /' models/keyResult.js
sed -i.tmp '72i\    \/\/ TODO: Create Comment model before uncommenting' models/keyResult.js
rm -f models/keyResult.js.tmp
echo "   ✅ Fixed Comment association"
echo ""

# Fix process.js
echo "🔧 Fixing models/process.js..."
sed -i.tmp '46,49s/^/    \/\/ /' models/process.js
sed -i.tmp '46i\    \/\/ TODO: Create Variable model before uncommenting' models/process.js
rm -f models/process.js.tmp
echo "   ✅ Fixed Variable association"
echo ""

echo "========================================="
echo "✅ Fix Applied Successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Review the changes: git diff models/"
echo "2. Start the server: npm start"
echo "3. Verify: bash /path/to/verify-backend-fix.sh"
echo ""
echo "To undo the changes:"
echo "  cp models/keyResult.js.bak models/keyResult.js"
echo "  cp models/process.js.bak models/process.js"
