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

declare global
{
	interface Window
	{
		api: {
			fetch: <T>(channel: string, args?: unknown) => Promise<{
				ok: boolean;
				code: number;
				message: string;
				data?: T;
			}>;

			window: {
				setTitle: (title: string) => void;
				minimize: () => void;
				maximize: () => void;
				close:    () => void;

				onFocus:    (callback: RobotoSkunk.IPC.CallbackListener<boolean>) => () => void;
				onMaximize: (callback: RobotoSkunk.IPC.CallbackListener<boolean>) => () => void;
			}

		}
	}


	namespace DB {
		type User = {
			id: string;
			firstname: string;
			lastname: string;
			picture: Uint8Array;
		};

		type Address = {
			id: string;
			user_id: string;
			street: string;
			number_ext?: number;
			number_int?: number;
			neighborhood: string;
			postal_code?: number;
			city: string;
			state: string;
			country: string;
			is_active: number;
		};

		type JobTitle = {
			id: string;
			user_id: string;
			name: string;
			description?: string;
		};
	}


	namespace RobotoSkunk
	{
		namespace IPC {
			type CallbackListener<T> =  (...args: T[]) => void;
		}
	}
}

export { };
