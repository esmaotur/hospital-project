#!/usr/bin/env python3
# path: scripts/elevenlabs_tts.py
import sys
import os
import json
import urllib.request
import urllib.error

def generate_segment(text, output_file, api_key):
    # Voice ID: Rachel (English) - 21m00Tcm4TlvDq8ikWAM
    # Using 'eleven_multilingual_v2' for Turkish.
    voice_id = "21m00Tcm4TlvDq8ikWAM" 
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }

    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req) as response:
            with open(output_file, 'wb') as f:
                f.write(response.read())
        print(f"Generated: {output_file}")
    except Exception as e:
        print(f"Error generating {output_file}: {e}")
        sys.exit(1)

def main():
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not set.")
        sys.exit(1)

    if not os.path.exists('timeline.json'):
        print("Error: timeline.json not found.")
        sys.exit(1)

    with open('timeline.json', 'r', encoding='utf-8') as f:
        timeline = json.load(f)

    output_dir = "audio_segments"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print(f"Generating audio for {len(timeline)} segments...")

    for i, item in enumerate(timeline):
        text = item['text']
        output_file = os.path.join(output_dir, f"{i}.mp3")
        
        # Skip if already exists (optional, but good for retries)
        # For now, overwrite to be safe
        generate_segment(text, output_file, api_key)

if __name__ == "__main__":
    main()
