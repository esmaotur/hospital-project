// path: scripts/extract-logs.js
const fs = require('fs');
const path = require('path');

const testFile = path.join(__dirname, '../cypress/e2e/appointments.cy.ts');
const srtFile = 'narration.srt';
const timelineFile = 'timeline.json';

if (!fs.existsSync(testFile)) {
    console.error(`Error: Test file not found at ${testFile}`);
    process.exit(1);
}

const content = fs.readFileSync(testFile, 'utf8');
const lines = content.split('\n');

// Regex to capture "Start-End s: Message"
// Example: cy.log("0-3s: Site açılıyor");
const logRegex = /cy\.log\(["'](\d+)-(\d+)s:\s*(.*?)["']\)/;

let timeline = [];

lines.forEach(line => {
    const match = line.match(logRegex);
    if (match) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        const text = match[3];

        timeline.push({
            start: start,
            end: end, // Useful for debugging or duration checks
            text: text,
            duration: end - start // Approximate duration window
        });
    }
});

// Sort by start time just in case
timeline.sort((a, b) => a.start - b.start);

// Generate SRT
let srtContent = '';
timeline.forEach((item, index) => {
    const start = formatTime(item.start);
    // End subtitle at the end of the window, or start of next item?
    // Using the explicit 'end' from the log is safest.
    const end = formatTime(item.end);
    srtContent += `${index + 1}\n${start} --> ${end}\n${item.text}\n\n`;
});

// Write files
fs.writeFileSync(srtFile, srtContent);
fs.writeFileSync(timelineFile, JSON.stringify(timeline, null, 2));

console.log(`Extracted ${timeline.length} segments using explicit timestamps.`);
console.log(`Generated ${srtFile} and ${timelineFile}`);

function formatTime(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    const iso = date.toISOString().substr(11, 12);
    return iso.replace('.', ',');
}
