// path: scripts/merge-video-audio.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoPath = 'cypress/videos/appointments.cy.ts.mp4';
const outputPath = 'final-demo.mp4';
const segmentsFile = 'segments.json';
const srtPath = 'narration.srt';
const audioDir = 'audio_segments';

if (!fs.existsSync(videoPath) || !fs.existsSync(segmentsFile)) {
    console.error('Error: Missing video or segments file.');
    process.exit(1);
}

const segments = JSON.parse(fs.readFileSync(segmentsFile, 'utf8'));
const ffmpegCmd = fs.existsSync('./ffmpeg') ? './ffmpeg' : 'ffmpeg';

// Construct FFmpeg arguments
let args = ['-i', videoPath];
let filterComplex = '';
let mixInputs = '';

// Add audio inputs
segments.forEach((item, index) => {
    const audioFile = path.join(audioDir, `${item.id}.mp3`);
    if (fs.existsSync(audioFile)) {
        args.push('-i', audioFile);

        const inputIdx = index + 1; // 0 is video
        // Convert seconds to ms
        // Add slight offset if needed, but real-time should be accurate.
        // Let's stick to exact timestamp from Cypress.
        let delay = Math.round(item.start * 1000);

        // [1:a]adelay=1000|1000[a0];
        filterComplex += `[${inputIdx}:a]adelay=${delay}|${delay}[a${index}];`;
        mixInputs += `[a${index}]`;
    }
});

// Mix audio
// [a0][a1]...amix=inputs=N:dropout_transition=0[mixed_audio];
if (mixInputs) {
    filterComplex += `${mixInputs}amix=inputs=${segments.length}:dropout_transition=0[mixed_audio];`;
} else {
    // No audio segments?
    console.warn("No audio segments found!");
    process.exit(0);
}

// Burn subtitles
// [0:v]subtitles=narration.srt:force_style='FontName=Arial,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BackColour=&H80000000,BorderStyle=3'[v_sub]
// Using simple subtitles filter first.
// Note: subtitles filter requires escaping for filename if it has special chars. 'narration.srt' is safe.
filterComplex += `[0:v]subtitles=${srtPath}:force_style='FontName=Arial,FontSize=24'[v_sub]`;

args.push('-filter_complex', filterComplex);
args.push('-map', '[v_sub]');
args.push('-map', '[mixed_audio]');

// Quality Settings
args.push('-c:v', 'libx264');
args.push('-preset', 'slow');
args.push('-crf', '18'); // High quality
args.push('-c:a', 'aac');
args.push('-b:a', '192k');

args.push('-shortest');
args.push('-y');
args.push(outputPath);

console.log('Merging video, segmented audio, and subtitles...');
console.log(`Running: ${ffmpegCmd} ...`);

const ffmpeg = spawn(ffmpegCmd, args);

ffmpeg.stdout.on('data', (data) => { console.log(`stdout: ${data}`); });
ffmpeg.stderr.on('data', (data) => {
    // console.error(`stderr: ${data}`); 
});

ffmpeg.on('close', (code) => {
    if (code === 0) {
        console.log('✔ Merge complete: final-demo.mp4');
    } else {
        console.error(`FFmpeg process exited with code ${code}`);
        process.exit(code);
    }
});
