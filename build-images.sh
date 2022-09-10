#!/bin/bash

docker build -f Dockerfile.backend -t refueling-log-backend:latest .
docker build -f Dockerfile.frontend -t refueling-log-frontend:latest .