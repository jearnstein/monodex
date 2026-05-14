@echo off
REM MonoDex Python Flask - Windows startup script

echo MonoDex - Pokemon Card Search (Python Flask)
echo ===========================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    exit /b 1
)

REM Check if pip is installed
pip --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: pip is not installed
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Run the app
echo.
echo Starting the application...
echo Visit: http://localhost:5000
python app.py
