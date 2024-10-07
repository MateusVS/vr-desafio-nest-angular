FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install @angular/cli -g

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--proxy-config", "proxy.conf.json"]

