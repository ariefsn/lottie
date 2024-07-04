# Lottie App

  A simple application for view, upload, download lottie files. For demo please visit this link: [demo](https://lottie.ariefsn.dev).

## Apps

- [Backend](#backend): [Fastify](https://fastify.io/)
- [Frontend](#frontend): [NextJS](https://nextjs.org/)
- Docker

### Backend

- Fastify-cli
- MongoDB
- Graphql
- REST

### Frontend

- NextJS
- Mantine
- OvermindJS
- Dexie

## How To

  The application can be start with 2 options that described below, the manual run each of services, and with docker

### Option 1

- Backend
  - `cd backend`
  - Copy the `.env.example` to `.env` and set the variables
  - `yarn dev` for Development
  - `yarn build && yarn start` for Production
- Frontend
  - `cd frontend`
  - Copy the `.env.example` to `.env` and set the variables
  - `yarn dev` for Development
  - `yarn build && yarn start` for Production

### Option 2

- `cd compose`
- Copy the `.env.example` to `.env` and set the variables
- Run `docker compose up --build -d`
