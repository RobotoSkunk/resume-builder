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
import { DB_JobTitles } from '../../../../../../database/tables/job-titles';

type Body = Omit<Omit<DB_JobTitles, 'id'>, 'user_id'>;


router.add<Body>('/user/job-title/:title_id/update', async (req) =>
{
	const db = app.database.conn;

	try {
		await db
			.updateTable('job_titles')
			.set(req.body)
			.where('id', '=', req.params.title_id)
			.execute();

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
