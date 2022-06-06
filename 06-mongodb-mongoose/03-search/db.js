const Category = require('./models/Category');
const Product = require('./models/Product');

async function db() {
  let category;

  console.log('fill db')

  if (!(await Category.find()).length) {
    category = await Category.create({
      title: 'Category1',
      subcategories: [{
        title: 'Subcategory1',
      }],
    });

    await Product.deleteMany({});
  }

  if (!(await Product.find()).length) {
    await Product.create({
      title: 'ProductA',
      description: 'better than ProductB',
      price: 10,
      category: category.id,
      subcategory: category.subcategories[0].id,
      images: ['image1'],
    });

    await Product.create({
      title: 'ProductB',
      description: 'better than ProductA',
      price: 10,
      category: category.id,
      subcategory: category.subcategories[0].id,
      images: ['image1'],
    });

    await Category.syncIndexes();
    await Product.syncIndexes();
  }
}

module.exports = db();
