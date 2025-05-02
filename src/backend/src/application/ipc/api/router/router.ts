/*
 * Resume Builder, un programa para generar currículums vitae.
 * Copyright (C) 2025  Edgar Lima (RobotoSkunk)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { RSRouterNode, RSRoutingHandler } from './node';


export interface RSRouterResponse
{
	handler: RSRoutingHandler;
	params: { [key: string]: string };
}


export class RSRouter
{
	private root: RSRouterNode = new RSRouterNode('/');


	public add(path: string, handler: RSRoutingHandler): void
	{
		if (typeof path !== 'string') {
			throw new TypeError('The path must be a string.');
		}

		if (path === '/') {
			if (this.root.handler) {
				throw new Error(`Cannot create route '/' because a route already exists in the same location.`);
			}

			this.root.handler = handler;
			return;
		}


		if (path === '' || !path.startsWith('/')) {
			throw new Error(`Invalid route: '${path}'. The path must start with a slash.`);
		}


		const staticParts = path.split(/:.+?(?=\/|$)/);
		const dynamicParts = path.match(/:.+?(?=\/|$)/g);


		if (staticParts[staticParts.length - 1] === '') {
			staticParts.pop();
		}



		var pointer = this.root;

		for (var i = 0, j = 0; i < staticParts.length; i++) {
			var part = staticParts[i];

			if (part === '') {
				continue;
			}


			// Static parts
			if (part !== '/') {
				if (part.startsWith('/')) {
					part = part.slice(1);
				}

				if (part.endsWith('/')) {
					part = part.slice(0, -1);
				}


				const parts = part.split('/');

				for (const part of parts) {
					if (part === '') {
						throw new Error(`Invalid route: '${path}'. Empty static part.`);
					}


					if (!pointer.children.has(part)) {
						pointer.children.set(part, new RSRouterNode(part));
					}
		
					pointer = pointer.children.get(part)!;
				}
			}


			// Dynamic parts
			if (dynamicParts && j < dynamicParts.length) {
				const dynamicPart = dynamicParts[j++].slice(1);


				if (!pointer.dynamicChild) {
					pointer.dynamicChild = new RSRouterNode(dynamicPart, true);

				} else if (pointer.dynamicChild.name !== dynamicPart) {
					throw new Error(`Cannot create route '${path}' with parameter ':${dynamicPart}' because a route ` +
									`already exists with a different parameter name in the same location.`)
				}

				pointer = pointer.dynamicChild;
			}


			if (i < staticParts.length - 1) {
				continue;
			}


			if (!pointer.handler) {
				pointer.handler = handler;

			} else {
				throw new Error(`Cannot create route '${path}' because a route already exists in the same location.`);
			}
		}
	}

	public get(path: string): RSRouterResponse | undefined
	{
		if (typeof path !== 'string') {
			throw new TypeError('The path must be a string.');
		}

		if (path === '/') {
			if (!this.root.handler) {
				return undefined;
			}

			return {
				handler: this.root.handler,
				params: {}
			};
		}


		if (path === '' || !path.startsWith('/')) {
			throw new Error(`Invalid route: '${path}'. The path must start with a slash.`);
		}


		path = path.slice(1);

		if (path.endsWith('/')) {
			path = path.slice(0, -1);
		}


		const parts = path.split('/');

		var pointer = this.root;
		const params: { [key: string]: string } = {};

		for (const part of parts) {
			if (part === '') {
				continue;
			}


			if (pointer.children.has(part)) {
				pointer = pointer.children.get(part)!;

			} else if (pointer.dynamicChild) {
				pointer = pointer.dynamicChild;
				params[pointer.name] = part;

			} else {
				return undefined;
			}
		}


		if (!pointer.handler) {
			return undefined;
		}

		return {
			handler: pointer.handler,
			params: params
		};
	}
}
