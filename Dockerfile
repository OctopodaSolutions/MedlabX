# Use official Node image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json first (for Docker cache)
COPY package*.json ./

# Install dependencies (both backend & frontend)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the React frontend inside the container
RUN npm run build-react

# Serve the static build folder via Express:
# Make sure your Express uses the right static path ('/build')
# and fallback to index.html for React Router.

# Expose backend port
EXPOSE 3003

# Start the Express server
CMD ["node", "public/headlessServer.js"]
