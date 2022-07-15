FROM node:16.14.2-alpine
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .

RUN mkdir logs
RUN chmod -R a+rwx /app/logs

CMD ["npm", "start"]



