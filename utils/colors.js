import { showNotification } from "./notification.js"

//for eraser tool
export function getBodyColor() {
	const computedStyle = getComputedStyle(document.body)
	let bodyColor = computedStyle.backgroundColor
	return bodyColor
}

let darkModeOn = true
export function isDarkModeOn() {
	return darkModeOn
}

let selectedColor = "#090909"
export function getSelectedColor() {
	return selectedColor
}

export function populateColorOptions() {
	const colorPalette1 = document.querySelector(".col-1 .colors")
	const colorPalette2 = document.querySelector(".col-2 .colors")
	const colorPalette3 = document.querySelector(".col-3 .colors")
	const colorPickerListItem = document.getElementById("rainbow")
	const colorPickerInput = document.getElementById("s-color-picker")
	const colorViewer = document.querySelector("#color-viewer")

	const initColorPicker = () => {
		colorPickerListItem.addEventListener("click", () => {
			document.querySelector(".colors .selected").classList.remove("selected")
			colorPickerListItem.classList.add("selected")
			selectedColor = colorPickerListItem.dataset.color
			colorViewer.style.backgroundColor = selectedColor
		})

		colorPickerInput.addEventListener("change", () => {
			//set picked color value from color picker as list item bgc
			colorPickerInput.parentElement.style.background = colorPickerInput.value
			colorPickerInput.parentElement.dataset.color = colorPickerInput.value
			colorPickerInput.parentElement.click()
			showNotification("Selected color changed")
		})
	}
	initColorPicker()

	//create <li> item for each color in the palettes
	const createColorListItem = (color, palette) => {
		const listItem = document.createElement("li")
		listItem.style.backgroundColor = color
		listItem.className = "color"
		listItem.dataset.color = color //set the color as a data attribute

		if (listItem.dataset.color === "#090909") {
			listItem.classList.add("selected") //set black as default
		}

		listItem.addEventListener("click", () => {
			showNotification("Selected color changed")
			document.querySelector(".colors .selected")?.classList.remove("selected")
			document.querySelector(".colors .selected")?.classList.remove("black-dot")
			listItem.classList.add("selected")

			if (listItem.dataset.color === "#FFFFFF") {
				listItem.classList.add("black-dot")
			}

			selectedColor = color
			colorViewer.style.backgroundColor = selectedColor
		})

		palette.appendChild(listItem)
	}

	//populate color palettes
	palettes.firstColumn.forEach((color) =>
		createColorListItem(color, colorPalette1)
	)
	palettes.secondColumn.forEach((color) =>
		createColorListItem(color, colorPalette2)
	)
	palettes.thirdColumn.forEach((color) =>
		createColorListItem(color, colorPalette3)
	)
}

function darkAndLightMode() {
	const darkModeBtns = document.querySelectorAll(".dark-mode button")

	darkModeBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			btn.id === "on" ? (darkModeOn = true) : (darkModeOn = false)
			showNotification(`Dark mode ${btn.id}`)
			document.querySelector(".dark-mode .active").classList.remove("active")
			btn.classList.add("active")
			document.body.style.backgroundColor =
				btn.id === "off" ? "#D3D8DB" : "#3E3E3F"

			isDarkModeOn()
			getBodyColor()
		})
	})
}
darkAndLightMode()

const palettes = {
	firstColumn: [
		"#831A0C",
		"#2C4F9A",
		"#065b26",
		"#ECEA7A",
		"#b8591d",
		"#983572",
		"#603E83",
	],
	secondColumn: [
		"#090909",
		"#954545",
		"#617BB3",
		"#4A8560",
		"#F1EF9B",
		"#D37D47",
		"#C171A3",
		"#82669F",
	],
	thirdColumn: [
		"#FFFFFF",
		"#C57D7D",
		"#7587BC",
		"#A5C2B0",
		"#EFEDB2",
		"#E4AE8C",
		"#DEB0CC",
		"#A692BA",
	],
}
