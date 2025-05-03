#!/usr/bin/env ts-node
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

import fs from 'fs/promises';
import path from 'path';


// The code here is based from the atproto package developers code, their job is amazing <3
// https://github.com/bluesky-social/atproto/blob/main/packages/bsky/bin/migration-create.ts


const now = new Date();

const template = `/*
 * Resume Builder, un programa para generar currículums vitae.
 * Copyright (C) ${now.getFullYear()}  Edgar Lima (RobotoSkunk)
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
	// Migration code
}

export async function down(db: Kysely<unknown>): Promise<void>
{
	// Migration code
}
`;


(async () =>
{
	const name = process.argv[2];

	if (!name || !name.match(/^[a-z0-9-]+$/)) {
		console.error('Must pass a migration name with just lowercase digits, numbers and dashes.');
		process.exit(1);
	}

	const prefix = now.toISOString().replace(/[^a-z0-9]/gi, ''); // Added .replace for Windows compatibility :)

	const filename = `${prefix}-${name}`;
	const outputDir = path.join(process.cwd(), 'src', 'backend', 'src', 'database', 'migrations');


	await fs.writeFile(path.join(outputDir, `${filename}.ts`), template, { flag: 'wx' });

	await fs.writeFile(
		path.join(outputDir, 'index.ts'),
		`export * as _${prefix} from './${filename}';\n`,
		{ flag: 'a' }
	);
})();
