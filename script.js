const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
const sidebar = document.getElementById("sidebar")
const sidebarIcon = document.getElementById("sidebar-icon")
const tooltip = document.querySelector(".tooltip")
const tooltipTriggers = document.querySelectorAll(".tooltip-trigger")
const tools = document.querySelectorAll(".tools li.tool:not(.width)")
const shapes = document.querySelectorAll(".shape")
const colorPicker = document.querySelector("#s-color-picker")
const colorOptions = document.querySelectorAll(".colors .color")
const lineWidthOptions = document.querySelectorAll("#line-width-options .width")
const clearCanvas = document.querySelector(".clear-btn")
const saveCanvas = document.querySelector(".save-btn")

let startX, startY //mousedown x1,y1
let isDrawing = false
let sidebarOpen = true
let selectedTool
let selectedColor
let selectedWidth
let bodyColor
let snapshot

window.addEventListener("load", () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
})

function fillShape() {
	shapes.forEach((shape) => {
		const shapeImg = shape.querySelector("img")
		shape.classList.contains("active")
			? (shapeImg.src = `assets/${shape.id}` + "Filled.svg")
			: (shapeImg.src = `assets/${shape.id}` + ".svg")
	})
}

function getBodyColor() {
	const body = document.body
	const computedStyle = getComputedStyle(body)
	return (bodyColor = computedStyle.backgroundColor)
}

const drawBox = (e) => {
	return ctx.strokeRect(
		e.offsetX,
		e.offsetY,
		startX - e.offsetX,
		startY - e.offsetY
	)
}

const drawCircle = (e) => {
	ctx.beginPath()
	//radius of circle according to mouse pointer
	let radius = Math.sqrt(
		Math.pow(startX - e.offsetX, 2) + Math.pow(startY - e.offsetY, 2)
	)
	//x1, y1, radius, start & end angle
	ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
	ctx.stroke()
}

const drawTriangle = (e) => {
	ctx.beginPath()
	ctx.moveTo(startX, startY) //move tri to mouse pointer
	ctx.lineTo(e.offsetX, e.offsetY) //1st line to mouse pointer
	ctx.lineTo(startX * 2 - e.offsetX, e.offsetY) //tri's bottom line
	ctx.closePath() //auto draw 3rd line, closing the tri
	ctx.stroke()
}

const startDraw = (e) => {
	isDrawing = true
	startX = e.offsetX //passing current mouseX/Y pos as startX/Y values
	startY = e.offsetY
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
		ctx.strokeStyle = selectedTool === "eraser" ? getBodyColor() : selectedColor
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

tools.forEach((tool) => {
	tool.addEventListener("click", () => {
		document.querySelector(".tools .active").classList.remove("active")
		tool.classList.add("active")
		selectedTool = tool.id
		console.log(selectedTool)
		fillShape()
	})
})

//toggle sidebar
sidebarIcon.addEventListener("click", () => {
	if (sidebarOpen) {
		sidebar.style.left = "-90px"
		sidebarIcon.style.transform = "rotate(0deg)"
		sidebarOpen = false
	} else {
		sidebar.style.left = "0"
		sidebarIcon.style.transform = "rotate(180deg)"
		sidebarOpen = true
	}
})

//change line width
lineWidthOptions.forEach((width) => {
	width.addEventListener("click", () => {
		document
			.querySelector("#line-width-options .selected")
			.classList.remove("selected")
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
