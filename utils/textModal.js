import Text from "../element/elements/Text.js"
const textModal = document.getElementById("textModal")
const textArea = document.getElementById("text-area")
const fontNameSelect = document.getElementById("font-name")
const fontSizeSelect = document.getElementById("font-size")

let fontList = [
	"Arial",
	"Courier",
	"Garamond",
	"Georgia",
	"Helvetica",
	"Times New Roman",
	"Verdana",
	"cursive",
]

let currentStyle = {
	font: "Arial",
	fontSize: 20,
	fontWeight: "normal",
	fontStyle: "normal",
	textDecoration: "none",
	color: "",
}

//passed callback bc async bc used blur event
export function showTextModal(getXYandID, ctx, callback) {
	const { x, y, color } = getXYandID()
	currentStyle.color = color

	textModal.style.left = `${x}px`
	textModal.style.top = `${y}px`
	textModal.style.display = "block"
	textModal.tabIndex = 1 //make modal focusable
	textArea.style.color = color

	setTimeout(() => textArea.focus(), 0)

	textModal.addEventListener(
		"blur",
		(e) => {
			if (!e.relatedTarget || !textModal.contains(e.relatedTarget)) {
				handleBlur(getXYandID, ctx, callback) //clicked outside the modal
				currentStyle.color = color
				textArea.style.color = currentStyle.color
			}
		},
		true //ensure the event is captured as it propagates up
	)
}

export function hideTextModal() {
	currentStyle = {
		font: "Arial",
		fontSize: 20,
		fontWeight: "normal",
		fontStyle: "normal",
		color: "",
	}
	textArea.value = ""
	textModal.style.display = "none"
	fontNameSelect.value = currentStyle.font
	fontSizeSelect.value = currentStyle.fontSize
	textModal.removeEventListener("blur", handleBlur)
	textModal.querySelector(".active-style")?.classList.remove("active-style")
	updateTextAreaStyle()
}

function handleBlur(getXYandID, ctx, callback) {
	const { x, y, id } = getXYandID()
	const text = textArea.value

	if (!text) return

	ctx.font = `${currentStyle.fontWeight} ${currentStyle.fontStyle} ${currentStyle.fontSize}px ${currentStyle.font}`
	const textWidth = ctx.measureText(text).width
	const dummyDiv = document.createElement("div") //hidden div to measure text's height
	dummyDiv.style.position = "absolute"
	dummyDiv.style.visibility = "hidden"
	dummyDiv.style.font = ctx.font
	dummyDiv.style.whiteSpace = "nowrap"
	dummyDiv.textContent = text
	document.body.appendChild(dummyDiv)
	const textHeight = dummyDiv.offsetHeight //set text's height to div's height
	document.body.removeChild(dummyDiv)

	const element = new Text(
		id,
		x,
		y,
		text,
		currentStyle.color,
		currentStyle.fontSize,
		currentStyle.font,
		currentStyle.fontStyle,
		currentStyle.textDecoration,
		currentStyle.fontWeight,
		textWidth,
		textHeight
	)

	element.end = { x: x + textWidth, y: y + textHeight } //update end points
	callback(element)
	hideTextModal()
}

//listeners for style btns (bold, italic, underline)
const updateStyle = (styleProp, activeValue, inactiveValue, buttonID) => {
	const styleBtn = document.getElementById(buttonID)

	currentStyle[styleProp] =
		currentStyle[styleProp] === activeValue ? inactiveValue : activeValue

	if (currentStyle[styleProp] === activeValue) {
		styleBtn.classList.add("active-style")
	} else {
		styleBtn.classList.remove("active-style")
	}

	if (styleProp === "textDecoration") {
		textArea.style.textDecoration =
			currentStyle[styleProp] === activeValue ? activeValue : "none"
	}

	updateTextAreaStyle()
}

//update text in textArea in real-time for immediate visual feedback
const updateTextAreaStyle = () => {
	textArea.focus()
	textArea.style.fontFamily = currentStyle.font
	textArea.style.fontSize = `${currentStyle.fontSize}px`
	textArea.style.fontWeight = currentStyle.fontWeight
	textArea.style.fontStyle = currentStyle.fontStyle
	textArea.style.color = currentStyle.color
}

function initializer() {
	const boldBtn = document.getElementById("bold")
	const italicBtn = document.getElementById("italic")
	const underlineBtn = document.getElementById("underline")

	fontNameSelect.innerHTML = "" //clear existing options
	fontSizeSelect.innerHTML = ""

	fontList.forEach((font) => {
		let option = document.createElement("option")
		option.value = font
		option.textContent = font
		fontNameSelect.appendChild(option)
	})

	//fontSize from 10-40
	for (let i = 10; i <= 40; i++) {
		let option = document.createElement("option")
		option.value = i
		option.textContent = i
		if (i === currentStyle.fontSize) option.selected = true //set default value
		fontSizeSelect.appendChild(option)
	}

	fontNameSelect.addEventListener("change", (e) => {
		currentStyle.font = e.target.value
		updateTextAreaStyle()
	})

	fontSizeSelect.addEventListener("change", (e) => {
		currentStyle.fontSize = e.target.value
		updateTextAreaStyle()
	})

	boldBtn.addEventListener("click", () => {
		updateStyle("fontWeight", "bold", "normal", "bold")
	})
	italicBtn.addEventListener("click", () =>
		updateStyle("fontStyle", "italic", "normal", "italic")
	)
	underlineBtn.addEventListener("click", () =>
		updateStyle("textDecoration", "underline", "none", "underline")
	)

	updateTextAreaStyle() //init textArea w the default style
}
initializer()
