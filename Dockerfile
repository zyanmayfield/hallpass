# Use the official Node.js  LTS version  as the base image
FROM node:lts as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the React app files to the container
COPY ./dist ./dist

# Copy the server.js file to the container
COPY server.js .

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
