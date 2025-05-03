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

import { Kysely } from 'kysely';

import * as achievements            from './tables/achievements';
import * as addresses               from './tables/addresses';
import * as certifications          from './tables/certifications';
import * as courses                 from './tables/courses';
import * as education               from './tables/educations';
import * as emailAddresses          from './tables/email-addresses';
import * as experiences             from './tables/experiences';
import * as jobTitlesAchievements   from './tables/job-titles-achievements';
import * as jobTitlesCertifications from './tables/job-titles-certifications';
import * as jobTitlesCourses        from './tables/job-titles-courses';
import * as jobTitlesEducations     from './tables/job-titles-educations';
import * as jobTitlesExperiences    from './tables/job-titles-experiences';
import * as jobTitlesProjects       from './tables/job-titles-projects';
import * as jobTitles               from './tables/job-titles';
import * as languages               from './tables/languages';
import * as phoneNumbers            from './tables/phone-numbers';
import * as projects                from './tables/projects';
import * as templates               from './tables/templates';
import * as users                   from './tables/users';
import * as webUrls                 from './tables/web-urls';


export type DatabaseSchemaType =
	achievements.PartialDB &
	addresses.PartialDB &
	certifications.PartialDB &
	courses.PartialDB &
	education.PartialDB &
	emailAddresses.PartialDB &
	experiences.PartialDB &
	jobTitlesAchievements.PartialDB &
	jobTitlesCertifications.PartialDB &
	jobTitlesCourses.PartialDB &
	jobTitlesEducations.PartialDB &
	jobTitlesExperiences.PartialDB &
	jobTitlesProjects.PartialDB &
	jobTitles.PartialDB &
	languages.PartialDB &
	phoneNumbers.PartialDB &
	projects.PartialDB &
	templates.PartialDB &
	users.PartialDB &
	webUrls.PartialDB;


export type DatabaseSchema = Kysely<DatabaseSchemaType>;


export default DatabaseSchema;
