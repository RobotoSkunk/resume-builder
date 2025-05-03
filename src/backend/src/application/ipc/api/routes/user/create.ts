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
import { loadImage, createCanvas } from '@napi-rs/canvas';

import crypto from 'crypto';

import router from '../../router';

import type { DB_Users } from '../../../../../database/tables/users';
import { DB_Addresses } from '../../../../../database/tables/addresses';


type Body =
	Omit<Omit<DB_Users, 'picture'>, 'id'> &
	Omit<Omit<DB_Addresses, 'is_active'>, 'id'> &
	{
		picture: 'string',
	};


router.add<Body>('/user/create', async (req) =>
{
	const db = app.database.conn;
	const data = req.body;


	var pictureBuffer: Buffer;

	{
		const base64 = data.picture.split(',')[1];
		const buffer = Buffer.from(base64, 'base64');

		const image = await loadImage(buffer);
		const ratio = image.height / image.width;

		if (image.width < 512 || image.height < 512) {
			return {
				code: 1,
				message: 'La imagen es demasiado pequeña, usa una imagen de más de 512 píxeles de alto y ancho.'
			}
		}


		const canvas = createCanvas(512, 512);
		const context = canvas.getContext('2d');

		if (image.width > image.height) {
			const newWidth = 512 / ratio;

			context.drawImage(image, -(newWidth - 512) / 2, 0, newWidth, 512);

		} else if (image.width < image.height) {
			const newHeight = ratio * 512;

			context.drawImage(image, 0, -(newHeight - 512) / 2, 512, newHeight);

		} else {
			context.drawImage(image, 0, 0, 512, 512);
		}

		pictureBuffer = await canvas.encode('png');
	}


	try {
		const [ user ] = await db
			.insertInto('users')
			.values({
				id: crypto.randomUUID(),
				firstname: data.firstname,
				lastname: data.lastname,
				picture: pictureBuffer,
			})
			.returning('id')
			.execute();

		await db
			.insertInto('addresses')
			.values({
				id: crypto.randomUUID(),
				user_id: user.id,
				street: data.street,
				number_ext: data.number_ext,
				number_int: data.number_int,
				neighborhood: data.neighborhood,
				postal_code: data.postal_code,
				city: data.city,
				state: data.state,
				country: data.country,
			})
			.execute();
	} catch (e) {
		console.error(e);

		return { code: -2, message: 'Algo salió mal...' };
	}

	return { code: 0, message: 'ok' };
});
