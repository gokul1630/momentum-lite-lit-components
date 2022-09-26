import { html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement("background-image")
export default class BackgroundImage extends LitElement {
	createRenderRoot() {
		return this
	}

	@property()
	backgroundImage = ""

	render() {
		return html`<img
			src="${this.backgroundImage}"
			alt="background image"
			class="absolute w-screen h-screen inset-0 overflow-hidden object-cover -z-10"
		/>`
	}
}
