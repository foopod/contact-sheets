const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const smartcrop = require('smartcrop')

const processFiles = function(options, callback){
    const padding = 20;

    const imageList = options.filenames
    const numCols = options.columns

    const numRows = Math.ceil(imageList.length/numCols);

    const filewidth = parseInt(options.width);
    const columnWidth = filewidth/numCols
    loadImage(options.path + '/' + imageList[0]).then((image)=>{
        let aspect
        if(image.height>image.width){
            aspect = image.width / image.height
        }else {
            aspect = image.height / image.width
        }

        let rowHeight = columnWidth * aspect
        const fileheight = rowHeight * numRows;


        const canvas = createCanvas(filewidth+padding, fileheight+padding)
        const context = canvas.getContext('2d')

        context.fillStyle = options.colour
        context.fillRect(0, 0, filewidth+padding, fileheight+padding)

        const promises = [];

        imageList.forEach((filename,index) => {
            const promise = new Promise((resolve) => {
                let x = index%numCols * filewidth/numCols;
                let y = Math.floor(index/numCols) * rowHeight;

                loadImage(options.path + '/' + filename).then(image => {
                    drawImage(context, image, x+padding, y+padding, columnWidth-padding, rowHeight-padding, aspect);
                    resolve();
                })
            });
            promises.push(promise);
            
        });

        Promise.all(promises).then(() => {
            let buffer = canvas.toBuffer('image/png')
            fs.writeFileSync(`${options.path}/contactsheet.png`, buffer)
            callback()
        });
    })
    
}

module.exports = processFiles;

const drawImage = (context, image, x, y, width, height,aspect) => {
    console.log("draw");
    if(image.width>image.height){ 
        // landscape
        if(image.width*aspect>image.height){
            context.drawImage(image, 0,0,image.height/aspect,image.height, x, y, width, height);
        }else{
            context.drawImage(image, 0,0,image.width,image.width*aspect, x, y, width, height);
        }
    } else {
        // portrait needs rotating
        context.translate(x, y);
        context.rotate(-Math.PI/2);
        if(image.width/aspect>image.height){
            context.drawImage(image, 0,0, image.width, image.width/aspect, -height, 0, height, width);
        }else{
            context.drawImage(image, 0,0, image.height*aspect, image.height, -height, 0, height, width);
        }
        context.rotate(Math.PI/2);
        context.translate(-x, -y);
    }
}