import { hideTextModal } from "./textModal.js"
import { showNotification } from "./notification.js"

export function initSidebar() {
	toggleSidebar()
}

export function resetTool() {
	const selectTool = document.getElementById("select")
	selectTool.click()
	getSelectedTool()
}

let selectedTool = "select"
export function getSelectedTool() {
	return selectedTool
}

let selectedWidth = 2
export function getLineWidth() {
	return selectedWidth
}

let fillColor = false
export function colorFill() {
	return fillColor
}

export function initTools() {
	const tools = document.querySelectorAll(
		".tools li.tool:not(.width):not(.fill)"
	)
	const widthOptions = document.querySelectorAll("#line-width-options .width")
	const colorFillOptions = document.querySelectorAll("#color-fill .fill")

	tools.forEach((tool) => {
		tool.addEventListener("click", (e) => {
			tool.id !== "shapes"
				? showNotification(`Selected Tool: ${tool.id}`)
				: null

			document.querySelector(".tools .clicked")?.classList.remove("clicked")

			if (tool.id === "shapes") {
				showOptions(tool, e)
				document.querySelector(".tools .active")?.classList.remove("active")
				tool.classList.add("clicked")
				return
			}

			resetOptions()
			hideTextModal()
			document.querySelector(".tools .clicked")?.classList.remove("clicked")
			document.querySelector(".tools .active")?.classList.remove("active")
			tool.classList.add("active")
			selectedTool = tool.id
		})
	})

	widthOptions.forEach((width) => {
		width.addEventListener("click", () => {
			showNotification("Line width changed")
			document
				.querySelector("#line-width-options .selected")
				.classList.remove("selected")
			width.classList.add("selected")
			selectedWidth = parseFloat(width.dataset.width)
		})
	})

	colorFillOptions.forEach((option) => {
		option.addEventListener("click", () => {
			showNotification(`Color fill: ${option.id}`)
			document
				.querySelector("#color-fill .selected")
				.classList.remove("selected")
			option.classList.add("selected")
			fillColor = option.id === "fill" ? true : false
		})
	})
}

export function adjustSidebarWidth() {
	//compare sidebar's clientHeight (inner height of sidebar excluding scrollbars) w its scrollHeight (total height of the content including the part not visible due to overflow). If scrollHeight > clientHeight = content overflows & scrollbar is visible
	const sidebar = document.getElementById("sidebar")
	const sidebarWrapper = sidebar.querySelector(".sidebar-wrapper")
	const sidebarToggle = sidebar.querySelector("#toggle-sidebar")

	if (sidebarWrapper.scrollHeight > sidebarWrapper.clientHeight) {
		sidebar.style.width = "100px"
		sidebarWrapper.style.padding = `${15}px ${5}px`
	} else {
		sidebar.style.width = "95px" //default
		sidebarWrapper.style.padding = `${15}px ${10}px`
	}

	const sidebarWidth = parseInt(sidebar.style.width, 10)
	sidebarToggle.style.left = `${sidebarWidth}px`
	toggleSidebar()
}

//toggle sidebar
function toggleSidebar() {
	let sidebarOpen = true
	const sidebar = document.getElementById("sidebar")
	const sidebarIcon = document.getElementById("sidebar-icon")

	sidebarIcon.addEventListener("click", () => {
		if (sidebarOpen) {
			sidebar.style.left =
				parseInt(sidebar.style.width, 10) === 100 ? "-100px" : "-95px"
			sidebarIcon.style.transform = "rotate(0deg)"
			sidebarOpen = false
		} else {
			sidebar.style.left = "0"
			sidebarIcon.style.transform = "rotate(180deg)"
			sidebarOpen = true
		}
	})
}

//viebox for tool options
function showOptions(tool) {
	const viewerBox = document.querySelector("#tool-options-viewer")
	const container = viewerBox.querySelector(".container")

	let options = []
	resetOptions()

	if (tool.id === "shapes") {
		const shapeTool = document.querySelector("#tool-options #shapes")
		shapeTool.classList.add("active")

		showNotification("Showing shape options")
		options = ["square", "circle", "change_history"] //google icon names

		options.forEach((option) => {
			const ulElement = document.createElement("ul")
			const optionsList = document.createElement("li")
			const spanIcon = document.createElement("span")

			ulElement.className = "options"
			optionsList.className = "option"
			spanIcon.className = "material-symbols-outlined"
			spanIcon.id = option === "change_history" ? "triangle" : option
			spanIcon.title = option === "change_history" ? "triangle" : option
			spanIcon.innerHTML = option

			optionsList.appendChild(spanIcon)
			ulElement.appendChild(optionsList)
			container.appendChild(ulElement)

			spanIcon.addEventListener("click", () => {
				showNotification(`Selected Tool: ${spanIcon.id}`)
				document
					.querySelector("#tool-options-viewer .active-shape")
					?.classList.remove("active-shape")
				spanIcon.classList.add("active-shape")
				selectedTool = spanIcon.id
			})
		})
	}
}

//reset viewer
function resetOptions() {
	const viewerBox = document.querySelector("#tool-options-viewer")
	const container = viewerBox.querySelector(".container")
	viewerBox.style.backgroundImage = ""
	viewerBox.style.backgroundSize = ""

	while (container.firstChild) {
		container.removeChild(container.firstChild)
	}
}
