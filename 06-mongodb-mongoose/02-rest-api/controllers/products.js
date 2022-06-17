const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  ctx.body = {
    products: await getProducts({subcategory: {_id: subcategory}}),
  };
};

module.exports.productList = async function productList(ctx) {
  ctx.body = {
    products: await getProducts(),
  };
};

module.exports.productById = async function productById(ctx) {
  const {id} = ctx.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid product id'};
    return;
  }

  const product = await Product
    .findById(id)
    .lean()
    .then(productMap);

  if (!product) {
    ctx.status = 404;
    ctx.body = {error: 'Not found'};
  } else {
    ctx.body = {product};
  }
};

async function getProducts(filter = {}) {
  return Product
    .find(filter)
    .lean()
    .then(productsMap)
    .catch(() => []);
}

function productsMap(products) {
  return products.map(productMap);
}

function productMap(product) {
  if (!product) {
    return null;
  }

  const {_id, category, subcategory, title, description, price, images} = product;

  return {
    title,
    description,
    price,
    images,
    id: _id.toString(),
    category: category._id.toString(),
    subcategory: subcategory._id.toString(),
  };
}

