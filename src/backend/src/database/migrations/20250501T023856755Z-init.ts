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

import { Kysely } from 'kysely';


export async function up(db: Kysely<unknown>): Promise<void>
{
	// CREATE users
	await db.schema
		.createTable('users')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('firstname', 'text', c => c.notNull())
		.addColumn('lastname', 'text', c => c.notNull())
		.addColumn('picture', 'blob')

		.execute();

	// CREATE addresses
	await db.schema
		.createTable('addresses')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('user_id', 'text', c => c.notNull())
		.addColumn('street', 'text', c => c.notNull())
		.addColumn('number_ext', 'integer')
		.addColumn('number_int', 'integer')
		.addColumn('neighborhood', 'text', c => c.notNull())
		.addColumn('postal_code', 'integer')
		.addColumn('city', 'text', c => c.notNull())
		.addColumn('state', 'text', c => c.notNull())
		.addColumn('country', 'text', c => c.notNull())
		.addColumn('is_active', 'boolean', c => c.notNull().defaultTo(true))

		.addForeignKeyConstraint('user_id_fk', [ 'user_id' ], 'users', [ 'id' ], fk => fk.onDelete('cascade'))

		.execute();

	// CREATE email_addresses
	await db.schema
		.createTable('email_addresses')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('user_id', 'text', c => c.notNull())
		.addColumn('email', 'text', c => c.notNull())

		.addForeignKeyConstraint('user_id_fk', [ 'user_id' ], 'users', [ 'id' ], fk => fk.onDelete('cascade'))

		.execute();

	// CREATE phone_numbers
	await db.schema
		.createTable('phone_numbers')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('user_id', 'text', c => c.notNull())
		.addColumn('type', 'integer', c => c.notNull())
		.addColumn('country_code', 'integer', c => c.notNull())
		.addColumn('area_code', 'integer', c => c.notNull())
		.addColumn('phone', 'integer', c => c.notNull())
		.addColumn('extension', 'integer')

		.addForeignKeyConstraint('user_id_fk', [ 'user_id' ], 'users', [ 'id' ], fk => fk.onDelete('cascade'))

		.execute();

	// CREATE web_urls
	await db.schema
		.createTable('web_urls')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('user_id', 'text', c => c.notNull())
		.addColumn('url', 'text', c => c.notNull())

		.addForeignKeyConstraint('user_id_fk', [ 'user_id' ], 'users', [ 'id' ], fk => fk.onDelete('cascade'))

		.execute();

	// CREATE languages
	await db.schema
		.createTable('languages')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('user_id', 'text', c => c.notNull())
		.addColumn('name', 'text', c => c.notNull())
		.addColumn('cefr_level', 'integer', c => c.notNull())

		.addForeignKeyConstraint('user_id_fk', [ 'user_id' ], 'users', [ 'id' ], fk => fk.onDelete('cascade'))

		.execute();



	// CREATE templates
	await db.schema
		.createTable('templates')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('name', 'text', c => c.notNull())
		.addColumn('description', 'text', c => c.notNull())
		.addColumn('data', 'blob', c => c.notNull())

		.execute();

	// CREATE job_titles
	await db.schema
		.createTable('job_titles')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('user_id', 'text', c => c.notNull())
		.addColumn('name', 'text', c => c.notNull())
		.addColumn('description', 'text')
		.addColumn('preset_template', 'integer', c => c.notNull())
		.addColumn('template_id', 'text', c => c.notNull())

		.addForeignKeyConstraint('user_id_fk', [ 'user_id' ], 'users', [ 'id' ], fk => fk.onDelete('cascade'))

		.execute();

	// CREATE educations
	await db.schema
		.createTable('educations')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('institution_name', 'text', c => c.notNull())
		.addColumn('country', 'text', c => c.notNull())
		.addColumn('state', 'text', c => c.notNull())
		.addColumn('city', 'text', c => c.notNull())
		.addColumn('faculty', 'text', c => c.notNull())
		.addColumn('degree_type', 'integer', c => c.notNull())
		.addColumn('program', 'text', c => c.notNull())
		.addColumn('average_score', 'real')
		.addColumn('started_at', 'integer', c => c.notNull())
		.addColumn('ended_at', 'integer')

		.execute();

	// CREATE job_titles_educations
	await db.schema
		.createTable('job_titles_educations')

		.addColumn('job_title_id', 'text')
		.addColumn('education_id', 'text')

		.addForeignKeyConstraint('job_title_fk', [ 'job_title_id' ], 'job_titles', [ 'id' ], fk => fk.onDelete('cascade'))
		.addForeignKeyConstraint('education_fk', [ 'education_id' ], 'educations', [ 'id' ], fk => fk.onDelete('cascade'))

		.addPrimaryKeyConstraint('job_title_education_pk', [ 'education_id', 'job_title_id' ])

		.execute();

	// CREATE experiences
	await db.schema
		.createTable('experiences')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('title', 'text', c => c.notNull())
		.addColumn('company', 'text', c => c.notNull())
		.addColumn('description', 'text', c => c.notNull())
		.addColumn('started_at', 'integer', c => c.notNull())
		.addColumn('ended_at', 'integer')

		.execute();

	// CREATE job_titles_experiences
	await db.schema
		.createTable('job_titles_experiences')

		.addColumn('job_title_id', 'text')
		.addColumn('experience_id', 'text')

		.addForeignKeyConstraint('job_title_fk', [ 'job_title_id' ], 'job_titles', [ 'id' ], fk => fk.onDelete('cascade'))
		.addForeignKeyConstraint('experience_fk', [ 'experience_id' ], 'experiences', [ 'id' ], fk => fk.onDelete('cascade'))

		.addPrimaryKeyConstraint('job_title_experience_pk', [ 'experience_id', 'job_title_id' ])

		.execute();

	// CREATE courses
	await db.schema
		.createTable('courses')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('name', 'text', c => c.notNull())
		.addColumn('institution', 'text', c => c.notNull())
		.addColumn('participation_type', 'integer', c => c.notNull())
		.addColumn('date', 'integer', c => c.notNull())

		.execute();

	// CREATE job_titles_courses
	await db.schema
		.createTable('job_titles_courses')

		.addColumn('job_title_id', 'text')
		.addColumn('course_id', 'text')

		.addForeignKeyConstraint('job_title_fk', [ 'job_title_id' ], 'job_titles', [ 'id' ], fk => fk.onDelete('cascade'))
		.addForeignKeyConstraint('course_fk', [ 'course_id' ], 'courses', [ 'id' ], fk => fk.onDelete('cascade'))

		.addPrimaryKeyConstraint('job_title_course_pk', [ 'course_id', 'job_title_id' ])

		.execute();

	// CREATE achievements
	await db.schema
		.createTable('achievements')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('description', 'text', c => c.notNull())
		.addColumn('type', 'integer', c => c.notNull())
		.addColumn('date', 'integer', c => c.notNull())

		.execute();

	// CREATE job_titles_achievements
	await db.schema
		.createTable('job_titles_achievements')

		.addColumn('job_title_id', 'text')
		.addColumn('achievement_id', 'text')

		.addForeignKeyConstraint('job_title_fk', [ 'job_title_id' ], 'job_titles', [ 'id' ], fk => fk.onDelete('cascade'))
		.addForeignKeyConstraint('achievement_fk', [ 'achievement_id' ], 'achievements', [ 'id' ], fk => fk.onDelete('cascade'))

		.addPrimaryKeyConstraint('job_title_achievement_pk', [ 'achievement_id', 'job_title_id' ])

		.execute();

	// CREATE certifications
	await db.schema
		.createTable('certifications')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('name', 'text', c => c.notNull())
		.addColumn('institution', 'text', c => c.notNull())
		.addColumn('participation_type', 'integer', c => c.notNull())
		.addColumn('date', 'integer', c => c.notNull())

		.execute();

	// CREATE job_titles_certifications
	await db.schema
		.createTable('job_titles_certifications')

		.addColumn('job_title_id', 'text')
		.addColumn('certification_id', 'text')

		.addForeignKeyConstraint('job_title_fk', [ 'job_title_id' ], 'job_titles', [ 'id' ], fk => fk.onDelete('cascade'))
		.addForeignKeyConstraint('certification_fk', [ 'certification_id' ], 'certifications', [ 'id' ], fk => fk.onDelete('cascade'))

		.addPrimaryKeyConstraint('job_title_certification_pk', [ 'certification_id', 'job_title_id' ])

		.execute();

	// CREATE projects
	await db.schema
		.createTable('projects')

		.addColumn('id', 'text', c => c.primaryKey())
		.addColumn('title', 'text', c => c.notNull())
		.addColumn('participation_type', 'integer', c => c.notNull())
		.addColumn('company', 'text', c => c.notNull())
		.addColumn('description', 'text', c => c.notNull())
		.addColumn('started_at', 'integer', c => c.notNull())
		.addColumn('ended_at', 'integer')

		.execute();

	// CREATE job_titles_projects
	await db.schema
		.createTable('job_titles_projects')

		.addColumn('job_title_id', 'text')
		.addColumn('project_id', 'text')

		.addForeignKeyConstraint('job_title_fk', [ 'job_title_id' ], 'job_titles', [ 'id' ], fk => fk.onDelete('cascade'))
		.addForeignKeyConstraint('project_fk', [ 'project_id' ], 'projects', [ 'id' ], fk => fk.onDelete('cascade'))

		.addPrimaryKeyConstraint('job_title_project_pk', [ 'project_id', 'job_title_id' ])

		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void>
{
	await db.schema.dropTable('educations').execute();
	await db.schema.dropTable('job_titles_educations').execute();

	await db.schema.dropTable('experiences').execute();
	await db.schema.dropTable('job_titles_experiences').execute();

	await db.schema.dropTable('courses').execute();
	await db.schema.dropTable('job_titles_courses').execute();

	await db.schema.dropTable('achievements').execute();
	await db.schema.dropTable('job_titles_achievements').execute();

	await db.schema.dropTable('certifications').execute();
	await db.schema.dropTable('job_titles_certifications').execute();

	await db.schema.dropTable('projects').execute();
	await db.schema.dropTable('job_titles_projects').execute();

	await db.schema.dropTable('job_titles').execute();

	await db.schema.dropTable('addresses').execute();
	await db.schema.dropTable('email_addresses').execute();
	await db.schema.dropTable('phone_numbers').execute();
	await db.schema.dropTable('web_urls').execute();
	await db.schema.dropTable('languages').execute();

	await db.schema.dropTable('templates').execute();
	await db.schema.dropTable('users').execute();
}
