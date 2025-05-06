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

import { app } from 'electron';

import router from '../../../router';


router.add('/user/:id/address/:address_id/set-active/:trigger', async (req) =>
{
	const db = app.database.conn;

	try {
		await db
			.updateTable('addresses')
			.set({
				is_active: 0,
			})
			.where('user_id', '=', req.params.id)
			.execute();

		if (req.params.trigger === '1') {
			await db
				.updateTable('addresses')
				.set({
					is_active: 1,
				})
				.where('id', '=', req.params.address_id)
				.execute();
		}

		return {
			code: 0,
			message: '',
		}
	} catch (e) {
		console.error(e);

		return {
			code: -2,
			message: 'Algo salió mal...',
		}
	}
});
