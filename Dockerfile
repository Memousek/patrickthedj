# Use the official Node.js image from the Docker Hub
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port (optional, depending on your bot's requirements)
# EXPOSE 3000

# Start the bot by running "node ."
CMD ["node", "."]