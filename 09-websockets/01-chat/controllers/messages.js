const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401;
    ctx.body = {error: 'Пользователь не залогинен'};
    return;
  }

  console.log(ctx.user.id)

  const messages = await Message.find({chat: ctx.user.id});

  ctx.body = {
    messages: messages.map(messageMap),
  };
};

function messageMap({_id, date, text, user}) {
  return {
    date,
    text,
    user,
    id: _id.toString(),
  };
}
