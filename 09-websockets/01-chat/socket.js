const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    let session;
    const {token} = socket.request._query;

    if (!token) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    session = await Session
      .findOne({token})
      .populate('user');

    if (!session) {
      return next(new Error('wrong or expired session token'));
    }

    socket.user = session.user;

    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (text) => {
      await Message.create({
        text,
        date: new Date(),
        chat: socket.user._id.toString(),
        user: socket.user.displayName,
      });
    });
  });

  return io;
}

module.exports = socket;
