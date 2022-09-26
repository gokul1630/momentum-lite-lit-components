import { html, LitElement } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import moment from "moment"
import defaultBackground from "./assets/background.webp"
import edit from "./assets/edit.svg"
import eye from "./assets/eye.svg"
import eyeOff from "./assets/eyeOff.svg"
import settings from "./assets/settings.svg"
import upload from "./assets/upload.svg"
import "./BackgroundImage"
import "./Form"
import "./topSites"

@customElement("momentum-lite")
export class MomentumLite extends LitElement {
	createRenderRoot() {
		return this
	}

	@property()
	sites: any[] = []

	@state()
	backgroundImage = ""

	@property()
	toggleTopSite = true

	@state()
	name = ""

	@state()
	greetMessage = ""

	@state()
	private timer = 0 as ReturnType<typeof setInterval>

	@state()
	date = moment()

	@state()
	minutes = this.date.format("m a")

	@state()
	hours = this.date.format("h")

	@state()
	isEditName = false

	protected firstUpdated() {}

	connectedCallback() {
		super.connectedCallback()

		const showTopSites = parseInt(localStorage.getItem("topSites") as string)

		if (showTopSites !== 1) {
			this.toggleTopSite = false
		}

		// @ts-ignore
		chrome.topSites
			.get()
			.then((response: any) => {
				this.sites = response
			})
			.catch((err: any) => console.log("error", err))

		this.updateGreetMessage()

		this.backgroundImage = (localStorage.getItem("backgroundImage") as string) || defaultBackground

		this.timer = setInterval(this.ticker, 1000)

		this.name = localStorage.getItem("userName") as string
	}

	ticker = () => {
		const date = moment()
		this.minutes = date.format("m a")
		this.hours = date.format("h")
		this.updateGreetMessage()
	}

	disconnectedCallback(): void {
		super.disconnectedCallback()
		clearInterval(this.timer)
	}

	updateGreetMessage() {
		const currentHour = parseInt(this.date.format("HH"))
		if (currentHour >= 3 && currentHour < 12) {
			this.greetMessage = `Good Morning `
		} else if (currentHour >= 12 && currentHour < 15) {
			this.greetMessage = `Good Afternoon `
		} else if (currentHour >= 15 && currentHour < 20) {
			this.greetMessage = `Good Evening `
		} else if (currentHour >= 20 && currentHour < 3) {
			this.greetMessage = `Good Night `
		} else {
			this.greetMessage = `Hello `
		}
	}

	onSubmitForm({ detail }: any) {
		if (detail && typeof detail === "string") {
			this.name = detail
		}
		this.isEditName = false
	}

	toggleTopSites() {
		if (this.toggleTopSite) {
			localStorage.setItem("topSites", "0")
			this.toggleTopSite = false
		} else {
			localStorage.setItem("topSites", "1")
			this.toggleTopSite = true
		}
	}

	onEditName() {
		this.isEditName = true
	}

	onPickBackgroundImage(event: any) {
		if (event.target.files) {
			const fileReader: any = new FileReader()
			fileReader.readAsDataURL(event.target.files[0])
			fileReader.onload = () => {
				const imageUri = fileReader.result.toString()
				this.backgroundImage = imageUri
				localStorage.setItem("backgroundImage", imageUri)
			}
		}
	}

	renderBackground() {
		return html` <background-image backgroundImage=${this.backgroundImage}></background-image>
			<div class="flex justify-center items-center h-screen w-screen select-none bg-black/20 relative">
				<div class="flex flex-col justify-center items-center">
					<h1 class="text-6xl lg:text-8xl font-medium text-white z-10 cursor-default select-none">
						<span class="text-7xl lg:text-9xl font-bold">${this.hours}</span>:${this.minutes}
					</h1>

					<div class="relative group">
						<h2
							class="text-center text-4xl md:text-5xl lg:text-7xl mt-5 text-white cursor-default select-none"
						>
							${this.greetMessage + this.name}.
						</h2>
					</div>
					<div
						class="transition duration-200 ease-in origin-top w-full flex justify-center ${this.toggleTopSite
							? "scale-0"
							: "scale-100"}"
					>
						<top-sites class="md:hidden" slices=${6} .sites="${this.sites}"></top-sites>
						<top-sites class="hidden md:block lg:hidden" slices=${9} .sites="${this.sites}"></top-sites>
						<top-sites class="hidden lg:block" .sites="${this.sites}"></top-sites>
					</div>
				</div>
				<button class="absolute bottom-10 right-10 group">
					<img src="${settings}" alt="settings" />

					<div
						class="bg-white absolute right-0 bottom-0 w-max rounded-md min-h-[2rem] min-w-[10rem] p-2 hidden group-hover:block"
					>
						<ul>
							<li class="flex items-center hover:bg-gray-200 hover:rounded pt-1 px-2" @click="${this.onEditName}">
								<img src="${edit}" class="w-6 h-6 mr-2" alt="edit" />
								<p class="text-base whitespace-nowrap">Edit Name</p>
							</li>
							<li class="flex items-center mt-3 hover:bg-gray-200 hover:rounded py-1 px-2" @click="${this.toggleTopSites}">
								<img src="${!this.toggleTopSite ? eyeOff : eye}" class="w-6 h-6 mr-2" alt="edit" />
								<p class="text-base whitespace-nowrap">
									${!this.toggleTopSite ? "Hide Top Sites" : "Show Top Sites"}
								</p>
							</li>
							<li class="flex items-center mt-3 hover:bg-gray-200 hover:rounded pb-1 px-2">
								<img src="${upload}" class="w-6 h-6 mr-2" alt="upload image" />
								<label htmlFor="imagePicker">
									<p class="text-base whitespace-nowrap cursor-pointer">Pick Background Image</p>
									<input
										@change="${this.onPickBackgroundImage}"
										type="file"
										accept="image/jpeg,webp,jpg,png"
										name="imagePicker"
										class="hidden"
										id="imagePicker"
									/>
								</label>
							</li>
						</ul>
					</div>
				</button>
			</div>`
	}

	renderForm() {
		return html` <background-image backgroundImage=${this.backgroundImage}></background-image>
			<div class="flex justify-center items-center h-screen w-screen select-none bg-black/20 relative">
				<ml-form @submit=${this.onSubmitForm} name=${this.name}></ml-form>
			</div>`
	}

	render() {
		return this.isEditName ? this.renderForm() : this.name ? this.renderBackground() : this.renderForm()
	}
}
