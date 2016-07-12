# Set nginx base image
FROM nginx

RUN mkdir /logs && \
  touch /logs/error.log && \
  touch /logs/access.log && \
  touch /logs/nginx.pid

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf