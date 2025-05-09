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

import { ipcMain } from 'electron';
import { is } from '@electron-toolkit/utils';

import router from './router';
import RSRequest from './router/request';

import './routes';


ipcMain.on('api/fetch', async (event: Electron.IpcMainEvent, endpoint: string, ...args: unknown[]) =>
{
	const route = router.get(endpoint);

	if (route) {
		const req = new RSRequest(args[0]);
		req.setParams(route.params);

		const response = await route.handler(req);

		if (is.dev) {
			console.info('Fetch: ', endpoint, ' | Code: ', response.code);
		}

		event.reply('api/fetch', response);
		return;
	}

	if (is.dev) {
		console.info('Fetch: ', endpoint, ' | Not Found');
	}

	event.reply('api/fetch', { code: -1, message: 'Route not found' });
});
