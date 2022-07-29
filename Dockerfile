FROM node:16.14.2
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

CMD ["npm", "run", "dev"]



