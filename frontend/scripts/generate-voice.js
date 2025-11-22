// path: scripts/generate-voice.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const segmentsFile = 'segments.json';
const outputDir = 'audio_segments';
const scriptPath = path.join(__dirname, 'elevenlabs_tts.py');

if (!fs.existsSync(segmentsFile)) {
    console.error('Error: segments.json not found.');
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const segments = JSON.parse(fs.readFileSync(segmentsFile, 'utf8'));

console.log(`Generating ${segments.length} voice segments...`);

// Helper to run python script
const generateSegment = (text, outputFile) => {
    return new Promise((resolve, reject) => {
        // We need to pass text securely. 
        // Writing to a temp file is safer than CLI args for long text, 
        // but for short logs CLI args are okay if escaped.
        // Let's use the python script's ability to read from file if we update it, 
        // or just pass args. The previous python script took (text, output).

        // Let's update python script to take arguments directly.
        const command = `python3 "${scriptPath}" "${text}" "${outputFile}"`;

        exec(command, { env: process.env }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error generating "${text}":`, stderr);
                reject(error);
            } else {
                console.log(`Generated: ${outputFile}`);
                resolve();
            }
        });
    });
};

// Run sequentially to avoid rate limits
const run = async () => {
    for (const segment of segments) {
        const outputFile = path.join(outputDir, `${segment.id}.mp3`);
        // Skip if exists? No, user wants fresh rebuild.
        await generateSegment(segment.text, outputFile);
    }
    console.log('✔ All voice segments generated.');
};

run().catch(err => {
    console.error('Voice generation failed:', err);
    process.exit(1);
});
