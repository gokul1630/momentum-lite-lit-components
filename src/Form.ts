import { html, LitElement } from "lit"
import { customElement, property, query } from "lit/decorators.js"

@customElement("ml-form")
export class Form extends LitElement {
	createRenderRoot() {
		return this
	}

	@property()
	name = ""

	@property({ type: Boolean })
	inputError = false

	@query("input")
	inputValue!: HTMLInputElement

	onSubmit() {
		const name = this.inputValue.value
		localStorage.setItem("userName", name)
		const customEvent = new CustomEvent("submit", { detail: name })
		if (name) {
			this.dispatchEvent(customEvent)
		} else {
			this.inputError = true
		}
	}

	onCancel(e: any) {
		this.dispatchEvent(new CustomEvent("submit", e))
	}

	render() {
		return html`<div class="flex flex-col items-center z-10 bg-black/50 p-10 rounded-xl">
			<label for="name">
				<span class="hidden absolute max-h-0 max-w-0 overflow-hidden">Hidden Label</span>
			</label>
			<input
				autofocus
				autocomplete="off"
				placeholder="Enter Your Name"
				class="border-b max-w-md focus:outline-none text-center text-2xl lg:text-4xl bg-transparent placeholder:text-gray-50 text-white ${this
					.inputError
					? "border-red-500"
					: "border-green-500"}"
				}
				type="text"
				name="userName"
				id="name"
			/>
			<p class="text-red-500 text-lg ${this.inputError ? "block" : "hidden"}">Please Enter Your Name</p>
			<div class="flex mt-5">
				<button
					@click=${this.onCancel}
					class="bg-gray-400 min-w-[100px] p-2 w-full rounded text-black text-base lg:text-lg mr-3"
				>
					Cancel
				</button>

				<button
					@click=${this.onSubmit}
					="submit"
					class="bg-green-400 min-w-[100px] p-2 w-full rounded text-black text-base lg:text-lg"
				>
					Submit
				</button>
			</div>
		</div>`
	}
}
