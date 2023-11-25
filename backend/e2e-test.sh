#!/usr/bin/env bash

TEST_DB_DOCKER_NAME=vavjs_zadanie3_test_db

export DB_HOST=localhost
export DB_PORT=2345
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export DB_DATABASE=vavjs_zadanie3
export APP_PORT=42069
export NODE_ENV=test

docker run --rm --name ${TEST_DB_DOCKER_NAME} \
	-p ${DB_PORT}:5432 \
	-e POSTGRES_USER=${DB_USERNAME} \
	-e POSTGRES_PASSWORD=${DB_PASSWORD} \
	-e POSTGRES_DB=${DB_DATABASE} \
	-d postgres:16.0

sleep 1 # wait for db to start

mocha --require ts-node/register test/*.ts

docker stop ${TEST_DB_DOCKER_NAME}
