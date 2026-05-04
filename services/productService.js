const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");

const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const Product = require("../models/productModel");

// function نرفع بيها buffer
const uploadToCloudinary = (buffer, name) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        public_id: name,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // 1️⃣ imageCover
  if (req.files.imageCover) {
    const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover`;

    const buffer = await sharp(req.files.imageCover[0].buffer)
      .toFormat("png")
      .png({ quality: 95 })
      .toBuffer(); // 🔥 بدل toFile

    const result = await uploadToCloudinary(buffer, imageCoverName);

    req.body.imageCover = result.secure_url;
  }

  // 2️⃣ images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}`;

        const buffer = await sharp(img.buffer)
          .toFormat("png")
          .png({ quality: 95 })
          .toBuffer(); // 🔥 بدل toFile

        const result = await uploadToCloudinary(buffer, imageName);

        req.body.images.push(result.secure_url);
      })
    );
  }

  next();
});

// @desc    Get list of products
// @route   GET /products
// @access  Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc    Get specific product by id
// @route   GET /products/:id
// @access  Public
exports.getProduct = factory.getOne(Product, "reviews");

// @desc    Create product
// @route   POST  /products
// @access  Private
exports.createProduct = factory.createOne(Product);
// @desc    Update specific product
// @route   PUT /products/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete specific product
// @route   DELETE /products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product);
