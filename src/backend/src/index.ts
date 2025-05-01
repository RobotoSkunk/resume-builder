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

import 'source-map-support';

import { is } from '@electron-toolkit/utils';
import { startServer } from 'next/dist/server/lib/start-server';
import { getPort } from 'get-port-please';

import { app } from 'electron';

import path from 'path';
import AppWindow from './application';
import Database from './database/connection';


// const splash = new AppWindow(app, true);
const application = new AppWindow(app);


function wait(ms: number)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}


async function loadFrontend(window: AppWindow)
{
	if (is.dev) {
		const endpoint = 'http://localhost:3000';

		const interval = async () => {
			console.log('Checking if Next.js is alive...');

			const retry = async () => {
				await wait(500);
				interval();
			};

			try {
				await fetch(endpoint);

				window.windowInstance.loadURL(endpoint);
			} catch (e) {
				await retry();
			}
		};

		interval();
	} else {
		try {
			const port = await startNextJSServer();
			console.log('Next.js server started on port: ', port);

			window.windowInstance.loadURL(`http://localhost:${port}`);
		} catch (e) {
			console.error(e);
		}
	}

	return window;
}

async function startNextJSServer()
{
	try {
		const port = await getPort({ portRange: [ 30011, 50000 ] });
		const webDir = path.join(app.getAppPath(), 'app');

		await startServer({
			dir: webDir,
			isDev: false,
			hostname: 'localhost',
			port,
			customServer: true,
			allowRetry: false,
			keepAliveTimeout: 5000,
			minimalMode: true,
		});

		return port;
	} catch (e) {
		console.error('Error starting Next.js server: ', e);
		throw e;
	}
}


(async () =>
{
	app.database = new Database();

	try {
		await app.database.tryMigrateToLatest();

		await app.database.testConnection();
	} catch (e) {
		console.error(e);
		process.exit(-2);
	}


	app.setName('Resume Builder');
	app.commandLine.appendSwitch('lang', 'es');

	await application.start(1270, 720);
	await loadFrontend(application);
})();
