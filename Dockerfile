FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port on which the Next.js application will run
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production

# Start the Next.js application
CMD HOSTNAME="frdb-beta" npm run start