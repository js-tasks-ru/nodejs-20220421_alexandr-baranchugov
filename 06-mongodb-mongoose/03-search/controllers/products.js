const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  const $regex = `^.*${query.toLowerCase()}.*`;
  const products = await Product.find({
    $or: [{
      title: {$regex, $options: 'i'},
    }, {
      description: {$regex, $options: 'i'},
    }],
  });

  ctx.body = {products: products};
};
