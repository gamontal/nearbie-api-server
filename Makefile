all: install test start-prod

start-prod: ;@echo "Starting server....."; \
             NODE_ENV=production ./node_modules/.bin/pm2 start ./server.js

start-dev: ;@echo "Starting server in development mode....."; \
            NODE_ENV=development ./node_modules/.bin/nodemon ./server.js

test: ;@echo "Initializing tests....."; \
       NODE_ENV=test ./node_modules/.bin/mocha -t 100000

install: ;@echo "Installing dependencies....."; \
          npm install pm2; \
          npm install # install pm2 and the rest of the dependencies

# stop production server for maintenance purposes
stop-prod-server: ;@echo "WARNING: Stopping all server processes....."; \
                   ./node_modules/.bin/pm2 stop all

.PHONY: start-prod start-dev test install stop-prod-server
