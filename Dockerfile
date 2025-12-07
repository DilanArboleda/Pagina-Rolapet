# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose Vite's default port
EXPOSE 3000

# Run development server
# --host flag makes it accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host"]
