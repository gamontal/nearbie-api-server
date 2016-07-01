FROM node:argon

# Define working directory
WORKDIR /src
ADD . /src

# Expose port
EXPOSE 8080

ENV NODE_ENV production

CMD ["node", "src/server.js"]