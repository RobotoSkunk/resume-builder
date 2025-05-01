
export const tableName = 'jobs';

export interface Jobs
{
	title: string;
	company: string;
	description: string;
	dateStart: Date;
	dateEnd: Date;
}


export type PartialDB = { [ tableName ]: Jobs };
