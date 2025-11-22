// path: scripts/extract-logs.js
const fs = require('fs');
const path = require('path');

const timelineFile = 'timeline.json';
const srtFile = 'narration.srt';
const segmentsFile = 'segments.json';

if (!fs.existsSync(timelineFile)) {
    console.error(`Error: ${timelineFile} not found.`);
    process.exit(1);
}

const timeline = JSON.parse(fs.readFileSync(timelineFile, 'utf8'));

if (timeline.length === 0) {
    console.error('Error: Timeline is empty.');
    process.exit(1);
}

// Calculate relative times
// The first event is t=0 (or slightly after video start)
// We'll assume the video starts recording roughly when the test starts.
// To be safe, we can use the first timestamp as the base.
const startTime = timeline[0].timestamp;

const segments = timeline.map((item, index) => {
    const relativeStartMs = item.timestamp - startTime;
    const relativeStartSec = relativeStartMs / 1000;

    // Estimate duration until next event, or default 3s for last
    let durationSec = 3;
    if (index < timeline.length - 1) {
        durationSec = (timeline[index + 1].timestamp - item.timestamp) / 1000;
    }

    return {
        id: index,
        text: item.message,
        start: relativeStartSec,
        end: relativeStartSec + durationSec,
        duration: durationSec
    };
});

// Generate SRT
let srtContent = '';
segments.forEach((item, index) => {
    const start = formatTime(item.start);
    const end = formatTime(item.end);
    srtContent += `${index + 1}\n${start} --> ${end}\n${item.text}\n\n`;
});

// Write files
fs.writeFileSync(srtFile, srtContent);
fs.writeFileSync(segmentsFile, JSON.stringify(segments, null, 2));

console.log(`Extracted ${segments.length} segments.`);
console.log(`Generated ${srtFile} and ${segmentsFile}`);

function formatTime(seconds) {
    const date = new Date(0);
    date.setMilliseconds(seconds * 1000);
    const iso = date.toISOString().substr(11, 12);
    return iso.replace('.', ',');
}
