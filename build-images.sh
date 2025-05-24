#!/bin/bash

docker build --no-cache -f Dockerfile.backend -t refueling-log-backend:latest .
docker build --no-cache -f Dockerfile.frontend -t refueling-log-frontend:latest .