@echo off
REM ========================================
REM  Zoza Gateway Snacks - Server Launcher
REM ========================================

echo.
echo ====================================================
echo   Zoza Gateway Snacks - Starting Local Server...
echo ====================================================
echo.

REM Try Python 3 first
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [1/2] Python found! Starting Python HTTP server...
    echo.
    python start-server.py
    goto :end
)

REM Try Python from Microsoft Store
where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [1/2] Python3 found! Starting Python HTTP server...
    echo.
    python3 start-server.py
    goto :end
)

REM Try using PowerShell built-in server
echo [1/2] Python not found. Using PowerShell HTTP server...
echo.
echo Starting server at http://localhost:8000
echo Press Ctrl+C to stop
echo.
start http://localhost:8000
powershell -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8000/'); $listener.Start(); Write-Host 'Server running at http://localhost:8000'; Write-Host 'Press Ctrl+C to stop'; while ($listener.IsListening) { $context = $listener.GetContext(); $response = $context.Response; $file = $context.Request.Url.LocalPath; if ($file -eq '/') { $file = '/index.html' }; $fullPath = Join-Path $PWD $file.TrimStart('/'); if (Test-Path $fullPath) { $content = [System.IO.File]::ReadAllBytes($fullPath); $response.ContentLength64 = $content.Length; if ($file -match '\\.html$') { $response.ContentType = 'text/html' } elseif ($file -match '\\.png$') { $response.ContentType = 'image/png' } elseif ($file -match '\\.jpg$') { $response.ContentType = 'image/jpeg' } elseif ($file -match '\\.css$') { $response.ContentType = 'text/css' } elseif ($file -match '\\.js$') { $response.ContentType = 'application/javascript' }; $response.OutputStream.Write($content, 0, $content.Length); } else { $response.StatusCode = 404; $html = '<h1>404 Not Found</h1>'; $buffer = [System.Text.Encoding]::UTF8.GetBytes($html); $response.ContentLength64 = $buffer.Length; $response.OutputStream.Write($buffer, 0, $buffer.Length); }; $response.Close(); }"

:end
echo.
echo Server stopped.
pause
