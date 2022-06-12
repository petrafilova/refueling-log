# Refueling-Log

Refueling log and expense tracker. This application is based on Express NodeJS backend and React frontend. Whole application is writen in typescript/javascript.

## Running application in docker-compose (testing enviroment with dev mail server)

### How to run application in docker-compose:
*(required docker and docker-compose)*

1) run `./build-images.sh`
2) run `docker-compose up -d`
3) check if backend is running on [http://localhost:8080/health](http://localhost:8080/health)
4) open frontend at [http://localhost:8081](http://localhost:8081)
5) email dev server avalaible on [http://localhost:8082](http://localhost:8082)
6) pdadmin avalaible on [http://localhost:8083](http://localhost:8083)

## Development - backend

### How to run for local development
*(required docker, docker-compose and Node.js 16)*

- enviroments variables for local development are set up in `backend/.env` file

1) run `./build-images.sh`
2) `docker-compose -f docker-compose-dev.yaml up -d` to run database, mail server and pgadmin
3) email dev server avalaible on [http://localhost:8082](http://localhost:8082)
4) pdadmin avalaible on [http://localhost:8083](http://localhost:8083)
5) `cd backend`
6) `npm install`
7) `npm run start:dev`
8) check if backend is running on [http://localhost:3000/health](http://localhost:3000/health)

## Development - frontend

### How to run for local development
*(required docker, docker-compose and Node.js 16)*

1) run `./build-images.sh`
2) `docker-compose -f docker-compose-backend.yaml up -d`
3) check if backend is running on [http://localhost:8080/health](http://localhost:8080/health)
4) Openapi 3.0 specification available on [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
5) email dev server avalaible on [http://localhost:8082](http://localhost:8082)
6) pdadmin avalaible on [http://localhost:8083](http://localhost:8083)
7) `cd frontend`
8) `npm install`
9) `npm run start`
10) check if frontend is running on [http://localhost:3000](http://localhost:3000)
11) shutdown backend server in main (refueling-log) directory `docker-compose down`

### How to update list of used libraries

If added new dependencies, list of used libraries can be updated using this commands

`cd backend && npx license-report --only=prod --output=table --config ../license-report.json > ../BACKEND_LIBRARIES_LICENSES && cd ..;`

`cd frontend && npx license-report --only=prod --output=table --config ../license-report.json > ../FRONTEND_LIBRARIES_LICENSES && cd ..;`

### TEST USER

test/Test1234