#!/bin/bash
echo "Starting Biasbuster server with Mock AI service..."
export AI_SERVICE=mock
npx ts-node src/index.ts 