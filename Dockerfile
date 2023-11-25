FROM node:20.9.0 as frontend-build

WORKDIR /app

COPY ./frontend/package*.json /app

RUN npm i

COPY ./frontend /app

RUN npm run build

FROM node:20.9.0 as backend

COPY --from=frontend-build /app/dist /app/dist

WORKDIR /app

COPY ./backend/package*.json /app

RUN npm i

COPY ./backend /app/

CMD ["npm", "start"]
