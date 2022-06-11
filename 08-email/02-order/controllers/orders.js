const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const user = ctx.user;
  const {product, phone, address} = ctx.request.body;

  if (!user) {
    ctx.throw(401, 'Неверный аутентификационный токен');
    return;
  }

  const order = await Order.create({product, phone, address, user});

  if (order.errors) {
    ctx.throw(order);
  } else {
    await sendMail({
      template: 'order-confirmation',
      locals: {
        product,
        id: order._id.toString(),
      },
      to: user.email,
      subject: 'Оформлен новый заказ',
    });

    ctx.body = {order: order._id.toString()};
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const user = ctx.user;

  if (!user) {
    ctx.throw(401, 'Неверный аутентификационный токен');
    return;
  }

  const orders = await Order.find({user: {_id: user._id.toString()}}).populate('product');

  ctx.body = {
    orders: orders.map(orderMap)
  };
};


function orderMap({_id, user, product, phone, address}) {
  return {
    phone,
    address,
    id: _id.toString(),
    user: user.toString(),
    product: {
      id: product._id.toString(),
      title: product.title,
      images: product.images,
      price: product.price,
      description: product.description,
      category: product.category.toString(),
      subcategory: product.subcategory.toString(),
    }
  }
}
