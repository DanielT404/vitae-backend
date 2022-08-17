FROM node:16.16.0
WORKDIR /app

RUN apt-get update && \
    apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/Europe/Bucharest /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .

RUN mkdir logs
RUN chmod -R a+rw /app/logs
RUN sh -c 'mkdir /app/logs/routes; mkdir /app/logs/routes/email; mkdir /app/logs/routes/files; mkdir /app/logs/routes/projects'

CMD ["npm", "start"]



