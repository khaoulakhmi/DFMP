# Use Node
FROM node:20

# Create app directory
WORKDIR /app

# Copy files
COPY package*.json ./

# Install deps
RUN npm install

# Copy rest of code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "dev"]