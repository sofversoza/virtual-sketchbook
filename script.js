import History from "./command/History.js"
import BrushOrEraser from "./element/elements/BrushOrEraser.js"
import Line from "./element/elements/Line.js"
import Square from "./element/elements/Square.js"
import Circle from "./element/elements/Circle.js"
import Triangle from "./element/elements/Triangle.js"

import { showNotification } from "./utils/notification.js"
import { openMainModal } from "./utils/mainModal.js"
import { showTextModal } from "./utils/textModal.js"
import { DrawCommand, UpdateCommand } from "./command/Command.js"
import {
	populateColorOptions,
	getSelectedColor,
	getBodyColor,
} from "./utils/colors.js"
import {
	cursorForPosition,
	getElementAndPosition,
} from "./utils/coordinates.js"
import {
	adjustSidebarWidth,
	getLineWidth,
	colorFill,
	initSidebar,
	initTools,
	getSelectedTool,
	resetTool,
} from "./utils/sidebar.js"

let canvas, ctx
let mouseX, mouseY
let action = "none"
let elements = []
let selectedElement = null
let highlightedElement = null
let currentCommand = null
let history = new History()

document.addEventListener("DOMContentLoaded", () => {
	canvas = document.getElementById("canvas")
	ctx = canvas.getContext("2d")
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

	initSidebar()
	adjustSidebarWidth()
	initTools()
	populateColorOptions()
	addCanvasEvents()

	window.addEventListener("resize", adjustSidebarWidth)
})

function addCanvasEvents() {
	canvas.addEventListener("mousedown", handleMouseDown)
	canvas.addEventListener("mousemove", handleMouseMove)
	canvas.addEventListener("mouseup", handleMouseUp)
}

function redrawCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	elements.forEach((element) => {
		const isHighlighted = element === highlightedElement
		element.draw(ctx, isHighlighted)
	})
}

function handleMouseDown(e) {
	mouseX = e.offsetX
	mouseY = e.offsetY
	let color = getSelectedColor()
	let width = getLineWidth()
	let tool = getSelectedTool()
	let fill = colorFill()
	let element
	const id = elements.length

	if (tool === "select") {
		const elementAndPosition = getElementAndPosition(mouseX, mouseY, elements)

		if (elementAndPosition) {
			selectedElement = elementAndPosition.element
			selectedElement.position = elementAndPosition.position
		} else {
			highlightedElement = null
			selectedElement = null
			redrawCanvas()
		}

		if (selectedElement) {
			//capture initial state before any manipulations
			if (selectedElement.type === "brush") {
				currentCommand = new UpdateCommand(selectedElement, {
					points: [...selectedElement.points],
				})
			} else {
				currentCommand = new UpdateCommand(selectedElement, {
					...selectedElement,
				})
			}
			//adding offset props to use for moving so elem wont jump right to the mouse pos
			selectedElement.mouseOffsetX = mouseX - selectedElement.start.x
			selectedElement.mouseOffsetY = mouseY - selectedElement.start.y
			selectedElement.position === "inside"
				? (action = "moving")
				: (action = "resizing")
		}
	} else if (tool === "text") {
		showTextModal(
			() => ({ x: mouseX, y: mouseY, id: elements.length, color }),
			ctx,
			(textElement) => {
				if (textElement) {
					currentCommand = new DrawCommand(elements, textElement)
					currentCommand.execute()
					selectedElement = textElement
					action = "typing"
				}
			}
		)
	} else {
		switch (tool) {
			case "brush":
				element = new BrushOrEraser(id, mouseX, mouseY, color, width)
				break
			case "eraser":
				element = new BrushOrEraser(id, mouseX, mouseY, getBodyColor(), width)
				break
			case "line":
				element = new Line(id, mouseX, mouseY, color, width)
				break
			case "square":
				element = new Square(id, mouseX, mouseY, color, fill, width)
				break
			case "circle":
				element = new Circle(id, mouseX, mouseY, color, fill, width)
				break
			case "triangle":
				element = new Triangle(id, mouseX, mouseY, color, fill, width)
				break
			default:
				console.log("Unknown tool: ", tool)
				break
		}
		currentCommand = new DrawCommand(elements, element) //add element to elements
		currentCommand.execute() //execute new draw command
		selectedElement = element
		action = "drawing"
	}
}

