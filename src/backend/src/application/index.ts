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

import { BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';

import ipcSender from './ipc/sender';
import './ipc/listener';

import path from 'path';


class AppWindow
{
	private window: BrowserWindow;
	private app: Electron.App;
	private splash: boolean;


	constructor(app: Electron.App, splash = false)
	{
		this.app = app;
		this.splash = splash;
	}

	public async start(width: number, height: number)
	{
		await this.app.whenReady();


		this.createWindow(width, height);

		this.app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				this.app.quit();
			}
		});
	}


	public get appInstance()
	{
		return this.app;
	}

	public get windowInstance()
	{
		return this.window;
	}

	private createWindow(width: number, height: number)
	{
		this.window = new BrowserWindow({
			width,
			height,
			frame: false,
			transparent: true,
			hasShadow: true,
			webPreferences: {
				devTools: is.dev,
				preload: path.join(this.app.getAppPath(), 'src', 'backend', 'dist', 'preload.js'),
			},
			fullscreenable: false,
			minWidth: this.splash ? 100 : 854,
			minHeight: this.splash ? 100 : 480,
			alwaysOnTop: this.splash,
		});

		this.window.menuBarVisible = false;

		if (this.splash) {
			this.window.center();
			this.window.setResizable(false);
			this.window.shadow = false;
		}

		ipcSender(this.window);
	}
}

export default AppWindow;
