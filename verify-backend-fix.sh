#!/bin/bash
# Test script to verify the backend fix works
# This script tests the model loading after applying the fix

echo "========================================"
echo "Backend Fix Verification Test"
echo "========================================"
echo ""

# Check if we're in the Tickappback directory
if [ ! -f "models/keyResult.js" ]; then
    echo "❌ Error: Not in Tickappback directory"
    echo "   Please run this script from the backend root directory"
    exit 1
fi

echo "📋 Checking for required files..."
if [ ! -f "models/keyResult.js" ]; then
    echo "❌ models/keyResult.js not found"
    exit 1
fi

if [ ! -f "models/process.js" ]; then
    echo "❌ models/process.js not found"
    exit 1
fi

echo "✅ Required files found"
echo ""

echo "🔍 Checking for problematic associations..."

# Check KeyResult - look for uncommented lines with the problematic association
KEYRESULT_CHECK=$(grep "KeyResult.hasMany(models.Comment" models/keyResult.js | grep -v "^[[:space:]]*//")
if [ -n "$KEYRESULT_CHECK" ]; then
    echo "⚠️  Found active Comment association in keyResult.js"
    echo "   This needs to be commented out"
    HAS_ERROR=1
else
    echo "✅ KeyResult Comment association is commented out or removed"
fi

# Check Process - look for uncommented lines with the problematic association
PROCESS_CHECK=$(grep "Process.hasMany(models.Variable" models/process.js | grep -v "^[[:space:]]*//")
if [ -n "$PROCESS_CHECK" ]; then
    echo "⚠️  Found active Variable association in process.js"
    echo "   This needs to be commented out"
    HAS_ERROR=1
else
    echo "✅ Process Variable association is commented out or removed"
fi

echo ""

if [ -n "$HAS_ERROR" ]; then
    echo "❌ Fix has not been applied yet"
    echo ""
    echo "To apply the fix, run:"
    echo "  patch -p1 < /path/to/backend-fix.patch"
    echo ""
    echo "Or manually comment out the problematic associations"
    exit 1
fi

echo "✅ All checks passed!"
echo ""
echo "🧪 Testing model loading..."

# Create a temporary test script in the current directory
cat > test-models-temp.js << 'EOF'
try {
  require("dotenv").config();
} catch (e) {
  // dotenv not available, that's ok for testing
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/testdb";
}
try {
  const { models } = require("./models/index.js");
  console.log("✅ SUCCESS! All models loaded without errors.");
  console.log("");
  console.log("Loaded", Object.keys(models).filter(k => k !== 'sequelize' && k !== 'Sequelize').length, "models");
  if (models.KeyResult) {
    console.log("KeyResult associations:", Object.keys(models.KeyResult.associations || {}).join(", "));
  }
  if (models.Process) {
    console.log("Process associations:", Object.keys(models.Process.associations || {}).join(", "));
  }
  process.exit(0);
} catch (error) {
  console.error("❌ ERROR loading models:");
  console.error(error.message);
  process.exit(1);
}
EOF

# Run the test
node test-models-temp.js
TEST_RESULT=$?

# Clean up
rm -f test-models-temp.js

echo ""
if [ $TEST_RESULT -eq 0 ]; then
    echo "========================================"
    echo "✅ VERIFICATION COMPLETE - ALL TESTS PASSED"
    echo "========================================"
    echo ""
    echo "The backend fix has been successfully applied!"
    echo "You can now start the server with: npm start"
else
    echo "========================================"
    echo "❌ VERIFICATION FAILED"
    echo "========================================"
    echo ""
    echo "The models could not be loaded. Check the error above."
fi

exit $TEST_RESULT
