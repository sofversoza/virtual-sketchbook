import Element from "../Element.js"

export default class Triangle extends Element {
	constructor(id, x, y, color, fill, width) {
		super(id, x, y, "triangle", color, fill, width)
		this.updateVertices() //init vertices
	}

	updateVertices() {
		const baseLength = Math.abs(this.end.x - this.start.x) * 2
		this.vertex1 = { x: this.start.x - baseLength / 2, y: this.start.y } //left vertex
		this.vertex2 = { x: this.start.x + baseLength / 2, y: this.start.y } //right vertex
		this.vertex3 = { x: this.end.x, y: this.end.y } //top vertex
	}

	draw(ctx, isHighlighted = false) {
		this.updateVertices() //ensures vertices are updated before drawing
		super.draw(ctx, isHighlighted)
		ctx.beginPath()
		ctx.moveTo(this.vertex1.x, this.vertex1.y)
		ctx.lineTo(this.vertex2.x, this.vertex2.y)
		ctx.lineTo(this.vertex3.x, this.vertex3.y)
		ctx.closePath()
		!this.fill ? ctx.stroke() : ctx.fill()
	}

	calculateBoundingBox() {
		this.updateVertices() //ensures vertices are updated before calculating bounding box
		const padding = 10
		const minX = Math.min(this.vertex1.x, this.vertex2.x, this.vertex3.x)
		const maxX = Math.max(this.vertex1.x, this.vertex2.x, this.vertex3.x)
		const minY = Math.min(this.vertex1.y, this.vertex2.y, this.vertex3.y)
		const maxY = Math.max(this.vertex1.y, this.vertex2.y, this.vertex3.y)

		return {
			minX: minX - padding,
			minY: minY - padding,
			maxX: maxX + padding,
			maxY: maxY + padding,
		}
	}

	update(x1, y1, x2, y2) {
		super.update(x1, y1, x2, y2)
		this.updateVertices() //recalculate vertices after updating points
	}
}
