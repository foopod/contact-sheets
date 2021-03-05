const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const smartcrop = require('smartcrop')
const resizeImage = require('smart-img-resize');


function test(){
    loadImage('./images/2021-02-19-0001.jpg').then(image => {
        resizeImage(image, { outputFormat: 'jpeg', targetWidth: 300, targetHeight: 200, crop: true}, (err, b64img) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(b64img)
            // do what you have to with the b64img
        })
    })
}
module.exports = test;