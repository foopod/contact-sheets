const {ipcRenderer} = require('electron')
let options
let uiElements

function init(){
  setView("open");

  // draw preview every time a ui element changes
  uiElements = [document.getElementById("columns"),document.getElementById("size"),document.getElementById("colour")]
  uiElements.forEach(element => {
    element.addEventListener("change",()=>{
      drawPreview()
    })
  });

  document.getElementById("create").addEventListener("click", ()=>{
    ipcRenderer.send('create-message', options)
  })
}

function setView(view){
  document.getElementById("open").style.display = "none"
  document.getElementById("config").style.display = "none"
  if(view == "open"){
    document.getElementById("open").style.display = "block"
  } else if(view == "config"){
    document.getElementById("config").style.display = "block"
  }
}

function drawPreview(){
  if(document.getElementById("columns").value < 3){
    document.getElementById("columns").value = 3
  }
  let canvas = document.getElementById("preview")
  let ctx = canvas.getContext("2d")

  let noFiles = options.noFiles
  let fileList = options.filenames
  let columns = document.getElementById("columns").value
  let width = document.getElementById("size").value
  let colour = document.getElementById("colour").value
  let aspect = 1

  options.columns = document.getElementById("columns").value
  options.width = document.getElementById("size").value
  options.colour = document.getElementById("colour").value

  //console.log(`${noFiles} files, they are ${fileList}, with ${columns} columns, a width of ${width} and color ${colour}`)
  let padding = 4
  let previewWidth = canvas.width
  let columnWidth = previewWidth/columns
  let rows = Math.ceil(noFiles/columns)
  let rowHeight = columnWidth * aspect

  canvas.height = rows * rowHeight;

  
  canvas.height +=padding
  canvas.width +=padding
  ctx.fillStyle = colour
  ctx.fillRect(0,0,canvas.width+padding*2, canvas.height+padding*2)

  ctx.fillStyle = "#777"


  var count = 0
  for(var y = 0; y < rows; y++){
    for(var x = 0; x < columns; x++){
      if(count< noFiles){
        ctx.fillRect(x*columnWidth+padding,y*rowHeight+padding,columnWidth-padding, rowHeight-padding)
      }
      count++;
    }
  }
  
}

init()

document.getElementById('dirs').addEventListener('click', (evt) => {
    evt.preventDefault()
    window.postMessage({
      type: 'select-dirs',
    })
  })

  // click to trigger upload
document.getElementById("uploadButton").addEventListener("click", function () {
  document.getElementById("dirs").click();
});

ipcRenderer.on('selected-dirs', (event, args) => {
  setView("config")
  options = args
  drawPreview()
})

ipcRenderer.on('create-reply', (event, args) => {
  console.log(args)
})


ipcRenderer.send('asynchronous-message', 'async ping')