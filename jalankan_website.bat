@echo off
title Elang Priatim - Bank Indonesia KPw Tasikmalaya
cd /d "%~dp0"

echo ======================================================================
echo   ELANG PRIATIM - BANK INDONESIA KANTOR PERWAKILAN TASIKMALAYA
echo   Ekosistem Literasi Kebanksentralan Priangan Timur
echo ======================================================================
echo.
echo   Memeriksa runtime server lokal...

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Node.js terdeteksi. Memulai server berkecepatan tinggi...
    node server.js
) else (
    echo   [INFO] Menjalankan server melalui Windows PowerShell...
    echo   Server aktif di http://localhost:8080/
    echo.
    start powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 1; Start-Process 'http://localhost:8080/index.html'"
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8080/'); $listener.Start(); Write-Host '  [OK] Server aktif di http://localhost:8080/' -ForegroundColor Green; while ($listener.IsListening) { $context = $listener.GetContext(); $req = $context.Request; $res = $context.Response; $urlPath = $req.Url.LocalPath.TrimStart('/'); if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = 'index.html' }; $fullPath = Join-Path (Get-Location) $urlPath; if (Test-Path $fullPath) { $bytes = [System.IO.File]::ReadAllBytes($fullPath); $ext = [System.IO.Path]::GetExtension($fullPath).ToLower(); $mime = 'application/octet-stream'; if ($ext -eq '.html' -or $ext -eq '.htm') { $mime = 'text/html; charset=utf-8' } elseif ($ext -eq '.png') { $mime = 'image/png' } elseif ($ext -eq '.jpeg' -or $ext -eq '.jpg') { $mime = 'image/jpeg' } elseif ($ext -eq '.pdf') { $mime = 'application/pdf' } elseif ($ext -eq '.css') { $mime = 'text/css' } elseif ($ext -eq '.js') { $mime = 'application/javascript' }; $res.ContentType = $mime; $res.Headers.Add('Referrer-Policy', 'strict-origin-when-cross-origin'); $res.ContentLength64 = $bytes.Length; $res.OutputStream.Write($bytes, 0, $bytes.Length) } else { $res.StatusCode = 404 }; $res.OutputStream.Close() }"
)

pause
