const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  let user;

  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  user = await User.findOne({email});

  if (!user) {
    user = await User.create({email, displayName}).catch((err) => err);
  }

  if (user.errors) {
    done( user);
  } else {
    done(null, user);
  }
};
