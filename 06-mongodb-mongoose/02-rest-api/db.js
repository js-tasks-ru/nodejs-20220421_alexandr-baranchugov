const Category = require('./models/Category');
const Product = require('./models/Product');

async function fillDb() {
  let category1;
  let category2;

  if (!(await Category.find()).length) {
    category1 = await Category.create({
      title: 'Category1',
      subcategories: [{
        title: 'Subcategory1.2',
      }],
    });

    category2 = await Category.create({
      title: 'Category2',
      subcategories: [{
        title: 'Subcategory2.1',
      }, {
        title: 'Subcategory2.2',
      }],
    });
  }

  if (!(await Product.find()).length) {
    await Product.create({
      title: 'Product1',
      description: 'Description1',
      price: 10,
      category: category1.id,
      subcategory: category1.subcategories[0].id,
      images: ['image1'],
    });

    await Product.create({
      title: 'Product2',
      description: 'Description2',
      price: 10,
      category: category2.id,
      subcategory: category2.subcategories[0].id,
      images: ['image1'],
    });

    await Product.create({
      title: 'Product3',
      description: 'Description3',
      price: 10,
      category: category2.id,
      subcategory: category2.subcategories[1].id,
      images: ['image1'],
    });
  }
}

module.exports = fillDb();
