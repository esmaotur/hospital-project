#!/usr/bin/env python3
# path: scripts/elevenlabs_tts.py
import sys
import os
import json
import urllib.request
import urllib.error

def generate_speech(text, output_file):
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not set.")
        sys.exit(1)

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
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 elevenlabs_tts.py <text> <output_mp3>")
        sys.exit(1)

    generate_speech(sys.argv[1], sys.argv[2])
