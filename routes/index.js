var express = require('express');
var router = express.Router();
var products = require('../models/products');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Product Uploader',
		products: products.productList,
		nav: 'Home'
	});
});

module.exports = router;
