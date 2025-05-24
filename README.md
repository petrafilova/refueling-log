# Refueling-Log

Refueling log and expense tracker. This application is based on Express NodeJS backend and React frontend. Whole application is written in typescript/javascript.

## Running application in docker compose (testing enviroment with dev mail server)

### How to run application in docker compose:
*(required docker and docker compose)*

1) run `./build-images.sh`
2) run `docker compose up -d`
3) check if backend is running on [http://localhost/api/health](http://localhost/api/health)
4) open frontend at [http://localhost/](http://localhost/)
5) email dev server avalaible on [http://localhost:8082](http://localhost:8082)
6) postgres database on port 5432

## Development - backend

### How to run for local development
*(required docker, docker compose 2 and Node.js 22)*

- enviroments variables for local development are set up in `backend/.env` file

1) run `./build-images.sh`
2) `cd backend`
3) `docker compose up -d` to run database, mail server and pgadmin
4) email dev server avalaible on [http://localhost:8082](http://localhost:8082)
5) postgres database on port 5432
6) `npm install`
7) `npm run start:dev`
8) check if backend is running on [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Development - frontend

### How to run for local development
*(required docker, docker compose 2 and Node.js 22)*

1) run `./build-images.sh`
2) `cd frontend`
3) `docker compose up -d`
4) check if backend is running on [http://localhost:8080/api/health](http://localhost:8080/api/health)
5) Openapi 3.0 specification available on [http://localhost:8080/api/api-docs](http://localhost:8080/api/api-docs)
6) email dev server avalaible on [http://localhost:8082](http://localhost:8082)
7) postgres database on port 5432
8) `npm install`
9) `npm run start`
10) check if frontend is running on [http://localhost:3000](http://localhost:3000)
11) backend /api/health and /api/api-docs should be available on port 3000 while frontend is running
12) to shutdown backend server run `docker compose down` in frontend directory

## This application depends on 3rd party libraries.

Backend: Libraries are listed in file [backend/LIBRARIES](backend/LIBRARIES)

Frontend: Libraries are listed in file [frontend/LIBRARIES](frontend/LIBRARIES)

### How to update list of used libraries

If added new dependencies, list of used libraries can be updated using this script

`./generateLibrariesNotice.sh`

WHILE RUNNING IT WILL INSTANLL GLOBALLY `license-report` LIBRARY

### TEST USER

test/Test1234

## Environment variables

### Backend

| Name | Type of value | Default | Required | Description |
|---|---|---|---|---|
| NODE_ENV | string |||Environment 'development' or 'production'
| PORT | number | 3000 ||Port where backend api will run|
| BASE_PATH | string | /api ||Base path of api|
| TOKEN_SIGN_KEY | string || true |Secrete or private key|
| TOKEN_EXPIRES_IN | string |1h||Length of token validity 1m, 1h, 1d|
| REFRESH_TOKEN_EXPIRES_IN | string |30d||Length of refresh token validity 1m, 1h, 1d ...|
| DATABASE_PASSWORD | string || true |Password to database|
| DATABASE_USER | string || true |Username to database|
| DATABASE | string||true|Name of database|
| DATABASE_HOST | string || true |Host of database|
| DATABASE_PORT | number | 5432 ||Port of database|
| DATABASE_LOGGING | boolean |true||If sequelize should log generated queries|
| EMAIL_HOST | string || true |Host of mail server|
| EMAIL_PORT | number | 587 ||Port of mail server|
| EMAIL_USER | string |||Username to mail server|
| EMAIL_PASS | string |||Password to mail server|
| EMAIL_FROM | string || true |Sender email address displayed in emails as from|
| EMAIL_SECURE | boolean | false ||It TLS should be used|
| RESET_URL | string | http://localhost:3000/reset/ ||Url in emal for reseting password|
| RESET_LINK_VALIDITY | number | 12 ||Hours how long is reset link valid|
| CONFIRM_URL | string | http://localhost:3000/confirm/ ||Url in emal for confirming registration|
| REGISTRATION_ENABLED | boolean | false ||Enable posibility to register new users|

### Frontend

| Name | Type of value | Default | Required | Description |
|---|---|---|---|---|
| BASE_API_URL | string |/api||Base url to backend api|
