#!/usr/bin/env bash

# This script is used to run frontend and backend

# Navigate to frontend directory and start the frontend
ROOT_DIR=$(pwd)
cd frontend/aptsupport
npm start &

# Navigate to backend directory, activate the virtual environment, and run the backend script
cd $ROOT_DIR/backend
source myenv/bin/activate
./run.sh