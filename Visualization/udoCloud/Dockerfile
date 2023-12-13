# Use the official Node.js image with version 18
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Svelte app
RUN npm run build

# Expose the port that your app is running on
EXPOSE 4173

ENV HOST=0.0.0.0

# Command to run your application
# CMD [ "npm", "run", "dev", "--host"]
CMD ["npm","run", "preview","--", "--host", "0.0.0.0"]