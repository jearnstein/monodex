#!/bin/bash

# Quick start script for MonoDex Python version

echo "MonoDex - Pokemon Card Search (Python Flask)"
echo "==========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install it first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install it first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install -r requirements.txt

# Run the app
echo "🚀 Starting the application..."
echo "📍 Visit: http://localhost:5000"
python3 app.py
