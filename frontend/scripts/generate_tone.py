# path: scripts/generate_tone.py
import wave
import math
import struct
import sys

def generate_tone(output_file, duration=5):
    sample_rate = 44100
    frequency = 440.0  # A4
    
    n_samples = int(sample_rate * duration)
    
    try:
        with wave.open(output_file, 'w') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            
            for i in range(n_samples):
                value = int(32767.0 * math.sin(2.0 * math.pi * frequency * i / sample_rate))
                data = struct.pack('<h', value)
                wav_file.writeframesraw(data)
        
        print(f"Generated tone audio: {output_file}")
    except Exception as e:
        print(f"Error generating tone: {e}")
        sys.exit(1)

if __name__ == "__main__":
    output = "narration.mp3" # Saving as mp3 name but content is wav, ffmpeg should handle it
    if len(sys.argv) > 1:
        output = sys.argv[1]
    
    generate_tone(output)
