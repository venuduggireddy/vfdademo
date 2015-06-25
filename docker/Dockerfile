# DOCKER-VERSION 1.2.0

FROM nodesource/trusty:0.12.4
#FROM 2d328af28872
#FROM nodesource/trusty:0.12.4

# make sure apt is up to date
RUN apt-get update

RUN apt-get install unzip
# install nodejs and npm
#RUN apt-get install -y nodejs git git-core

RUN npm install -g pm2

RUN npm install -g grunt-cli

#ADD start.sh /tmp/

ADD vfdademo-master.zip /tmp/

RUN unzip -qq /tmp/vfdademo-master.zip -d /tmp/

#RUN cd /tmp/vfdademo-master

EXPOSE 4000

WORKDIR /tmp/vfdademo-master

#RUN pm2 start /tmp/vfdademo-master/app.js

#EXPOSE 4000

#CMD ["pm2","start", "app.js"]

#RUN chmod +x /tmp/start.sh

#CMD ./tmp/start.sh
