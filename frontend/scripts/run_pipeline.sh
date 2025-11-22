#!/bin/bash
# path: scripts/run_pipeline.sh

echo "========================================="
echo "Hospital Project - Perfect Sync Pipeline (Robust)"
echo "========================================="

# 1. Clean Port 3005
echo "Cleaning port 3005..."
lsof -ti:3005 | xargs -r kill -9 2>/dev/null
pkill -f "next-server" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# 2. Clean old artifacts
rm -rf audio_segments
rm -f timeline.json narration.srt narration.mp3 final-demo.mp4 segments.json

# 3. Start Server Manually
echo "Starting Next.js server..."
npm run dev > server.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# 4. Wait for Server
echo "Waiting for server to be ready..."
MAX_RETRIES=60
COUNT=0
while [ $COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:3005 > /dev/null; then
        echo "✔ Server is up!"
        break
    fi
    echo "Waiting... ($COUNT/$MAX_RETRIES)"
    sleep 2
    COUNT=$((COUNT+1))
done

if [ $COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Server failed to start."
    cat server.log
    kill $SERVER_PID
    exit 1
fi

# 5. Run Cypress Test (Directly)
echo ""
echo "Step 1/4: Running Cypress tests (Generating Timeline)..."
npx cypress run --config video=true > cypress.log 2>&1
CYPRESS_EXIT_CODE=$?

# Stop server immediately after test
kill $SERVER_PID

if [ $CYPRESS_EXIT_CODE -ne 0 ]; then
    echo "❌ Cypress tests failed"
    cat cypress.log
    exit 1
fi

# 6. Extract Logs & Timeline
echo ""
echo "Step 2/4: Extracting logs & timeline..."
node scripts/extract-logs.js

# 7. Generate Voice
echo ""
echo "Step 3/4: Generating Voice (ElevenLabs)..."
node scripts/generate-voice.js
if [ $? -ne 0 ]; then
    echo "❌ Voice generation failed."
    exit 1
fi

# 8. Merge
echo ""
echo "Step 4/4: Merging..."
node scripts/merge-video-audio.js

echo ""
echo "========================================="
echo "Pipeline ready: final-demo.mp4"
echo "========================================="
exit 0
