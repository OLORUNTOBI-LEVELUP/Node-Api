const express = require('express');
const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')
const port = process.env.PORT || 3000

const server = express();
server.use(express.json());

server.use('/posts',logger, postRouter)
server.use('/users', logger, userRouter)

//custom middleware

function logger(req, res, next) {
  const date = new Date();
  console.log(`Shebang!! you made a ${req.method} request to ${req.url} on ${date}`)
  next();
};

server.listen(port, () => console.log("listening on port 3000"))

module.exports = server;
