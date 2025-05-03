/**
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
**/

import RSRequest from './request';


export type RSRoutingHandler<TBody> = (req: Omit<RSRequest<TBody>, 'setParams'>) => Promise<{
	code: number,
	message: string,
	data?: unknown,
}>;

export class RSRouterNode
{
	public name: string;
	public isDynamic: boolean;

	public handler?: RSRoutingHandler<unknown>;
	public children: Map<string, RSRouterNode> = new Map();
	public dynamicChild?: RSRouterNode;


	public constructor(name: string, isDynamic: boolean = false)
	{
		this.name = name;
		this.isDynamic = isDynamic;
	}
}
