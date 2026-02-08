# Zoza Gateway Snacks - Network Server (Access from Phone)
# This server can be accessed from any device on your WiFi

$port = 8000

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Zoza Gateway Snacks - Network Server" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Get local IP address
$localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*","Ethernet*" | Where-Object {$_.IPAddress -notlike "169.*"} | Select-Object -First 1).IPAddress

if (-not $localIP) {
    $localIP = (Get-NetIPConfiguration | Where-Object {$_.IPv4DefaultGateway -ne $null} | Get-NetIPAddress -AddressFamily IPv4 | Select-Object -First 1).IPAddress
}

Write-Host "Computer IP: $localIP" -ForegroundColor Green
Write-Host ""
Write-Host "Access from:" -ForegroundColor Yellow
Write-Host "  - This computer:  http://localhost:$port" -ForegroundColor White
Write-Host "  - Your phone:     http://${localIP}:$port" -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure your phone is on the SAME WiFi network!" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Open browser on this computer
Start-Process "http://localhost:$port"

# Start HTTP listener on all interfaces
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:$port/")
$listener.Start()

Write-Host "[RUNNING] Server started successfully" -ForegroundColor Green
Write-Host ""

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested file path
        $filePath = $request.Url.LocalPath
        if ($filePath -eq "/") { $filePath = "/index.html" }
        
        $fullPath = Join-Path $PWD $filePath.TrimStart('/')
        
        # Log request
        $timestamp = Get-Date -Format 'HH:mm:ss'
        $method = $request.HttpMethod
        $clientIP = $request.RemoteEndPoint.Address
        Write-Host "[$timestamp] $clientIP - $method $filePath" -ForegroundColor Gray
        
        if (Test-Path $fullPath -PathType Leaf) {
            # File exists - serve it
            $content = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $content.Length
            
            # Set content type
            $ext = [System.IO.Path]::GetExtension($fullPath)
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css" }
                ".js"   { $response.ContentType = "application/javascript" }
                ".json" { $response.ContentType = "application/json" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".gif"  { $response.ContentType = "image/gif" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                ".webp" { $response.ContentType = "image/webp" }
                ".ico"  { $response.ContentType = "image/x-icon" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            # Add headers
            $response.Headers.Add("Cache-Control", "no-cache")
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            
            # Write response
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        else {
            # File not found - return 404
            $response.StatusCode = 404
            $html = @"
<!DOCTYPE html>
<html><head><title>404 Not Found</title><style>body{font-family:sans-serif;text-align:center;padding:50px;background:#f5f5f5;}h1{color:#F97316;}</style></head>
<body><h1>404 - Not Found</h1><p>The file <code>$filePath</code> was not found.</p><a href="/">Go Home</a></body></html>
"@
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
            $response.ContentLength64 = $buffer.Length
            $response.ContentType = "text/html"
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.Close()
    }
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
finally {
    $listener.Stop()
    Write-Host ""
    Write-Host "Server stopped. Goodbye!" -ForegroundColor Yellow
}
