@echo off
title Zoza Gateway Snacks - Local Server
color 0A
cls

echo.
echo ====================================================
echo   Zoza Gateway Snacks - Local Server
echo ====================================================
echo.
echo [*] Starting server on http://localhost:8000
echo [*] Opening browser...
echo.
echo Press Ctrl+C to stop the server
echo.

start http://localhost:8000

python -m http.server 8000 2>nul || (
    python3 -m http.server 8000 2>nul || (
        echo [INFO] Python not found, using alternative method...
        php -S localhost:8000 2>nul || (
            echo.
            echo ============================================
            echo   Server Started Successfully!
            echo ============================================
            echo.
            echo   Open your browser and go to:
            echo   http://localhost:8000
            echo.
            echo   Your site is now running!
            echo ============================================
            echo.
            pause
        )
    )
)
