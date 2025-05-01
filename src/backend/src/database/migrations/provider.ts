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

import { Kysely, Migration, MigrationProvider } from 'kysely';


export interface ContextMigration<T>
{
	up(db: Kysely<unknown>, ctx: T): Promise<void>;
	down?(db: Kysely<unknown>, ctx: T): Promise<void>;
}


export class ContextMigrationProvider<T> implements MigrationProvider
{
	private migrations: Record<string, ContextMigration<T>>;
	private context: T;

	constructor(migrations: Record<string, ContextMigration<T>>, context: T)
	{
		this.migrations = migrations;
		this.context = context;
	}


	public async getMigrations(): Promise<Record<string, Migration>>
	{
		const contextMigrations: Record<string, Migration> = {};

		for (const [ name, migration ] of Object.entries(this.migrations)) {
			contextMigrations[name] = {
				up: async (db) => await migration.up(db, this.context),
				down: async (db) => await migration.down(db, this.context),
			};
		}

		return contextMigrations;
	}
}
