const Product = require('../models/product');

const { deleteFile } = require('../utils');

module.exports = {
  async getProducts(req, res, next) {
    const category = req.query.category ? { category: req.query.category } : {};

    const searchKeyword = req.query.searchKeyword
      ? {
          title: {
            $regex: req.query.searchKeyword,
            $options: 'i',
          },
        }
      : {};

    const { sortOrder } = req.query;

    let order;

    if (sortOrder && sortOrder === 'lowest') {
      order = { price: 1 };
    } else if (sortOrder && sortOrder === 'highest') {
      order = { price: -1 };
    } else {
      order = { _id: -1 };
    }

    try {
      const products = await Product.find({
        ...category,
        ...searchKeyword,
      }).sort(order);

      const totalProducts = await Product.find({
        ...category,
        ...searchKeyword,
      })
        .sort(order)
        .countDocuments();

      if (!products || !totalProducts) {
        const error = new Error('Products could not be found.');
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({
        message: 'Fetched Products Successfully!',
        products,
        totalProducts,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async getProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.productId);

      if (!product) {
        const error = new Error('Product could not be found.');
        error.statusCode = 404;
        throw error;
      }

      return res
        .status(200)
        .json({ message: 'Fetched Product Successfully', product });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async createProduct(req, res, next) {
    const {
      title,
      brand,
      price,
      category,
      countInStock,
      description,
      imagesUrl,
    } = req.body;

    try {
      const product = new Product({
        title,
        brand,
        price,
        category,
        countInStock,
        description,
        imagesUrl,
      });

      await product.save();

      return res.status(201).json({
        message: 'New Product Created Successfully!',
        product,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async updateProduct(req, res, next) {
    const {
      title,
      brand,
      price,
      category,
      countInStock,
      description,
      imagesUrl,
    } = req.body;

    try {
      const product = await Product.findById(req.params.productId);

      if (!product) {
        const error = new Error('Product could not be found.');
        error.statusCode = 404;
        throw error;
      }

      product.title = title;
      product.brand = brand;
      product.price = price;
      product.category = category;
      product.countInStock = countInStock;
      product.description = description;

      product.imagesUrl.map(image => {
        return deleteFile(image.path);
      });

      product.imagesUrl = imagesUrl;

      await product.save();

      return res.status(200).json({
        message: 'Product Updated Successfully!',
        product,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.productId);

      if (!product) {
        const error = new Error('Product could not be found.');
        error.statusCode = 404;
        throw error;
      }

      const { imagesUrl } = product;

      imagesUrl.map(image => {
        return deleteFile(image.path);
      });

      await product.deleteOne();

      return res.status(200).json({ message: 'Product Deleted Successfully!' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },

  async createReview(req, res, next) {
    try {
      const product = await Product.findById(req.params.productId);

      if (!product) {
        const error = new Error('Product could not be found.');
        error.statusCode = 404;
        throw error;
      }

      const review = {
        username: req.body.username,
        rating: req.body.rating,
        comment: req.body.comment,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((prev, current) => current.rating + prev, 0) /
        product.reviews.length;

      const updatedProduct = await product.save();

      return res.status(201).json({
        message: 'Review Created Successfully',
        data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  },
};
