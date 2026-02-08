@echo off
title Zoza Gateway Snacks - Network Server
color 0A
cls

echo.
echo ============================================================
echo   Zoza Gateway Snacks - Starting Network Server
echo ============================================================
echo.
echo [*] This server can be accessed from your phone!
echo [*] Make sure your phone is on the SAME WiFi network
echo.
echo [*] Starting server...
echo.

powershell -ExecutionPolicy Bypass -File start-network-server.ps1
