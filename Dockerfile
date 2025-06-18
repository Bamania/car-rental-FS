FROM node:18-alpine as base
WORKDIR /app
COPY package.json  package-lock.json ./
RUN npm install

COPY . .

RUN npm run build
EXPOSE 5173
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0"]


# The correct Docker command to run the container in detached mode and map port 5173 is:
# docker run -d -p 5173:5173 carfrontend








