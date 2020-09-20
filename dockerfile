FROM node

WORKDIR /app

EXPOSE 7000

COPY package*.json ./

RUN npm install --silent

CMD ["npm", "start"]