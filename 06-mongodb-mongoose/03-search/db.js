const Category = require('./models/Category');
const Product = require('./models/Product');

async function fillDb() {
  let category;

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

    Product.schema.index({
      title: 'text',
      description: 'text',
    }, {
      weights: {
        title: 10,
        description: 5,
      },
      name: 'TextSearchIndex',
      default_language: 'russian',
    });

    await Category.syncIndexes();
    await Product.syncIndexes();
  }
}

module.exports = fillDb();
