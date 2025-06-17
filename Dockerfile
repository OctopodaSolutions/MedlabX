# Use Node.js as base image
FROM node:20

# Set working directory
WORKDIR /

# Copy only the files needed for dependency install first (caching layer)
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# No separate frontend build needed — frontend served directly from /src

# Expose your backend port (adjust as needed)
EXPOSE 5000

# Start the backend (Electron-style app: frontend in /src, backend in /public)
CMD ["node", "public/server.js"]