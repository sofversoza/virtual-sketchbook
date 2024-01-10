import Element from "../Element.js"

export default class BrushOrEraser extends Element {
	constructor(id, x, y, color, width) {
		super(id, x, y, "brush", color, false, width)
		this.points = [{ x, y }] //init with the first points
		this.calculateBoundingBox()
	}

	addPoint(x, y) {
		this.points.push({ x, y })
		this.end = { x, y } //update end points
		this.calculateBoundingBox()
	}

	draw(ctx, isHighlighted = false) {
		if (this.points.length === 0) return
		super.draw(ctx, isHighlighted)
		ctx.beginPath()
		ctx.moveTo(this.points[0].x, this.points[0].y)
		this.points.forEach((point) => {
			ctx.lineTo(point.x, point.y)
		})
		ctx.stroke()
	}

	calculateBoundingBox() {
		if (!this.points || this.points.length === 0) {
			return
		}

		let minX = Infinity,
			minY = Infinity,
			maxX = -Infinity,
			maxY = -Infinity
		const padding = 10

		this.points.forEach((point) => {
			minX = Math.min(minX, point.x)
			minY = Math.min(minY, point.y)
			maxX = Math.max(maxX, point.x)
			maxY = Math.max(maxY, point.y)
		})

		return {
			minX: minX - padding,
			minY: minY - padding,
			maxX: maxX + padding,
			maxY: maxY + padding,
		}
	}

	resizeCoordinates(mouseX, mouseY) {
		const { minX, minY, maxX, maxY } = this.calculateBoundingBox()
		const width = maxX - minX
		const height = maxY - minY
		let newMinX = minX,
			newMinY = minY,
			newMaxX = maxX,
			newMaxY = maxY

		switch (this.position) {
			case "tl":
				newMinX = mouseX
				newMinY = mouseY
				break
			case "tr":
				newMaxX = mouseX
				newMinY = mouseY
				break
			case "bl":
				newMinX = mouseX
				newMaxY = mouseY
				break
			case "br":
				newMaxX = mouseX
				newMaxY = mouseY
				break
			default:
				return
		}

		const scaleX = (newMaxX - newMinX) / width
		const scaleY = (newMaxY - newMinY) / height

		this.points = this.points.map((point) => ({
			x: newMinX + (point.x - minX) * scaleX,
			y: newMinY + (point.y - minY) * scaleY,
		}))

		this.calculateBoundingBox()

		return {
			newX1: newMinX,
			newY1: newMinY,
			newX2: newMaxX,
			newY2: newMaxY,
		}
	}
}
