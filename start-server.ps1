# Zoza Gateway Snacks - PowerShell Server
# Double-click this file or run: powershell -ExecutionPolicy Bypass -File start-server.ps1

$port = 8000
$url = "http://localhost:$port"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Zoza Gateway Snacks - Local Development Server" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Server starting at: $url" -ForegroundColor Green
Write-Host "✅ Press Ctrl+C to stop" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Serving: $PWD" -ForegroundColor Gray
Write-Host ""

# Open browser
Start-Process $url

# Start HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("$url/")
$listener.Start()

Write-Host "Server is running! Access your site at $url" -ForegroundColor Green
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
        Write-Host "$timestamp - $method $filePath" -ForegroundColor Gray
        
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
            
            # Add cache headers
            $response.Headers.Add("Cache-Control", "no-cache")
            
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
