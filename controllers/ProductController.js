const fs = require("fs");
const slugify = require("slugify");
const ProductModel = require("../models/ProductModel");
const braintree = require("braintree");
const { error } = require("console");
const dotenv = require("dotenv");
const orderModel =  require("../models/OrderModel")

dotenv.config({ path: '../backend/config/config.env' });

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});





exports.CreateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validation
    if (!name) {
      return res.status(400).send({ error: "Name is required" });
    }
    if (!description) {
      return res.status(400).send({ error: "Description is required" });
    }
    if (!price) {
      return res.status(400).send({ error: "Price is required" });
    }
    if (!category) {
      return res.status(400).send({ error: "Category is required" });
    }
    if (!quantity) {
      return res.status(400).send({ error: "Quantity is required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(400)
        .send({ error: "Photo is required and should be less than 1MB" });
    }

    // Generate slug from name
    const slug = slugify(name, { lower: true });

    // Create product
    const product = new ProductModel({
      name,
      slug,
      description,
      price,
      category,
      quantity,
      shipping,
    });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in creating product" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const product = await ProductModel.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "all products",
      counttotal: product.length,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error to get all products",
      error,
    });
  }
};

exports.getSingleProducts = async (req, res) => {
  try {
    const product = await ProductModel.find({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "get single products",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error to get single products",
      error,
    });
  }
};

exports.photocontroller = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");
    if (product && product.photo) {
      res.set("Content-type", product.photo.contentType);
      res.status(200).send(product.photo.data);
    } else {
      res.status(404).send({
        success: false,
        message: "Photo not found for the product",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

exports.deletecontroller = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.pid).select("photo");
    res.status(200).send({
      success: true,
      message: "product delete successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while deleting photo",
      error,
    });
  }
};

exports.updatecontroller = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validation
    if (!name) {
      return res.status(400).send({ error: "Name is required" });
    }
    if (!description) {
      return res.status(400).send({ error: "Description is required" });
    }
    if (!price) {
      return res.status(400).send({ error: "Price is required" });
    }
    if (!category) {
      return res.status(400).send({ error: "Category is required" });
    }
    if (!quantity) {
      return res.status(400).send({ error: "Quantity is required" });
    }
    if (!photo) {
      return res.status(400).send({ error: "Photo is required" });
    }
    if (photo.size > 1000000) {
      return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const slug = slugify(name, { lower: true });

    // Update product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      {
        name,
        description,
        price,
        category,
        quantity,
        shipping,
        slug,
      },
      { new: true }
    );

    // Update photo if provided
    if (photo) {
      updatedProduct.photo.data = fs.readFileSync(photo.path);
      updatedProduct.photo.contentType = photo.type;
    }

    await updatedProduct.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating product",
      error,
    });
  }
};

exports.productfiltercontroller = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length > 0) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while filtering the products",
      error,
    });
  }
};

exports.Productcountcontroller = async (req, res, next) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "product count error",
      error,
    });
  }
};

exports.ProductListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      res.status(200).send({
        success:true,
        products
      })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "product list error",
      error,
    });
  }
};


exports.SearchProductController = async (req, res) =>{

  try {
    const {keyword} = req.params
    const result = await ProductModel.find({
      $or:[
        {name: {$regex : keyword, $options:"i"}},
        {description: {$regex : keyword, $options:"i"}},
      ]
    }).select("-photo")
    res.status(200).json({
      success: true,
      result
    
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "product search error",
      error,
    });
  }
}


exports.RelatedProductController  = async (req,res) =>{
  try {
    const {pid, cid} = req.params
    const products = await ProductModel.find({
      category: cid,
      _id:{$ne :pid}
    }).select("-photo").limit(3).populate("category")
    res.status(200).send({
      success:true,
      message:"related products shown successfully",
      products
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:"failed to show related products"
    })
  }
}

//payment gateway api
//token
exports.braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};


exports.brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};