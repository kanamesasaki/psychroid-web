# Use the official Node.js image (Debian-based) as the base image
FROM node:22-bullseye

# Set the working directory to /app (this will be the root of our repository)
WORKDIR /workspaces/psychroid-web

# Copy the entire repository into the container
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the port used by Next.js development server
EXPOSE 5173

# Default command: start the frontend development server
CMD ["npm", "run", "dev"]