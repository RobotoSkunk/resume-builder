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
**/

import { Kysely, sql } from 'kysely';


export async function up(db: Kysely<unknown>): Promise<void>
{
	await sql`ALTER TABLE educations ADD COLUMN user_id REFERENCES users(id)`.execute(db);
	await sql`ALTER TABLE experiences ADD COLUMN user_id REFERENCES users(id)`.execute(db);
	await sql`ALTER TABLE courses ADD COLUMN user_id REFERENCES users(id)`.execute(db);
	await sql`ALTER TABLE achievements ADD COLUMN user_id REFERENCES users(id)`.execute(db);
	await sql`ALTER TABLE certifications ADD COLUMN user_id REFERENCES users(id)`.execute(db);
	await sql`ALTER TABLE projects ADD COLUMN user_id REFERENCES users(id)`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void>
{
	await db.schema
		.alterTable('educations')
		.dropColumn('user_id')
		.execute();

	await db.schema
		.alterTable('experiences')
		.dropColumn('user_id')
		.execute();

	await db.schema
		.alterTable('courses')
		.dropColumn('user_id')
		.execute();

	await db.schema
		.alterTable('achievements')
		.dropColumn('user_id')
		.execute();

	await db.schema
		.alterTable('certifications')
		.dropColumn('user_id')
		.execute();

	await db.schema
		.alterTable('projects')
		.dropColumn('user_id')
		.execute();
}
