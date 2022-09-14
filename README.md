# Refueling-Log

Refueling log and expense tracker. This application is based on Express NodeJS backend and React frontend. Whole application is writen in typescript/javascript.

## Running application in docker-compose (testing enviroment with dev mail server)

### How to run application in docker-compose:
*(required docker and docker-compose)*

1) run `./build-images.sh`
2) run `docker-compose up -d`
3) check if backend is running on [http://localhost/api/health](http://localhost/api/health)
4) open frontend at [http://localhost/](http://localhost/)
5) email dev server avalaible on [http://localhost:8082](http://localhost:8082)
6) pdadmin avalaible on [http://localhost:8083](http://localhost:8083)

## Development - backend

### How to run for local development
*(required docker, docker-compose and Node.js 16)*

- enviroments variables for local development are set up in `backend/.env` file

1) run `./build-images.sh`
2) `cd backend`
3) `docker-compose up -d` to run database, mail server and pgadmin
4) email dev server avalaible on [http://localhost:8082](http://localhost:8082)
5) pdadmin avalaible on [http://localhost:8083](http://localhost:8083)
6) `npm install`
7) `npm run start:dev`
8) check if backend is running on [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Development - frontend

### How to run for local development
*(required docker, docker-compose and Node.js 16)*

1) run `./build-images.sh`
2) `cd frontend`
3) `docker-compose up -d`
4) check if backend is running on [http://localhost:8080/api/health](http://localhost:8080/api/health)
5) Openapi 3.0 specification available on [http://localhost:8080/api/api-docs](http://localhost:8080/api/api-docs)
6) email dev server avalaible on [http://localhost:8082](http://localhost:8082)
7) pdadmin avalaible on [http://localhost:8083](http://localhost:8083)
8) `npm install`
9) `npm run start`
10) check if frontend is running on [http://localhost:3000](http://localhost:3000)
11) backend /api/health and /api/api-docs should be available on port 3000 while frontend is running
12) to shutdown backend server run `docker-compose down` in frontend directory

### How to update list of used libraries

If added new dependencies, list of used libraries can be updated using this script

`./generateLibrariesNotice.sh`

WHILE RUNNING IT WILL INSTANLL GLOBALLY LIBRARY `license-report`

### TEST USER

test/Test1234