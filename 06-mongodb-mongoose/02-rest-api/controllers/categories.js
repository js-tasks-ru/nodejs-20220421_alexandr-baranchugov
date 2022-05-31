const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();

  ctx.body = {categories: categories.map((category) => categoryMap(category))};
};

function categoryMap({_id, title, subcategories}, isCategory = true) {
  const category = {
    title,
    id: _id.toString(),
  };
  if (isCategory) {
    category.subcategories = subcategories
      .map((subcategory) => categoryMap(subcategory, false));
  }

  return category;
}
