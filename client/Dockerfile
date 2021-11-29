FROM node:12.18.3

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package-docker.json ./package.json
COPY package-lock.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]