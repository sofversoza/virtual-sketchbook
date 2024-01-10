export function cursorForPosition(position) {
	switch (position) {
		case "tl":
		case "br":
		case "start":
		case "end":
			return "nwse-resize"
		case "tr":
		case "bl":
			return "nesw-resize"
		default: //inside the element
			return "move"
	}
}

//returns the element closest to the mouse pos & its position (string)
export function getElementAndPosition(mouseX, mouseY, elements) {
	if (elements.length === 0) return
	for (const element of elements) {
		const position = positionWithinElement(mouseX, mouseY, element)
		if (position !== null) {
			return { element, position }
		}
	}
	return null
}

//checks if mouse pos (x,y) is within/on/near the corners of an element
function positionWithinElement(x, y, element) {
	const {
		start: { x: x1, y: y1 },
		end: { x: x2, y: y2 },
		type,
	} = element

	switch (type) {
		case "brush":
			return positionWithinBrush(x, y, element)
		case "line":
			return positionWithinLine(x, y, element)
		case "square":
			return positionWithinSquare(x, y, element)
		case "circle":
			return positionWithinCircle(x, y, element)
		case "triangle":
			return positionWithinTriangle(x, y, element)
		case "text":
			return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null
		default:
			return null
	}
}

//to check if mouse pos' x&y coords is near an element's corner (x&y coords)
function nearPoint(x, y, x1, y1, name) {
	return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null //5 is offset
}

function positionWithinBrush(x, y, element) {
	if (!element.points || !Array.isArray(element.points)) {
		return null
	}

	const { minX, minY, maxX, maxY } = element.calculateBoundingBox()
	const topLeft = nearPoint(x, y, minX, minY, "tl")
	const topRight = nearPoint(x, y, maxX, minY, "tr")
	const bottomLeft = nearPoint(x, y, minX, maxY, "bl")
	const bottomRight = nearPoint(x, y, maxX, maxY, "br")
	const inside =
		x >= minX && x <= maxX && y >= minY && y <= maxY ? "inside" : null

	return topLeft || topRight || bottomLeft || bottomRight || inside
}

function positionWithinLine(x, y, element) {
	const {
		start: { x: x1, y: y1 },
		end: { x: x2, y: y2 },
	} = element

	const distance = (a, b) =>
		Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
	const a = { x: x1, y: y1 }
	const b = { x: x2, y: y2 }
	const c = { x, y } //mouse point pos
	const offset = distance(a, b) - (distance(a, c) + distance(b, c))
	const start = nearPoint(x, y, x1, y1, "start")
	const end = nearPoint(x, y, x2, y2, "end")
	const inside = Math.abs(offset) < 1 ? "inside" : null

	return start || end || inside
}

function positionWithinCircle(x, y, element) {
	const { centerX, centerY, radius, minX, minY, maxX, maxY } =
		element.calculateBoundingBox()

	const distanceToCenter = Math.sqrt(
		Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
	)

	const topLeft = nearPoint(x, y, minX, minY, "tl")
	const topRight = nearPoint(x, y, maxX, minY, "tr")
	const bottomLeft = nearPoint(x, y, minX, maxY, "bl")
	const bottomRight = nearPoint(x, y, maxX, maxY, "br")
	const inside = distanceToCenter <= radius ? "inside" : null

	return topLeft || topRight || bottomLeft || bottomRight || inside
}

function positionWithinSquare(x, y, element) {
	const {
		start: { x: x1, y: y1 },
		end: { x: x2, y: y2 },
	} = element

	const topLeft = nearPoint(x, y, x1, y1, "tl") //checking x1,y1 bc topLeft
	const topRight = nearPoint(x, y, x2, y1, "tr")
	const bottomLeft = nearPoint(x, y, x1, y2, "bl")
	const bottomRight = nearPoint(x, y, x2, y2, "br")
	const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null

	return topLeft || topRight || bottomLeft || bottomRight || inside
}

function positionWithinTriangle(x, y, element) {
	const { vertex1, vertex2, vertex3 } = element

	//calculates the area of a triangle given its 3 vertices
	const area = (x1, y1, x2, y2, x3, y3) =>
		Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0)

	//area of the triangle
	const mainArea = area(
		vertex1.x,
		vertex1.y,
		vertex2.x,
		vertex2.y,
		vertex3.x,
		vertex3.y
	)

	//areas of the triangle formed by the point & pairs of the triangle's vertices
	const area1 = area(x, y, vertex2.x, vertex2.y, vertex3.x, vertex3.y)
	const area2 = area(vertex1.x, vertex1.y, x, y, vertex3.x, vertex3.y)
	const area3 = area(vertex1.x, vertex1.y, vertex2.x, vertex2.y, x, y)

	const topCorner = nearPoint(x, y, vertex3.x, vertex3.y, "top")
	const bottomLeft = nearPoint(x, y, vertex1.x, vertex1.y, "bl")
	const bottomRight = nearPoint(x, y, vertex2.x, vertex2.y, "br")

	//small threshold to account for floating point errors
	const inside =
		Math.abs(mainArea - (area1 + area2 + area3)) < 1e-2 ? "inside" : null

	return inside || topCorner || bottomLeft || bottomRight
}

export function adjustedCoordinates(element) {
	const {
		start: { x: x1, y: y1 },
		end: { x: x2, y: y2 },
		type,
	} = element

	switch (type) {
		case "square":
			return adjustSquareCoords(x1, y1, x2, y2)
		case "line":
			return adjustLineCoords(x1, y1, x2, y2)
		default:
			return { x1, y1, x2, y2 }
	}
}

function adjustSquareCoords(x1, y1, x2, y2) {
	//however the square is drawn it'll always be: top-left as x1,y1 & bottom-right as x2,y2
	const minX = Math.min(x1, x2)
	const maxX = Math.max(x1, x2)
	const minY = Math.min(y1, y2)
	const maxY = Math.max(y1, y2)

	return { x1: minX, y1: minY, x2: maxX, y2: maxY }
}

function adjustLineCoords(x1, y1, x2, y2) {
	if (x1 < x2 || (x1 === x2 && y1 < y2)) {
		//if vertical, top: x1,y1 & bottom: x2,y2
		return { x1, y1, x2, y2 }
	} else {
		//if not vertical (any other pos), make left-handside: x1,y1 & right-handside: x2,y2
		return { x1: x2, y1: y2, x2: x1, y2: y1 }
	}
}
