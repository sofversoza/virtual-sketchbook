import { isDarkModeOn } from "../../utils/colors.js"

export default class Element {
	constructor(id, x, y, type, color, fill, width) {
		this.id = id
		this.start = { x, y }
		this.end = { x, y }
		this.type = type
		this.color = color
		this.fill = fill
		this.width = width
		this.calculateBoundingBox()
	}

	draw(ctx, isHighlighted = false) {
		ctx.strokeStyle = this.color
		ctx.fillStyle = this.color
		ctx.lineWidth = this.width
		ctx.lineCap = "round"
		ctx.lineJoin = "round"

		if (isHighlighted) {
			ctx.save() //save current context state
			ctx.strokeStyle = isDarkModeOn() ? "#D2C9FC" : "#29531c"
			ctx.lineWidth = 1
			ctx.setLineDash([5, 5])
			this.boundingBox = this.calculateBoundingBox()
			const { minX, minY, maxX, maxY } = this.boundingBox
			ctx.strokeRect(minX, minY, maxX - minX, maxY - minY)
			ctx.restore() //restore to previous context state
		}
	}

	//moving & resizing an element
	update(x1, y1, x2, y2) {
		this.start = { x: x1, y: y1 }
		this.end = { x: x2, y: y2 }
		this.boundingBox = this.calculateBoundingBox()
	}

	//returns coords for creating boundingBox in draw() for highlighting
	calculateBoundingBox() {
		const padding = this.type === "line" ? 5 : 10
		const minX = Math.min(this.start.x, this.end.x) - padding
		const minY = Math.min(this.start.y, this.end.y) - padding
		const maxX = Math.max(this.start.x, this.end.x) + padding
		const maxY = Math.max(this.start.y, this.end.y) + padding
		return { minX, minY, maxX, maxY }
	}

	resizeCoordinates(mouseX, mouseY) {
		let newX1 = this.start.x
		let newY1 = this.start.y
		let newX2 = this.end.x
		let newY2 = this.end.y

		switch (this.position) {
			case "tl":
				newX1 = mouseX
				newY1 = mouseY
				break
			case "tr":
				newX2 = mouseX
				newY1 = mouseY
				break
			case "bl":
				newX1 = mouseX
				newY2 = mouseY
				break
			case "br":
				newX2 = mouseX
				newY2 = mouseY
				break
			default:
				return
		}

		//update element's start & end points directly
		this.start = { x: newX1, y: newY1 }
		this.end = { x: newX2, y: newY2 }

		return {
			newX1,
			newY1,
			newX2,
			newY2,
		}
	}
}
