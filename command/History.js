export default class History {
	constructor() {
		this.undoStack = []
		this.redoStack = []
	}

	executeCommand(command) {
		this.undoStack.push(command)
		this.redoStack = [] //clear redo stack on new command execution
	}

	undo() {
		const command = this.undoStack.pop() //removes & returns
		if (command) {
			command.undo() //method from Command
			this.redoStack.push(command)
			return true
		}
		return false
	}

	redo() {
		const command = this.redoStack.pop()
		if (command) {
			command.execute() //method from Command
			this.undoStack.push(command)
			return true
		}
		return false
	}
}
