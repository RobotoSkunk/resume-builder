
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

import SQLite from 'better-sqlite3';
import { Kysely, Migrator, SqliteDialect, sql } from 'kysely';

import * as migrations from './migrations';
import { ContextMigrationProvider } from './migrations/provider';

import DatabaseSchema, { DatabaseSchemaType } from './schema';

import fs from 'fs';
import path from 'path';


class Database
{
	/**
	 * Kysely connection
	 */
	private db: DatabaseSchema;

	/**
	 * Kysely migrator
	 */
	private migrator: Migrator;

	/**
	 * Storage directory
	 */
	private dataDirectory: string;


	/**
	 * Create a new database connection pool based on environment variables
	 */
	constructor()
	{
		const programName = 'resume-builder';

		switch (process.platform) {
			case 'win32':
				this.dataDirectory = path.join(process.env.APPDATA, programName);
				break;

			case 'linux':
				this.dataDirectory = path.join(process.env.HOME, '.local', 'share', programName);
				break;

			case 'darwin':
				this.dataDirectory = path.join(process.env.HOME, 'Library', 'Preferences', programName);
				break;

			default:
				this.dataDirectory = path.join(process.env.HOME, programName);
				break;
		}


		if (!fs.existsSync(this.dataDirectory)) {
			fs.mkdirSync(this.dataDirectory, { recursive: true });
		}

		const dialect = new SqliteDialect({
			database: new SQLite(
				path.join(this.dataDirectory, 'appdata')
			),
		});

		this.db = new Kysely<DatabaseSchemaType>({ dialect });

		this.migrator = new Migrator({
			db: this.db,
			provider: new ContextMigrationProvider(migrations, 'pg')
		})
	}

	/**
	 * Test the database connection.
	 */
	public async testConnection(): Promise<void>
	{
		try {
			sql<string>`SELECT NOW()`;

			console.log('Connected to database.');

		} catch (error) {
			console.error('An error ocurred while trying to test database connection.');
			throw error;
		}
	}


	/**
	 * Just a wrapper of migrateTo but with try/catch compatibility.
	 */
	public async tryMigrateTo(migration: string)
	{
		const { error, results } = await this.migrator.migrateTo(migration);
		
		if (error) {
			throw error;
		}

		if (!results) {
			throw new Error('An unknown error ocurred while migrating.');
		}

		return results;
	}


	/**
	 * Just a wrapper of migrateToLatest but with try/catch compatibility.
	 */
	public async tryMigrateToLatest()
	{
		const { error, results } = await this.migrator.migrateToLatest();
		
		if (error) {
			throw error;
		}

		if (!results) {
			throw new Error('An unknown error ocurred while migrating.');
		}

		return results;
	}

	public get conn()
	{
		return this.db;
	}
}


export default Database;
