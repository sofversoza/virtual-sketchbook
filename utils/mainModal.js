import { showNotification } from "./notification.js"

export function openMainModal(action, ctx, canvas) {
	const mainModal = document.getElementById("main-modal")
	const modalTitle = mainModal.querySelector("#title")
	const modalPrompt = mainModal.querySelector("#prompt")
	const modalExitBtn = mainModal.querySelector("#exit-icon")
	const modalGoBtn = mainModal.querySelector("#go")
	const modalCancelBtn = mainModal.querySelector("#cancel")
	let canvasData //store canvas img data before clearing it

	modalExitBtn.addEventListener("click", () => {
		mainModal.style.display = "none"
	})

	modalCancelBtn.addEventListener("click", () => {
		mainModal.style.display = "none"
	})

	modalGoBtn.addEventListener("click", () => {
		if (action === "reset") {
			showNotification("Reset canvas")
			ctx.clearRect(0, 0, canvas.width, canvas.height)
		} else if (action === "download") {
			showNotification("Downloaded canvas as image")
			const link = document.createElement("a")
			link.download = `${Date.now()}.jpg` //current date as link download value
			link.href = canvasData //canvas.toDataURL()
			link.click() //simulate the click on link to trigger download
		}
		mainModal.style.display = "none"
	})

	switch (action) {
		case "reset":
			modalTitle.textContent = "Clear Canvas"
			modalPrompt.textContent =
				"Are you sure you want to reset the whole canvas? This can't be undone"
			break
		case "download":
			modalTitle.textContent = "Download"
			modalPrompt.textContent =
				"Save canvas as it is and download as image? (.jpg)"
			canvasData = canvas.toDataURL() //toDataURL:data url of img. canvasData=href
			break
	}

	mainModal.style.display = "block"
}
