#!/bin/bash
# path: scripts/run_pipeline.sh

echo "========================================="
echo "Hospital Project - ElevenLabs Pipeline (Sync & Subs)"
echo "========================================="

# 1. Clean Port 3005
echo "Cleaning port 3005..."
lsof -ti:3005 | xargs -r kill -9 2>/dev/null
pkill -f "next-server" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# 2. Clean old artifacts
rm -rf audio_segments
rm -f timeline.json narration.srt narration.mp3 final-demo.mp4

# 3. Run Cypress Test
echo ""
echo "Step 1/4: Running Cypress tests..."
npm run cy:test
if [ $? -ne 0 ]; then
    echo "❌ Cypress tests failed"
    exit 1
fi

# 4. Extract Logs
echo ""
echo "Step 2/4: Extracting logs..."
npm run cy:extract

# 5. Generate Voice
echo ""
echo "Step 3/4: Generating Voice (ElevenLabs)..."
npm run cy:voice
if [ $? -ne 0 ]; then
    echo "❌ Voice generation failed."
    exit 1
fi

# 6. Merge
echo ""
echo "Step 4/4: Merging..."
npm run cy:merge

echo ""
echo "========================================="
echo "Pipeline ready"
echo "========================================="
exit 0
