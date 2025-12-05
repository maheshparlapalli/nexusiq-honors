#!/bin/bash

# Create MongoDB data directory if it doesn't exist
mkdir -p /home/runner/mongodb-data

# Start MongoDB in the background if not already running
echo "Starting MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    mongod --dbpath /home/runner/mongodb-data --bind_ip localhost --port 27017 --fork --logpath /home/runner/mongodb.log 2>/dev/null || mongod --dbpath /home/runner/mongodb-data --bind_ip localhost --port 27017 &
    echo "Waiting for MongoDB to be ready..."
    sleep 3
else
    echo "MongoDB is already running"
fi

# Start the backend in the background
echo "Starting backend server..."
NODE_ENV=development tsx server/index.ts &

# Wait a moment for backend to start
sleep 2

# Start the frontend (this will be the main process)
echo "Starting frontend..."
cd client && exec vite
