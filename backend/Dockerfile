# # Dockerfile for Backend
# FROM node:22-slim

# # Create App Directory
# RUN mkdir -p /app
# WORKDIR /app

# # Install Dependencies
# COPY package*.json ./
# RUN npm install
# RUN npm install -g nodemon

# # Copy app source code
# COPY . .

# # Exports
# EXPOSE 5001

# # Command to run the application
# CMD [ "node", "server.js" ]

# # Build the image
# # docker build -t my-node-backend .

# # Run the container
# # docker run -p 5001:5001 my-node-backend


FROM node:18.12.1

# Create App Directory
RUN mkdir -p /app
WORKDIR /app

# Install Dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon

# Copy app source code
COPY . .

# Set environment variables
# ENV NODE_ENV=production

# Exports
EXPOSE 5001

# Command to run the application
CMD ["node", "server.js"]