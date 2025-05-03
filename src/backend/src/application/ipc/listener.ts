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

import { BrowserWindow, ipcMain, nativeTheme } from 'electron';

import './api';


ipcMain.on('window/action', async (_: Electron.IpcMainEvent, index: number) =>
{
	const window = BrowserWindow.getFocusedWindow();

	if (window) {
		switch (index) {
			case 0:
				window.minimize();
				break;

			case 1:
				if (window.isMaximized()) {
					window.restore();
				} else {
					window.maximize();
				}
				break;

			case 2:
				window.close();
				break;
		}
	}
});

ipcMain.on('window/set-title', async (_: Electron.IpcMainEvent, title: string) =>
{
	const window = BrowserWindow.getFocusedWindow();

	window?.setTitle(title);
});


ipcMain.on('window/dark-mode', async (_: Electron.IpcMainEvent, darkMode: boolean) =>
{
	nativeTheme.themeSource = darkMode ? 'dark' : 'light';
});
