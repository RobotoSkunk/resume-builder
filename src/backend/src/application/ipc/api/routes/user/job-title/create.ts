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

import crypto from 'crypto';

type Body = Omit<DB_JobTitles, 'id'>;


router.add<Body>('/user/:id/job-title/create', async (req) =>
{
	const db = app.database.conn;

	try {
		await db
			.insertInto('job_titles')
			.values({
				id: crypto.randomUUID(),
				...req.body,
			})
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
