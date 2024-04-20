const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception. Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

dbConnect().catch((err) => console.log(err));

async function dbConnect() {
  await mongoose.connect(DB);
}

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.on('newuser', function (username) {
    socket.broadcast.emit('update', username + ' ist dem Chat beigetreten.');
  });
  socket.on('exituser', function (username) {
    socket.broadcast.emit('update', username + ' hat den Chat verlassen.');
  });
  socket.on('chat', function (message) {
    socket.broadcast.emit('chat', message);
  });
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection. Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
