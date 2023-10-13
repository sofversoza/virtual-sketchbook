const body = document.body
const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
const sidebar = document.getElementById("sidebar")
const sidebarIcon = document.getElementById("sidebar-icon")
const tools = document.querySelectorAll(".tools li.tool:not(.width):not(.fill)")
const shapes = document.querySelectorAll(".shape")
const colorPicker = document.querySelector("#s-color-picker")
const colorOptions = document.querySelectorAll(".colors .color")
const colorPalettes = {
	1: document.querySelectorAll(".col-1 .color:not(#rainbow)"),
	2: document.querySelectorAll(".col-2 .color:not(#black)"),
	3: document.querySelectorAll(".col-3 .color:not(#white)"),
}
const colorViewer = document.querySelector("#color-viewer")
const lineWidthOptions = document.querySelectorAll("#line-width-options .width")
const colorFillOptions = document.querySelectorAll("#color-fill .fill")
const darkModeBtns = document.querySelectorAll(".dark-mode button")
const redoUndoBtns = document.querySelectorAll(".redo-undo button")
const clearCanvas = document.querySelector(".clear-btn")
const saveCanvas = document.querySelector(".save-btn")

let startX, startY //mousedown x1,y1
let isDrawing = false
let sidebarOpen = true
let fillColor = false
let selectedTool
let selectedColor
let selectedWidth
let snapshot

// Reusable function to set canvas dimensions
function setCanvasDimensions() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}

// Reusable function to draw shapes
function drawShape(shapeFunc, e) {
	ctx.beginPath()
	shapeFunc(e)
	if (!fillColor) {
		ctx.stroke()
	} else {
		ctx.fill()
	}
}

// Reusable function to draw a line
function drawLine(e) {
	ctx.moveTo(startX, startY)
	ctx.lineTo(e.offsetX, e.offsetY)
	ctx.stroke()
}

// Reusable function to clear the canvas
function clearCanvasAction() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// Reusable function to save the canvas
function saveCanvasAction() {
	const link = document.createElement("a")
	link.download = `${Date.now()}.jpg`
	link.href = canvas.toDataURL()
	link.click()
}

window.addEventListener("load", setCanvasDimensions)

function fillShape() {
	shapes.forEach((shape) => {
		const shapeImg = shape.querySelector("img")
		shape.classList.contains("active")
			? (shapeImg.src = `assets/${shape.id}` + "Filled.svg")
			: (shapeImg.src = `assets/${shape.id}` + ".svg")
	})
}

const drawBox = (e) => {
	ctx.strokeRect(e.offsetX, e.offsetY, startX - e.offsetX, startY - e.offsetY)
}

const drawCircle = (e) => {
	ctx.beginPath()
	const radius = Math.sqrt(
		Math.pow(startX - e.offsetX, 2) + Math.pow(startY - e.offsetY, 2)
	)
	ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
	drawShape(drawCircle, e)
}

const drawTriangle = (e) => {
	ctx.moveTo(startX, startY)
	ctx.lineTo(e.offsetX, e.offsetY)
	ctx.lineTo(startX * 2 - e.offsetX, e.offsetY)
	ctx.closePath()
	drawShape(drawTriangle, e)
}

const startDraw = (e) => {
	isDrawing = true
	startX = e.offsetX
	startY = e.offsetY
	ctx.beginPath()
	ctx.strokeStyle = selectedColor
	ctx.fillStyle = selectedColor
	ctx.lineWidth = selectedWidth
	snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const drawing = (e) => {
	if (!isDrawing) return
	ctx.putImageData(snapshot, 0, 0)

	switch (selectedTool) {
		case "pencil":
		case "eraser":
			ctx.strokeStyle =
				selectedTool === "eraser" ? getBodyColor() : selectedColor
			ctx.lineTo(e.offsetX, e.offsetY)
			ctx.stroke()
			break
		case "line":
			drawLine(e)
			break
		case "square":
			drawBox(e)
			break
		case "circle":
			drawCircle(e)
			break
		case "triangle":
			drawTriangle(e)
			break
	}
}

function handleToolClick(tool) {
	document.querySelector(".tools .active").classList.remove("active")
	tool.classList.add("active")
	selectedTool = tool.id
	fillShape()
}

tools.forEach((tool) => {
	tool.addEventListener("click", () => handleToolClick(tool))
})

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

function handleLineWidthClick(width) {
	document
		.querySelector("#line-width-options .selected")
		.classList.remove("selected")
	width.classList.add("selected")
	selectedWidth = parseFloat(width.getAttribute("data-line-width"))
}

lineWidthOptions.forEach((width) => {
	width.addEventListener("click", () => handleLineWidthClick(width))
})

function handleColorFillClick(option) {
	document.querySelector("#color-fill .selected").classList.remove("selected")
	option.classList.add("selected")
	fillColor = option.id === "fill"
}

colorFillOptions.forEach((option) => {
	option.addEventListener("click", () => handleColorFillClick(option))
})

function handleColorPaletteClick(icon, colorSet) {
	const colors = [
		"#831A0C",
		"#2C4F9A",
		"#065b26",
		"#ECEA7A",
		"#b8591d",
		"#983572",
		"#603E83",
		"#543623",
		"#474747",
	]

	colors.forEach((color, i) => {
		icon[i].style.backgroundColor = color
	})
}

Object.keys(colorPalettes).forEach((paletteKey) => {
	handleColorPaletteClick(colorPalettes[paletteKey], paletteKey)
})

function handleColorClick(color) {
	document.querySelector(".colors .selected").classList.remove("selected")
	color.classList.add("selected")
	selectedColor = window
		.getComputedStyle(color)
		.getPropertyValue("background-color")
	colorViewer.style.backgroundColor = selectedColor
}

colorOptions.forEach((color) => {
	color.addEventListener("click", () => handleColorClick(color))
})

colorPicker.addEventListener("change", () => {
	colorPicker.parentElement.style.background = colorPicker.value
	colorPicker.parentElement.click()
	colorViewer.style.backgroundColor = colorPicker.value
})

function handleDarkModeClick(btn) {
	document.querySelector(".dark-mode .active").classList.remove("active")
	btn.classList.add("active")
	body.style.backgroundColor = btn.id === "off" ? "#D3D8DB" : "#3E3E3F"
	getBodyColor()
}

darkModeBtns.forEach((btn) => {
	btn.addEventListener("click", () => handleDarkModeClick(btn))
})

redoUndoBtns.forEach((btn) => {
	btn.addEventListener("mousedown", () => {
		btn.classList.add("clicked")
		console.log(`clicked down: ${btn.id} btn`)
	})

	btn.addEventListener("click", () => {
		console.log(`~${btn.id} changes~`)
	})

	btn.addEventListener("mouseup", () => {
		btn.classList.remove("clicked")
		console.log(`un clicked: ${btn.id} btn`)
	})
})

clearCanvas.addEventListener("mousedown", () => {
	clearCanvas.classList.add("clicked")
	console.log("clicked down")
})

clearCanvas.addEventListener("click", clearCanvasAction)

clearCanvas.addEventListener("mouseup", () => {
	clearCanvas.classList.remove("clicked")
	console.log("un clicked")
})

saveCanvas.addEventListener("mousedown", () => {
	saveCanvas.classList.add("clicked")
})

saveCanvas.addEventListener("click", saveCanvasAction)

saveCanvas.addEventListener("mouseup", () => {
	saveCanvas.classList.remove("clicked")
})

canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => (isDrawing = false))
