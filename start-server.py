#!/usr/bin/env python3
"""
Simple HTTP Server for Zoza Gateway Snacks
Run this script to start a local development server
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def main():
    # Change to the directory where this script is located
    os.chdir(Path(__file__).parent)
    
    Handler = MyHTTPRequestHandler
    
    print(f"""
    ╔══════════════════════════════════════════════════════╗
    ║  🍿 Zoza Gateway Snacks - Local Development Server  ║
    ╚══════════════════════════════════════════════════════╝
    
    ✅ Server running at: http://localhost:{PORT}
    ✅ Network URL: http://127.0.0.1:{PORT}
    
    📂 Serving files from: {os.getcwd()}
    
    Press Ctrl+C to stop the server
    """)
    
    # Open browser automatically
    webbrowser.open(f'http://localhost:{PORT}')
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped. Goodbye!")
            httpd.shutdown()

if __name__ == "__main__":
    main()
