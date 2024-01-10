import Element from "../Element.js"

export default class Text extends Element {
	constructor(
		id,
		x,
		y,
		text,
		color,
		fontSize,
		fontFamily,
		fontStyle,
		textDecoration,
		fontWeight,
		textWidth,
		textHeight
	) {
		super(id, x, y, "text", color, false, false)
		this.text = text
		this.fontSize = fontSize
		this.fontFamily = fontFamily
		this.fontStyle = fontStyle
		this.textDecoration = textDecoration
		this.fontWeight = fontWeight
		this.textWidth = textWidth
		this.textHeight = textHeight
		this.calculateBoundingBox()
	}

	draw(ctx, isHighlighted = false) {
		if (this.textDecoration === "underline") {
			ctx.beginPath()
			ctx.moveTo(this.start.x, this.start.y + this.textHeight)
			ctx.lineTo(this.start.x + this.textWidth, this.start.y + this.textHeight)
			ctx.strokeStyle = this.color
			ctx.stroke()
		}

		ctx.font = `${this.fontWeight} ${this.fontStyle} ${this.fontSize}px ${this.fontFamily}`
		ctx.fillStyle = this.color
		ctx.textBaseline = "top"
		ctx.fillText(this.text, this.start.x, this.start.y)
		super.draw(ctx, isHighlighted)
	}

	calculateBoundingBox() {
		const padding = 5
		const minX = this.start.x - padding
		const minY = this.start.y - padding
		const maxX = this.start.x + this.textWidth + padding
		const maxY = this.start.y + this.textHeight + padding
		return { minX, minY, maxX, maxY }
	}
}
