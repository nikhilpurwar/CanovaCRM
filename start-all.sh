#!/bin/bash

# CanovaCRM - Quick Start Script
# This script starts all three services in separate terminals

echo "=========================================="
echo "CanovaCRM - Starting All Services"
echo "=========================================="
echo ""
echo "Backend will run on:    http://localhost:5000"
echo "Admin Client on:        http://localhost:5173"
echo "Employee Client on:     http://localhost:5174"
echo ""
echo "Starting services..."
echo ""

# Change to CanovaCRM directory
cd /home/akka/CanovaCRM

# Start Backend
echo "1. Starting Backend Server (Port 5000)..."
gnome-terminal -- bash -c "cd /home/akka/CanovaCRM/server && npm start; exec bash"

sleep 3

# Start Admin Client
echo "2. Starting Admin Frontend (Port 5173)..."
gnome-terminal -- bash -c "cd /home/akka/CanovaCRM/client && npm run dev; exec bash"

sleep 3

# Start SalesClient
echo "3. Starting Employee Frontend (Port 5174)..."
gnome-terminal -- bash -c "cd /home/akka/CanovaCRM/salesClient && npm run dev; exec bash"

echo ""
echo "=========================================="
echo "All services are starting..."
echo ""
echo "Wait 10-15 seconds for servers to start, then:"
echo ""
echo "Admin:    http://localhost:5173"
echo "Sales:    http://localhost:5174"
echo "Backend:  http://localhost:5000"
echo ""
echo "=========================================="
