FROM node:10

RUN mkdir /frontend
WORKDIR /frontend
ADD package.json package-lock.json /frontend/
RUN npm install
ADD . /frontend
#RUN npm run build
