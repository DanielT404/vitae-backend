FROM node:16.14.2-alpine
WORKDIR /app

RUN apk --no-cache add curl

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .

RUN mkdir logs
RUN chmod -R a+rwx /app/logs
RUN sh -c 'mkdir /app/logs/routes; mkdir /app/logs/routes/email; mkdir /app/logs/routes/files; mkdir /app/logs/routes/projects';

CMD ["npm", "start"]



