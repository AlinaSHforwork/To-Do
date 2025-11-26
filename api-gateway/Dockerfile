# Use a lightweight Node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port defined in .env (defaults to 8080)
EXPOSE 8080

# Start the Gateway
CMD ["node", "index.js"]