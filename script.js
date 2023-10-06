const body = document.body
const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
const sidebar = document.getElementById("sidebar")
const sidebarIcon = document.getElementById("sidebar-icon")
const tools = document.querySelectorAll(".tools li.tool:not(.width):not(.fill)")
const shapes = document.querySelectorAll(".shape")
const colorPicker = document.querySelector("#s-color-picker")
const colorOptions = document.querySelectorAll(".colors .color")
const colorPalette1 = document.querySelectorAll(".col-1 .color:not(#rainbow)")
const colorPalette2 = document.querySelectorAll(".col-2 .color:not(#black)")
const colorPalette3 = document.querySelectorAll(".col-3 .color:not(#white)")
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
let darkmode
let selectedTool
let selectedColor
let selectedWidth
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

//for eraser tool
function getBodyColor() {
	let bodyColor
	const computedStyle = getComputedStyle(body)
	return (bodyColor = computedStyle.backgroundColor)
}

const drawBox = (e) => {
	if (!fillColor) {
		return ctx.strokeRect(
			e.offsetX,
			e.offsetY,
			startX - e.offsetX,
			startY - e.offsetY
		)
	}

	ctx.fillRect(e.offsetX, e.offsetY, startX - e.offsetX, startY - e.offsetY)
}

const drawCircle = (e) => {
	ctx.beginPath()
	//radius of circle according to mouse pointer
	let radius = Math.sqrt(
		Math.pow(startX - e.offsetX, 2) + Math.pow(startY - e.offsetY, 2)
	)
	//x1, y1, radius, start & end angle
	ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
	!fillColor ? ctx.stroke() : ctx.fill()
}

const drawTriangle = (e) => {
	ctx.beginPath()
	ctx.moveTo(startX, startY) //move tri to mouse pointer
	ctx.lineTo(e.offsetX, e.offsetY) //1st line to mouse pointer
	ctx.lineTo(startX * 2 - e.offsetX, e.offsetY) //tri's bottom line
	ctx.closePath() //auto draw 3rd line, closing the tri
	!fillColor ? ctx.stroke() : ctx.fill()
}

const startDraw = (e) => {
	isDrawing = true
	startX = e.offsetX //passing current mouseX/Y pos as startX/Y values
	startY = e.offsetY
	ctx.beginPath()
	ctx.strokeStyle = selectedColor
	ctx.fillStyle = selectedColor
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

//color fill
colorFillOptions.forEach((option) => {
	option.addEventListener("click", () => {
		document.querySelector("#color-fill .selected").classList.remove("selected")
		option.classList.add("selected")
		fillColor = option.id === "fill" ? true : false
		console.log("fill color?" + " " + fillColor)
	})
})

//color palettes
colorPalette1.forEach((icon, i) => {
	const col1_colors = [
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
	const color = col1_colors[i]
	icon.style.backgroundColor = color
})
colorPalette2.forEach((icon, i) => {
	const col2_colors = [
		"#954545",
		"#617BB3",
		"#4A8560",
		"#F1EF9B",
		"#D37D47",
		"#C171A3",
		"#82669F",
		"#7A5E4B",
		"#8F8E8E",
	]
	const color = col2_colors[i]
	icon.style.backgroundColor = color
})
colorPalette3.forEach((icon, i) => {
	const col3_colors = [
		"#C57D7D",
		"#7587BC",
		"#A5C2B0",
		"#EFEDB2",
		"#E4AE8C",
		"#DEB0CC",
		"#A692BA",
		"#937B6C",
		"#C7C7C7",
	]
	const color = col3_colors[i]
	icon.style.backgroundColor = color
})

//change color
colorOptions.forEach((color) => {
	color.addEventListener("click", () => {
		document.querySelector(".colors .selected").classList.remove("selected")
		color.classList.add("selected")
		selectedColor = window
			.getComputedStyle(color)
			.getPropertyValue("background-color")
		colorViewer.style.backgroundColor = selectedColor
		console.log(selectedColor)
	})
})

//color picker
colorPicker.addEventListener("change", () => {
	// passing picked color value from color picker to last color btn bg
	colorPicker.parentElement.style.background = colorPicker.value
	colorPicker.parentElement.click()
	colorViewer.style.backgroundColor = colorPicker.value
})

//dark mode
darkModeBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		document.querySelector(".dark-mode .active").classList.remove("active")
		btn.classList.add("active")
		btn.id === "off"
			? (body.style.backgroundColor = "#D3D8DB")
			: (body.style.backgroundColor = "#3E3E3F")
		getBodyColor()
	})
})

//redo&undo
redoUndoBtns.forEach((btn) => {
	btn.addEventListener("mousedown", () => {
		btn.id === "undo"
			? (btn.classList.add("clicked"), console.log("clicked down: undo btn"))
			: (btn.classList.add("clicked"), console.log("clicked down: redo btn"))
	})
	btn.addEventListener("click", () => {
		btn.id === "undo"
			? console.log("~undo changes~")
			: console.log("~redo changes~")
	})
	btn.addEventListener("mouseup", () => {
		btn.id === "undo"
			? (btn.classList.remove("clicked"), console.log("un clicked: undo btn"))
			: (btn.classList.remove("clicked"), console.log("un clicked: redo btn"))
	})
})

//clear canvas
clearCanvas.addEventListener("mousedown", () => {
	clearCanvas.classList.add("clicked")
	console.log("clicked down")
})
clearCanvas.addEventListener("click", () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	console.log("cleared canvas")
})
clearCanvas.addEventListener("mouseup", () => {
	clearCanvas.classList.remove("clicked")
	console.log("un clicked")
})

//save canvas
saveCanvas.addEventListener("mousedown", () => {
	saveCanvas.classList.add("clicked")
})
saveCanvas.addEventListener("click", () => {
	const link = document.createElement("a") //create link element
	link.download = `${Date.now()}.jpg` //current date as link download value
	link.href = canvas.toDataURL() //toDataURL:data url of img. canvasData=href
	link.click() //clicking link to download image
})
saveCanvas.addEventListener("mouseup", () => {
	saveCanvas.classList.remove("clicked")
})

canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => (isDrawing = false))
