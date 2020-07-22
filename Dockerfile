# pull official base image
FROM node:13.12.0-alpine

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# add app
COPY . /buggernaut-frontend-docker

# set working directory
WORKDIR /buggernaut-frontend-docker

# install app dependencies
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# start app
CMD ["npm", "start"]