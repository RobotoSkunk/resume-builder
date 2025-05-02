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

import { contextBridge, ipcRenderer } from 'electron';

type CallbackListenerBoolean = RobotoSkunk.IPC.CallbackListener<number>;


function callbackHandler<T>(channel: string, callback: RobotoSkunk.IPC.CallbackListener<T>)
{
	const subscription = (_: Electron.IpcRendererEvent, ...args: T[]) => callback(...args);

	ipcRenderer.on(channel, subscription);

	return () =>
	{
		ipcRenderer.removeListener(channel, subscription);
	};
}


contextBridge.exposeInMainWorld(
	'api', {
		fetch: <T, TArgs>(channel: string, ...args: TArgs[]): Promise<T[]> =>
		{
			return new Promise((resolve, reject) =>
			{
				const listener = (_: Electron.IpcRendererEvent, ...args: T[]) =>
				{
					try {
						resolve(args);

					} catch (e) {
						reject(e);

					} finally {
						ipcRenderer.removeListener(channel, listener);
					}
				};

				ipcRenderer.on(`api/${channel}`, listener);
				ipcRenderer.send(`api/${channel}`, args);
			});
		},

		window: {
			setTitle: (title: string) => ipcRenderer.send('window/set-title', title),
			minimize: () => ipcRenderer.send('window/action', 0),
			maximize: () => ipcRenderer.send('window/action', 1),
			close:    () => ipcRenderer.send('window/action', 2),

			onFocus:    (callback: CallbackListenerBoolean) => callbackHandler('window/focus', callback),
			onMaximize: (callback: CallbackListenerBoolean) => callbackHandler('window/maximize', callback),
		},
	}
);
