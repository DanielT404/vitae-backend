FROM node:16.14.2-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .

RUN mkdir logs
RUN chmod -R a+rwx /app/logs

CMD ["npm", "start"]



