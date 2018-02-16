autoscale: true
footer: © New York Code + Design Academy 2016
slidenumbers: true

# File Upload in NodeJS

---

## Agenda

* Introduction
* Form Encoding
* "multer" Fundamentals
* Image Processing with "sharp"
* Summary

---

## Introduction

* It is very common nowadays for a web application to allow a user to upload a file.
* This file is usually an image, but it can be a pdf, video or mp3.
* In today's class, we will see how to accomplish this in a NodeJS application.
* We'll begin by taking a look at the client side actions we have to take.

---

## Form Encoding 

* We first have to tell the browser that the form we're using will contain a file.
* We have different ways of encoding information contained in forms.
    * application/x-www-form-urlencoded: the default behavior. Special characters are encoded.
    * text/plain: No encoding except for space characters.
    * multipart/form-data: used for sending binary data (images, videos, etc).

Source
[http://www.w3schools.com/tags/att_form_enctype.asp](http://www.w3schools.com/tags/att_form_enctype.asp)

---

## Form "enctype" attribute

* Set the "enctype" attribute of the form element to one of the above values to specify the desired encoding.

```html


(default)
<form enctype="application/x-www-form-urlencoded"></form>

or

<form enctype="multipart/form-data"></form>
```

---

## Multipart vs Urlencoded

* The difference is the way the information is encoded for the form submission request.  
* Below shows the data for a multipart vs URL Encoded encoded form.

```

```

![inline fill 90%](./resources/images/multipart-form.png) ![inline fill 100%](./resources/images/urlencoded-form.png)

```
            mutlipart                               urlencoded
```

---

## File Input

* An input type used for allowing the user to attach a file to the form.

```html
    <input type="file" name="userImage">
    
```

Resulting Element:

![inline 170%](./resources/images/file_input.png)

---

## File Upload - Server Side

* Now that we have the form setup, let's work on the server side code.
* In order to handle mutlipart form requests we need to use a library called "multer"
* multer is used specifically for handling multipart form requests.
* It gives the developer a lot of flexibility in specifying how and where to save the incoming files.

---

## multer Installation

```bash
    $ npm install multer --save
```

---

## multer Configuration

* To use multer we need to specify some information.
    1. What to name the incoming files.
    2. Where to save them.
    3. The routes we want to use multer for.
    
---

## multer Configuration

* First define the storage type
    1. diskStorage: saves the files in the file system.
    2. memoryStorage: keeps the files in memory while your server is running.

```js
var multer  = require('multer')

var myStorage = multer.diskStorage(/* options */);

// or 

var myStorage = multer.memoryStorage();

```

---

## multer diskStorage Options Syntax

* To specify the destination directory and filename we have to define an object where these two properties are functions. Each function looks like:

```js
    function (req, file, cb) {
        /*
        req: the incoming request
        
        file: the file the user wants to upload
        
        cb: the callback function we have to call with the result
            we have two options here:
                * cb(error)  if we don't want to save the result
                
                * cb(null, result) if everthing is good
        
        */
    }
```

---

## multer diskStorage Example

```js
var multer = require('multer');

// diskStorage specifies we're saving the files to disk
var myStorage = multer.diskStorage({  
  destination: function (req, file, cb) {
  
    // the directory of where to save the files
    cb(null, './public/images/user-images') 
  },
  filename: function (req, file, cb) {
    
    // For each request what do we call the file.
    // file.mimetype.split('/')[1] captures the extension (eg png or jpg).
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
});

```

---

## multer Request Interceptor

* Now that we've specified the storage mechanism we can create the request handler.
* Call the multer function passing in the desired storage strategy.
* This will give you back a requestHandler.
* Specify which route to use the requestHandler for.
* multer does support uploading multiple files at the same time
* We pass in the same name of the input field from the form.


```js
var requestHandler = multer({ storage: myStorage })

router.post('/create', requestHandler.single('nameOfField'), 
    function(req, res, next) {
        // req has special file property now
    }
);
```

---

## Product Create Response Handler

* Now that multer is processing the request before our response handler, the "req" object being passed in to our function will have an additional property called "file"

```js
// example file object
req.file = {
  fieldname: 'productImage', // original html input
  originalname: '54cfd569f384a_-_bta-products-01-1013-de.jpg',
  mimetype: 'image/jpeg',
  destination: 'path/to/the/directory/we/used',
  filename: 'productImage-1480448807386.jpeg',
  path: 'path/from/root',
  size: 28784 
}

```

---

## Response Handler

* Typically save the information in req.file into our database or model.
* Most important are the req.file.filename and the req.file.destination.

---

## Summary

* File upload consists of a close synchronization between the client and the server.
* On the client side, we have to use a "multipart/form-data" encoding along with an input of type "file".
* On the server side, we used a module called "multer" that pulls the uploaded file from the request as well as saves it locally on disk.
* We typically save the path to that image in our model and then use that path in our markup.

---

# Next Steps: Creating Thumbnails

* The last thing we'll look at today is generate a thumbnail for the uploaded image.
* To do so we'll use a module called 'sharp'
* Let's get started by installing 'sharp'

```bash
    $ npm install sharp --save
```

---

# sharp Usage

* sharp is a powerful image processing module that let's you do things like resize, blur, rotate and crop images. We will be using the resize function to create a thumbnail.
* You can look at the documentation [here](http://sharp.readthedocs.io/en/stable/api/)
* Let first we'll require "sharp" into 'routes/products.js'

```js
var sharp = require('sharp');
```

---

# sharp

```js
router.post('/myRoute', function(req, res, next) {
    
    //call the sharp() function passing in the image we want to resize
	sharp('path/to/my/image')
	
	// ignoreAspectRatio will not crop the image to fit the desired size
	.ignoreAspectRatio()
	
	// resize image to these dimensions (w x h) in pixels
	.resize(0, 0)
	
	// specify where to save the result
	.toFile('path/to/save/image', function(err, info) {

		res.redirect('/');
	});
});

```

---

# Assignment

* From the product details page allow the user to upload more images for a particular product.
* You will need to create a new route to handle this submission/upload.
* Also, you will need to make a change to the model to account for multiple images.
* On the product details page, display the additional images that were uploaded.
