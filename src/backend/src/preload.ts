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

type CallbackListener        = RobotoSkunk.IPC.CallbackListener<any, any>;
type CallbackListenerBoolean = RobotoSkunk.IPC.CallbackListener<any, number>;


contextBridge.exposeInMainWorld(
	'api', {
		invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
		send: (channel: string, data: any) => ipcRenderer.send(channel, data),
		on: (channel: string, callback: CallbackListener) => ipcRenderer.on(channel, callback),
		once: (channel: string, callback: CallbackListener) => ipcRenderer.once(channel, callback),
		removeListener: (channel: string, callback: CallbackListener) => ipcRenderer.removeListener(channel, callback),

		actions: {
			setTitle: (title: string) => ipcRenderer.send('window/set-title', title),
			minimize: () => ipcRenderer.send('window/action', 0),
			maximize: () => ipcRenderer.send('window/action', 1),
			close:    () => ipcRenderer.send('window/action', 2),
		},

		events: {
			onWindowFocus:    (callback: CallbackListenerBoolean) => ipcRenderer.on('window/focus',    callback),
			onWindowMaximize: (callback: CallbackListenerBoolean) => ipcRenderer.on('window/maximize', callback),

			removeWindowFocus:    (callback: CallbackListenerBoolean) => ipcRenderer.removeListener('window/focus',    callback),
			removeWindowMaximize: (callback: CallbackListenerBoolean) => ipcRenderer.removeListener('window/maximize', callback),
		},
	}
);
