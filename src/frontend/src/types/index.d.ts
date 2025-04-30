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

declare global
{
	function Velocity (element: HTMLElement | NodeListOf<HTMLElement>,
							properties: { [key: string]: string; },
							options: object | number): void;


	interface Window
	{
		api: {
			invoke:         (channel: RobotoSkunk.IPC.Sender, data: any) => Promise<any>;
			send:           (channel: RobotoSkunk.IPC.Sender, data: any) => void;
			on:             (channel: string, callback: RobotoSkunk.IPC.CallbackListener<any, any>) => void;
			once:           (channel: string, callback: RobotoSkunk.IPC.CallbackListener<any, any>) => void;
			removeListener: (channel: string, callback: RobotoSkunk.IPC.CallbackListener<any, any>) => void;

			actions: {
				setTitle: (title: string) => void;
				minimize: () => void;
				maximize: () => void;
				close:    () => void;
			}

			events: {
				onWindowFocus:    (callback: RobotoSkunk.IPC.CallbackListener<any, boolean>) => void;
				onWindowMaximize: (callback: RobotoSkunk.IPC.CallbackListener<any, boolean>) => void;

				removeWindowFocus:    (callback: RobotoSkunk.IPC.CallbackListener<any, boolean>) => void;
				removeWindowMaximize: (callback: RobotoSkunk.IPC.CallbackListener<any, boolean>) => void;
			}
		}
	}


	namespace RobotoSkunk
	{
		type WindowMessage = WindowMessageNotify | WindowMessageSetBackUrl | WindowMessageResetBackUrl;

		interface WindowMessageNotify
		{
			type: 'notify';
			message: string;
			notificationType?: 'success' | 'info' | 'warning' | 'danger';
		}

		interface WindowMessageSetBackUrl
		{
			type: 'set-back-url';
			url: string;
		}

		interface WindowMessageResetBackUrl
		{
			type: 'reset-back-url';
		}

		namespace IPC {
			type CallbackListener<TEvent, TArg> =  (event: TEvent, ...args: TArg[]) => void;
		}
	}
}

export { };
