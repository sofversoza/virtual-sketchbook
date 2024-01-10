import Element from "../Element.js"

export default class Circle extends Element {
	constructor(id, x, y, color, fill, width) {
		super(id, x, y, "circle", color, fill, width)
		this.calculateBoundingBox()
	}

	draw(ctx, isHighlighted = false) {
		super.draw(ctx, isHighlighted)
		const { radius, centerX, centerY } = this.calculateBoundingBox()
		ctx.beginPath()
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
		!this.fill ? ctx.stroke() : ctx.fill()
	}

	calculateBoundingBox() {
		const padding = 10
		const centerX = (this.start.x + this.end.x) / 2
		const centerY = (this.start.y + this.end.y) / 2
		const radius = Math.sqrt(
			Math.pow(this.end.x - centerX, 2) + Math.pow(this.end.y - centerY, 2)
		)

		return {
			centerX,
			centerY,
			radius,
			minX: centerX - radius - padding,
			minY: centerY - radius - padding,
			maxX: centerX + radius + padding,
			maxY: centerY + radius + padding,
		}
	}

	resizeCoordinates(mouseX, mouseY) {
		const { centerX, centerY } = this.calculateBoundingBox()
		let newRadius

		switch (this.position) {
			case "tl":
				newRadius = Math.max(centerX - mouseX, centerY - mouseY)
				break
			case "tr":
				newRadius = Math.max(mouseX - centerX, centerY - mouseY)
				break
			case "bl":
				newRadius = Math.max(centerX - mouseX, mouseY - centerY)
				break
			case "br":
				newRadius = Math.max(mouseX - centerX, mouseY - centerY)
				break
			default:
				return
		}

		this.start.x = centerX - newRadius
		this.start.y = centerY - newRadius
		this.end.x = centerX + newRadius
		this.end.y = centerY + newRadius

		return {
			newX1: this.start.x,
			newY1: this.start.y,
			newX2: this.end.x,
			newY2: this.end.y,
		}
	}
}
