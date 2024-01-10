//command interface, superclass
export class Command {
	execute() {}
	undo() {}
}

//concrete commands, subclasses
//for initiating the drawing of a new element
export class DrawCommand extends Command {
	constructor(elements, element) {
		super()
		this.elements = elements
		this.element = element
	}

	execute() {
		this.elements.push(this.element)
	}

	undo() {
		const index = this.elements.indexOf(this.element)
		if (index > -1) {
			this.elements.splice(index, 1)
		}
	}
}

//for updating an existing element (moving, resizing)
export class UpdateCommand extends Command {
	constructor(element, newProps) {
		super()
		this.element = element
		this.oldProps = { ...element } //save current state for undo
		this.newProps = newProps
	}

	execute() {
		Object.assign(this.element, this.newProps)
	}

	undo() {
		Object.assign(this.element, this.oldProps)
	}
}
