var imagemin   = require("imagemin"),       // The imagemin module.
  webp         = require("imagemin-webp"),  // imagemin's WebP plugin.
  outputFolder = "./dist/img",              // Output folder
  PNGImages    = "./app/img/*.png",         // PNG images
  JPEGImages   = "./app/img/*.jpg";         // JPEG images

imagemin([PNGImages], outputFolder, {
  plugins: [webp({
      lossless: 50 // Losslessly encode images
  })]
});

imagemin([JPEGImages], outputFolder, {
  plugins: [webp({
    quality: 65 // Quality setting from 0 to 100
  })]
});

// to run this file - simply type 'node app/js/webp.js' in your CLI