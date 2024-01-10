import Element from "../Element.js"

export default class Line extends Element {
	constructor(id, x, y, color, width) {
		super(id, x, y, "line", color, false, width)
		this.calculateBoundingBox()
	}

	draw(ctx, isHighlighted = false) {
		super.draw(ctx, isHighlighted)
		ctx.beginPath()
		ctx.moveTo(this.start.x, this.start.y)
		ctx.lineTo(this.end.x, this.end.y)
		ctx.stroke()
	}

	resizeCoordinates(mouseX, mouseY) {
		switch (this.position) {
			case "start":
				this.start = { x: mouseX, y: mouseY }
				break
			case "end":
				this.end = { x: mouseX, y: mouseY }
				break
			default:
				return
		}

		this.calculateBoundingBox()

		return {
			newX1: this.start.x,
			newY1: this.start.y,
			newX2: this.end.x,
			newY2: this.end.y,
		}
	}
}
