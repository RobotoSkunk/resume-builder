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

export const tableName = 'achievements';

export enum AchievementType
{
	CERTIFICATE = 0,
	RECOGNITION = 1,
	DIPLOMA = 2,
}

export interface DB_Achievements
{
	id: string;
	user_id: string;
	description: string;
	type: AchievementType;
	date: number;
}


export type PartialDB = { [ tableName ]: DB_Achievements };
