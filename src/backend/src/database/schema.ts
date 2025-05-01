import { Kysely } from 'kysely';

import * as jobs from './tables/jobs';


export type DatabaseSchemaType =
	jobs.PartialDB;


export type DatabaseSchema = Kysely<DatabaseSchemaType>;


export default DatabaseSchema;
