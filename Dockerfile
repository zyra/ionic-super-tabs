FROM node:12-alpine
COPY . .
RUN npm i
RUN npx lerna bootstrap
RUN npm run build
