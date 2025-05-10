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

import { Kysely } from 'kysely';


export async function up(db: Kysely<unknown>): Promise<void>
{
	await db.schema
		.alterTable('languages')
		.dropColumn('cefr_level')
		.execute();

	await db.schema
		.alterTable('languages')
		.addColumn('reading_cefr_level', 'integer', c => c.notNull())
		.execute();

	await db.schema
		.alterTable('languages')
		.addColumn('writting_cefr_level', 'integer', c => c.notNull())
		.execute();

	await db.schema
		.alterTable('languages')
		.addColumn('listening_cefr_level', 'integer', c => c.notNull())
		.execute();

	await db.schema
		.alterTable('languages')
		.addColumn('speaking_cefr_level', 'integer', c => c.notNull())
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void>
{
	await db.schema
		.alterTable('languages')
		.addColumn('cefr_level', 'integer', c => c.notNull())
		.execute();

	await db.schema
		.alterTable('languages')
		.dropColumn('reading_cefr_level')
		.execute();

	await db.schema
		.alterTable('languages')
		.dropColumn('writting_cefr_level')
		.execute();

	await db.schema
		.alterTable('languages')
		.dropColumn('listening_cefr_level')
		.execute();

	await db.schema
		.alterTable('languages')
		.dropColumn('speaking_cefr_level')
		.execute();
}
