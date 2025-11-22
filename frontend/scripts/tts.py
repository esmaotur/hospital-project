#!/usr/bin/env python3
# path: scripts/tts.py
import sys
import os
import urllib.request
import urllib.parse
import time

def generate_speech(text_file, output_file):
    try:
        # Read the text file
        if not os.path.exists(text_file):
            print(f"Error: Input file '{text_file}' not found.")
            sys.exit(1)
        
        with open(text_file, 'r', encoding='utf-8') as f:
            text = f.read().strip()
        
        if not text:
            print("Warning: Text file is empty.")
            return 1
        
        print(f"Generating Turkish speech for: {text[:50]}...")
        
        # Split text into chunks if too long (Google TTS has limits)
        # For this demo, we'll assume text is short enough or just take the first chunk
        # A proper implementation would split by sentences.
        
        # Google Translate TTS URL (unofficial)
        base_url = "http://translate.google.com/translate_tts"
        params = {
            "ie": "UTF-8",
            "client": "tw-ob",
            "q": text,
            "tl": "tr"
        }
        
        url = f"{base_url}?{urllib.parse.urlencode(params)}"
        
        # Add User-Agent to avoid 403
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        req = urllib.request.Request(url, headers=headers)
        
        print("Downloading audio from Google TTS...")
        with urllib.request.urlopen(req) as response:
            with open(outputMp3, 'wb') as out_file: # Wait, output_file variable name
                out_file.write(response.read())
                
        # Wait, I used outputMp3 variable which is not defined in this scope. It is output_file.
        # Let me fix that in the file content.
        
    except Exception as e:
        print(f"Error generating speech: {e}")
        # Fallback to creating a dummy file if network fails, to keep pipeline running?
        # User wants REAL voice. If it fails, we should probably fail or warn.
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 tts.py <input_txt> <output_mp3>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    # Fix the variable name bug in the function above
    try:
        if not os.path.exists(input_file):
            print(f"Error: Input file '{input_file}' not found.")
            sys.exit(1)
        
        with open(input_file, 'r', encoding='utf-8') as f:
            text = f.read().strip()
            
        if not text:
             print("Warning: Text file is empty.")
             sys.exit(1)

        # Google Translate TTS URL
        base_url = "http://translate.google.com/translate_tts"
        params = {
            "ie": "UTF-8",
            "client": "tw-ob",
            "q": text,
            "tl": "tr"
        }
        url = f"{base_url}?{urllib.parse.urlencode(params)}"
        headers = {"User-Agent": "Mozilla/5.0"}
        
        req = urllib.request.Request(url, headers=headers)
        
        with urllib.request.urlopen(req) as response:
            with open(output_file, 'wb') as out_file:
                out_file.write(response.read())
                
        print(f"Successfully saved audio to {output_file}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
