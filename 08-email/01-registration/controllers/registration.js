const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const {email, displayName, password} = ctx.request.body;
  let user = await User.findOne({email});

  if (user && user.errors) {
    ctx.body = user;
    ctx.status = 400;
  } else if (user) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
  } else {
    user = await new User({email, displayName, verificationToken});

    await user.setPassword(password);
    await user.save();

    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });

    ctx.status = 200;
    ctx.body = {status: 'ok'};
  }
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});

  if (user) {
    user.verificationToken = undefined;

    await user.save();

    ctx.status = 200;
    ctx.body = {token: verificationToken};
  } else {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  }
};
