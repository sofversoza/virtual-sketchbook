import Element from "../Element.js"

export default class Square extends Element {
	constructor(id, x, y, color, fill, width) {
		super(id, x, y, "square", color, fill, width)
		this.calculateBoundingBox()
	}

	draw(ctx, isHighlighted = false) {
		super.draw(ctx, isHighlighted)
		const width = this.end.x - this.start.x
		const height = this.end.y - this.start.y

		!this.fill
			? ctx.strokeRect(this.start.x, this.start.y, width, height)
			: ctx.fillRect(this.start.x, this.start.y, width, height)
	}
}
