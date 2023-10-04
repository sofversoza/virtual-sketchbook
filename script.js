const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
const sidebar = document.getElementById("sidebar")
const sidebarIcon = document.getElementById("sidebar-icon")
const tools = document.querySelectorAll(".tools li.tool:not(.width)")
const shapes = document.querySelectorAll(".shape")
const colorPicker = document.querySelector("#s-color-picker")
const colorOptions = document.querySelectorAll(".colors .color")
const lineWidthOptions = document.querySelectorAll(".tools .width")
const clearCanvas = document.querySelector(".clear-btn")
const saveCanvas = document.querySelector(".save-btn")

let prevMouseX, prevMouseY //mousedown x1,y1
let isDrawing = false
let sidebarClosed = true
let selectedTool
let selectedColor
let selectedWidth
let snapshot

window.addEventListener("load", () => {
	canvas.width = canvas.offsetWidth
	canvas.height = canvas.offsetHeight
})

sidebarIcon.addEventListener("click", () => {
	if (sidebarClosed) {
		sidebarClosed = false
		sidebar.style.left = "0"
		sidebarIcon.style.transform = "rotate(180deg)"
	} else {
		sidebarClosed = true
		sidebar.style.left = "-13vw"
		sidebarIcon.style.transform = "rotate(0deg)"
	}

	console.log("clicked icon")
})

function fillShape() {
	shapes.forEach((shape) => {
		const shapeImg = shape.querySelector("img")
		shape.classList.contains("active")
			? (shapeImg.src = `assets/${shape.id}` + "Filled.svg")
			: (shapeImg.src = `assets/${shape.id}` + ".svg")
	})
}

tools.forEach((tool) => {
	tool.addEventListener("click", () => {
		document.querySelector(".tools .active").classList.remove("active")
		tool.classList.add("active")
		selectedTool = tool.id
		console.log(selectedTool)
		fillShape()
	})
})

const drawBox = (e) => {
	return ctx.strokeRect(
		e.offsetX,
		e.offsetY,
		prevMouseX - e.offsetX,
		prevMouseY - e.offsetY
	)
}

const drawCircle = (e) => {
	ctx.beginPath()
	//radius of circle according to mouse pointer
	let radius = Math.sqrt(
		Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
	)
	//x1, y1, radius, start & end angle
	ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
	ctx.stroke()
}

const drawTriangle = (e) => {
	ctx.beginPath()
	ctx.moveTo(prevMouseX, prevMouseY) //move tri to mouse pointer
	ctx.lineTo(e.offsetX, e.offsetY) //1st line to mouse pointer
	ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY) //tri's bottom line
	ctx.closePath() //auto draw 3rd line, closing the tri
	ctx.stroke()
}

const startDraw = (e) => {
	isDrawing = true
	prevMouseX = e.offsetX //passing current mouseX/Y pos as prev mouseX/Y values
	prevMouseY = e.offsetY
	ctx.beginPath()
	ctx.strokeStyle = selectedColor
	ctx.lineWidth = selectedWidth
	//copy canvas data into snapshot to stop weird dragging while drawing
	snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const drawing = (e) => {
	if (!isDrawing) return
	ctx.putImageData(snapshot, 0, 0) //adding copied canvas data onto this canvas

	if (selectedTool === "pencil" || selectedTool === "eraser") {
		ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
		ctx.lineTo(e.offsetX, e.offsetY) //creating line according to mouse pointer
		ctx.stroke() //drawing/filling line with color
	} else if (selectedTool === "square") {
		drawBox(e)
	} else if (selectedTool === "circle") {
		drawCircle(e)
	} else {
		drawTriangle(e)
	}
}

//change line width
lineWidthOptions.forEach((width) => {
	width.addEventListener("click", () => {
		document.querySelector(".tools .selected").classList.remove("selected")
		width.classList.add("selected")
		selectedWidth = parseFloat(width.getAttribute("data-line-width"))
		console.log(selectedWidth)
	})
})

//change color
colorOptions.forEach((color) => {
	color.addEventListener("click", () => {
		document.querySelector(".colors .selected").classList.remove("selected")
		color.classList.add("selected")
		// passing selected btn background-color as selectedColor value
		selectedColor = window
			.getComputedStyle(color)
			.getPropertyValue("background-color")
		console.log(selectedColor)
	})
})

//color picker
colorPicker.addEventListener("change", () => {
	// passing picked color value from color picker to last color btn bg
	colorPicker.parentElement.style.background = colorPicker.value
	colorPicker.parentElement.click()
})

//clear canvas
// clearCanvas.addEventListener("click", () => {
// 	ctx.clearRect(0, 0, canvas.width, canvas.height)
// })

//save canvas
// saveCanvas.addEventListener("click", () => {
// 	const link = document.createElement("a") //create link element
// 	link.download = `${Date.now()}.jpg` //current date as link download value
// 	link.href = canvas.toDataURL() //toDataURL:data url of img. canvasData=href
// 	link.click() //clicking link to download image
// })

canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => (isDrawing = false))
