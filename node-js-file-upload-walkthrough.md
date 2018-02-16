autoscale: true
footer: © New York Code + Design Academy 2016
slidenumbers: true

# File Upload Walkthrough

---

# First Steps

* Clone the starter application and open it up in your text editor
* cd into the directory and run the command

```bash
    $ cd node-file-upload-starter
    $ npm install
    $ npm start
```

* The starter project has a lot of the setup code included, we just need to fill in what's missing

---

# Starter Project

* This mini application is one that allows the user to create a product list where each product has a few different properties as well as an image.
* Our index page will display the list of products.
* We'll have separate pages for creating a product and viewing a product.
* Let's take a look at the some of the code provided to us.

---

# Starter Project - Routes

* The routes have already been defined for this project, but we need to fill in the responses.
* Looking at app.js as well as the route files we can see that the available paths are:

```
    GET  =>  '/'                (index route)
    GET  =>  '/products/create' (get the new product form)
    POST =>  '/products/create' (add a new product)
    GET  =>  '/products/:id'    (get product details)
```  

---

# Starter Project - Model

* For this application, we will be using an in memory data model instead of a database.
* The file located at './models/products' will be used to maintain the list of products as well as add and fetch products.

```js
// models/products.js
function Products() {
	...
}
Products.prototype.addProduct = function(params, filename) {
    ...
};
Products.prototype.findById = function(id) {
    ...
};
```

---

## Getting Started

* Let's begin with the form we show the user to allow them to create a new product
* Taking a look at 'views/product/create.ejs', let's add the form element.

---

## The form element

```html
// views/product/create.ejs
<form method="???" action="???" enctype="multipart/form-data">

</form>
```

---

## Adding the input elements we get

```html
// views/product/create.ejs
<form method="???" action="???" enctype="multipart/form-data">
  <div>
    <label>Title</label> <input type="text" placeholder="Title" name="title"/>
  </div>
  <div>
    <label>Price</label> <input type="number" placeholder="Price" name="price"/>
  </div>
  <div>
    <label>Quantity</label> <input type="number" placeholder="Quantity" name="quantity"/>
  </div>
  <div>
	<label>Image</label> <input type="file" name="productImage">
  </div>
  <div> <button type="submit">Upload</button> </div>  
</form>
```

---

## Exercise

* Fill in the method and action for the form above.
* Do a sanity to check to make sure the requests are getting through correctly to the server.

---

## multer Installation

* Let's begin by first installing "multer"

```bash
    $ npm install multer --save
```

---

## multer Storage

```js
// routes/products.js
var multer = require('multer');

var myStorage = multer.diskStorage({  
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../public/images/user-images') 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
});

```

---

# multer Request Interceptor

```js
//routes/products.js
var requestHandler = multer({ storage: myStorage });

router.post('/create', requestHandler.single('productImage'), function(req, res, next) {

});
```

---

## Product Create Response Handler

* We'll now need to add the product to our model.
* We can use the "addProduct" function defined, passing in the body parameters as well as the name of the file that was saved.

```js
//routes/products.js
router.post('/create', requestHandler.single('productImage'), function(req, res, next) {
    products.addProduct(req.body, req.file.filename)
    res.redirect('/');
});
```

---

# Exercise

* Inside of views/index.ejs, fill in any 'TODO:...' to display the current products.
* You will want to specify the product title, image, and link to see the details for that product
* Create a new product and verify you are seeing it on the index page.
* Do the same for views/product/show.ejs
* You know you're done when all the products are showing up in the index page and you can click on the "View" button for each product and see the details page.
* (disregard any thumbnails for now)

---

# Next Steps: Creating Thumbnails

* Let's get started by installing 'sharp'

```bash
    $ npm install sharp --save
```

---

# sharp Usage

```js
var sharp = require('sharp');

//routes/products.js
router.post('/create', upload.single('productImage'), function(req, res, next) {
    
    //call the sharp() function passing in the image we want to resize
	sharp(__dirname + '/../public/images/user-images/' + req.file.filename)
	
	// ignoreAspectRatio will not crop the image to fit the desired size
	.ignoreAspectRatio()
	
	// resize image to these dimensions (w x h) in pixels
	.resize(200, 200)
	
	// specify where to save the result
	.toFile(__dirname + '/../public/images/user-images/thumbnails/' + req.file.filename, function(err, info) {
		products.addProduct(req.body, req.file.filename)
		res.redirect('/');
	});
});

```

---

# Exercise

* Change the markup on the index.ejs page to display the thumbnails instead of the original image.

---

# Assignment

* From the product details page allow the user to upload more images for a particular product.
* You will need to create a new route to handle this submission/upload.
* Also, you will need to make a change to the model to account for multiple images.
* On the product details page, display the additional images that were uploaded.
