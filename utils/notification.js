import { isDarkModeOn } from "./colors.js"

let topOffset = 5

export function createNotification() {
	const notification = document.createElement("div")
	notification.id = "notification"
	notification.style.top = `${topOffset}px`
	notification.style.display = "block"
	notification.style.padding = "1px 5px 2px 5px"
	notification.style.borderRadius = "3px"
	notification.style.color = isDarkModeOn() ? "#D3D8DB" : "#3E3E3F"
	notification.style.backgroundColor = isDarkModeOn()
		? "#cfdef133"
		: "#21232633"
	document.body.appendChild(notification)
	topOffset += 20 //increment for the next notification

	return notification
}

export function showNotification(message) {
	const notification = createNotification()
	notification.style.textTransform = "capitalize"
	notification.textContent = message

	setTimeout(() => {
		document.body.removeChild(notification)
		topOffset -= 20 //reset offset after removing notification
	}, 1000)
}
