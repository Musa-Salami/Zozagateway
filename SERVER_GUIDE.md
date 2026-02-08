# 🖥️ Local Server Options for Zoza Gateway Snacks

You have **3 easy options** to run a local server without Node.js:

---

## ⚡ Option 1: Double-Click Batch File (EASIEST!)

**Just double-click this file:**
```
start-server.bat
```

✅ No installation needed
✅ Automatically opens your browser
✅ Works on any Windows machine

The server will start at **http://localhost:8000**

Press `Ctrl+C` to stop the server.

---

## 🐍 Option 2: Python Server (If Python is installed)

**Double-click this file:**
```
start-server.py
```

Or run in terminal:
```bash
python start-server.py
```

---

## 💻 Option 3: PowerShell Server

**Right-click `start-server.ps1` → Run with PowerShell**

Or run in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File start-server.ps1
```

---

## 🎯 Recommended: Use the Batch File

The **`start-server.bat`** file automatically detects what's available on your system:
1. First tries Python (if installed)
2. Falls back to PowerShell (built into Windows)
3. Opens browser automatically
4. Shows colored output

**Just double-click `start-server.bat` and you're done!**

---

## 🔥 For Firebase Deployment

See **`FIREBASE_DEPLOYMENT.md`** for complete Firebase hosting instructions.

---

## 💡 Notes

- All options serve your site at **http://localhost:8000**
- Your browser will open automatically
- Cart data saves in localStorage (persists between sessions)
- Products added via admin are temporary (refresh resets them)
- To stop: Press `Ctrl+C` in the terminal window

---

## 🛠️ Troubleshooting

**"Batch file doesn't work"**
→ Try the PowerShell option: right-click `start-server.ps1` → Run with PowerShell

**"Port 8000 already in use"**
→ Close other applications or edit the PORT variable in the script

**"Access denied"**
→ Run PowerShell as Administrator

---

**Ready to start? Double-click `start-server.bat` now!** 🚀