function handleMouseMove(e) {
	mouseX = e.offsetX
	mouseY = e.offsetY

	if (getSelectedTool() === "select") {
		const elementAndPosition = getElementAndPosition(mouseX, mouseY, elements)
		e.target.style.cursor = elementAndPosition
			? cursorForPosition(elementAndPosition.position)
			: "default"
	}

	if (!selectedElement) return

	if (action === "drawing") {
		switch (selectedElement.type) {
			case "brush":
				selectedElement.addPoint(mouseX, mouseY)
				break
			case "line":
			case "square":
			case "circle":
			case "triangle":
				selectedElement.end = { x: mouseX, y: mouseY } //update only end props
				break
			default:
				break
		}
	} else if (action === "moving") {
		let newX1, newY1
		newX1 = mouseX - selectedElement.mouseOffsetX //so el wont jump right to mouse pos
		newY1 = mouseY - selectedElement.mouseOffsetY

		switch (selectedElement.type) {
			case "brush": //update all points
				selectedElement.points = selectedElement.points.map((point) => ({
					x: point.x + newX1 - selectedElement.start.x,
					y: point.y + newY1 - selectedElement.start.y,
				}))
				selectedElement.update(newX1, newY1, newX1, newY1)
				break
			case "line":
			case "square":
			case "circle":
			case "triangle":
			case "text":
				const width = selectedElement.end.x - selectedElement.start.x
				const height = selectedElement.end.y - selectedElement.start.y
				selectedElement.update(newX1, newY1, newX1 + width, newY1 + height)
				break
			default:
				console.log("cant move element:", selectedElement.type)
				break
		}
	} else if (action === "resizing") {
		selectedElement.resizeCoordinates(mouseX, mouseY)
	}
	redrawCanvas()
}

function handleMouseUp() {
	if (!selectedElement) return

	switch (action) {
		case "moving":
		case "resizing":
			//execute any update command on queue to update element w their final state
			if (currentCommand) {
				if (selectedElement.type === "brush") {
					currentCommand.newProps = {
						points: [...selectedElement.points],
						boundingBox: { ...selectedElement.boundingBox },
					}
				} else {
					currentCommand.newProps = { ...selectedElement }
				}
				currentCommand.execute()
				history.executeCommand(currentCommand) //add command to history
			}
			break
		case "drawing":
		case "typing":
			if (currentCommand) {
				history.executeCommand(currentCommand)
			}
			break
	}

	highlightedElement = selectedElement
	// highlightedElement =
	// 	selectedElement.type === "eraser" ? null : selectedElement
	selectedElement = null
	action = "none"
	resetTool()
	redrawCanvas()
}

function undoAction() {
	if (history.undo()) {
		highlightedElement = null
		redrawCanvas()
	}
}

function redoAction() {
	if (history.redo()) {
		highlightedElement = null
		redrawCanvas()
	}
}

//redo & undo
const redoUndoBtns = document.querySelectorAll(".redo-undo button")
redoUndoBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		showNotification(`${btn.id} changes`)
		btn.id === "undo" ? undoAction() : redoAction()
	})
})

//clear canvas
const clearCanvas = document.querySelector(".clear-btn")
clearCanvas.addEventListener("click", () => {
	openMainModal("reset", ctx, canvas)
})

//save canvas
const saveCanvas = document.querySelector(".save-btn")
saveCanvas.addEventListener("click", () => {
	openMainModal("download", ctx, canvas)
})
