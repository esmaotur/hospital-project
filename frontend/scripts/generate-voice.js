// path: scripts/generate-voice.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const scriptPath = path.join(__dirname, 'elevenlabs_tts.py');

console.log('Generating segmented ElevenLabs audio...');

// Pass the API key from process.env
const env = { ...process.env };

const command = `python3 ${scriptPath}`;

exec(command, { env }, (error, stdout, stderr) => {
    if (error) {
        console.error('Voice generation error:', error.message);
        console.error(stdout);
        process.exit(1);
    }
    console.log(stdout);
    console.log('✔ Voice generation complete!');
});
