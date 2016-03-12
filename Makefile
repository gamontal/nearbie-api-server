start-prod: ;@echo "Starting server....."; \
             NODE_ENV=production ./node_modules/.bin/forever start server.js

start-dev: ;@echo "Starting server in development mode....."; \
            NODE_ENV=development ./node_modules/.bin/nodemon server.js

test: ;@echo "Initializing tests....."; \
       NODE_ENV=test ./node_modules/.bin/mocha -t 100000

# stop production server for maintenance purposes
stop-prod-server: ;@echo "WARNING: Stopping all server processes....."; \
                   ./node_modules/.bin/forever stopall

.PHONY: start-prod start-dev test stop-prod-server
