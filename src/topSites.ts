import { html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement("top-sites")
export class TopSites extends LitElement {
	createRenderRoot() {
		return this
	}

	@property()
	slices = 10

	@property()
	sites: any[] = []

	render() {
		return html`
			<ul
				class="list-none max-w-2xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[auto,auto,auto,auto,auto] gap-x-10 relative"
			>
				${this.sites?.slice(0, this.slices).map(
					({ title, url }) => html`
						<li class="mt-10">
							<a class="text-white flex flex-col items-center" href="${url}">
								<div
									class="bg-slate-300 max-w-[3.5rem] max-h-[3.5rem] w-full h-full p-5 rounded-full flex justify-center items-center text-gray-600 capitalize text-2xl"
								>
									${title.match(/[A-Za-z]/)}
								</div>
								<h3 class="max-w-[6rem] mt-2 text-lg text-ellipsis overflow-hidden whitespace-nowrap">
									${title}
								</h3>
							</a>
						</li>
					`
				)}
			</ul>
		`
	}
}
