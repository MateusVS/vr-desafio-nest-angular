FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run migration:run && npm run start:dev"]
