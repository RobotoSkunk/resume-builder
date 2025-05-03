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

import { app } from 'electron';
import { loadImage } from '@napi-rs/canvas';

import router from '../../router';


router.add('/user/get-info', async (req) =>
{
	const db = app.database.conn;

	const [ userData ] = await db
		.selectFrom('users')
		.selectAll()
		.limit(1)
		.execute();

	if (userData) {
		const picture = await loadImage(userData.picture);
		const pictureBuffer = Buffer.from(picture.src);

		return {
			code: 0,
			message: 'ok',
			data: {
				firstname: userData.firstname,
				lastname: userData.lastname,
				picture: `data:image/png;base64,${pictureBuffer.toString('base64')}`,
			},
		};
	}

	return {
		code: 1,
		message: '',
	}
});
