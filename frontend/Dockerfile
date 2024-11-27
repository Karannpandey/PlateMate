# Step 1: Use the official Node.js slim image (v22)
FROM node:18

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the application source code
COPY . .

# Step 6: Expose the default React app port
EXPOSE 3000

# Step 7: Start the application
CMD ["npm", "start"]


# docker build -t react-frontend .
# docker run -p 3000:3000 react-frontend

