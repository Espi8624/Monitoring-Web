FROM node:9-slim
WORKDIR /app
COPY package.json ./app
RUN npm install

FROM node:12-alpine
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
CMD ["npm", "start"]
EXPOSE 3000