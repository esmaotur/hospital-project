// path: scripts/merge-video-audio.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoPath = 'cypress/videos/appointments.cy.ts.mp4';
const outputPath = 'final-demo.mp4';
const timelinePath = 'timeline.json';
const srtPath = 'narration.srt';
const audioDir = 'audio_segments';

if (!fs.existsSync(videoPath) || !fs.existsSync(timelinePath)) {
    console.error('Error: Missing video or timeline file.');
    process.exit(1);
}

const timeline = JSON.parse(fs.readFileSync(timelinePath, 'utf8'));
const ffmpegCmd = fs.existsSync('./ffmpeg') ? './ffmpeg' : 'ffmpeg';

// Construct FFmpeg arguments
let args = ['-i', videoPath];
let filterComplex = '';
let mixInputs = '';

// Add audio inputs
timeline.forEach((item, index) => {
    const audioFile = path.join(audioDir, `${index}.mp3`);
    if (fs.existsSync(audioFile)) {
        args.push('-i', audioFile);

        const inputIdx = index + 1; // 0 is video
        // Apply -1000ms offset to fix lag
        let delay = Math.round(item.start * 1000) - 1000;
        if (delay < 0) delay = 0; // Prevent negative delay

        // [1:a]adelay=1000|1000[a0];
        filterComplex += `[${inputIdx}:a]adelay=${delay}|${delay}[a${index}];`;
        mixInputs += `[a${index}]`;
    }
});

// Mix audio
// [a0][a1]...amix=inputs=N:dropout_transition=0[mixed_audio];
filterComplex += `${mixInputs}amix=inputs=${timeline.length}:dropout_transition=0[mixed_audio];`;

// Burn subtitles
// [0:v]subtitles=narration.srt[v_sub]
filterComplex += `[0:v]subtitles=${srtPath}[v_sub]`;

args.push('-filter_complex', filterComplex);
args.push('-map', '[v_sub]');
args.push('-map', '[mixed_audio]');
args.push('-c:v', 'libx264');
args.push('-c:a', 'aac');
args.push('-shortest');
args.push('-y');
args.push(outputPath);

console.log('Merging video, segmented audio, and subtitles...');
console.log(`Running: ${ffmpegCmd} ... (args hidden for brevity)`);

const ffmpeg = spawn(ffmpegCmd, args);

ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ffmpeg.stderr.on('data', (data) => {
    // FFmpeg logs to stderr
    // console.error(`stderr: ${data}`); 
});

ffmpeg.on('close', (code) => {
    if (code === 0) {
        console.log('✔ Merge complete: final-demo.mp4');
        // Verify file size
        if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        }
    } else {
        console.error(`FFmpeg process exited with code ${code}`);
        process.exit(code);
    }
});
