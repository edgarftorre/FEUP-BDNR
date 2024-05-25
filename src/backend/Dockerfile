FROM node:14

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY data ./data
COPY populate.js api.js ./

RUN node populate.js
CMD node api.js