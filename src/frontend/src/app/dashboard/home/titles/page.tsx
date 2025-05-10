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

'use client';

import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, Variants } from 'framer-motion';

import layoutStyle from '../layout.module.css';
import style from './page.module.css';

import FormEntry, { Field } from '@/components/FormEntry';

import { UserDataContext } from '../../context';

import addImage from '@/assets/icons/add.svg';


async function fetchJobTitles(userId: string): Promise<DB.JobTitle[]>
{
	const result = await window.api.fetch<DB.JobTitle[]>(`/user/${userId}/job-title/list-all`);

	if (result.data) {
		return result.data;
	}

	return [];
}


const fields: Field[] = [
	{
		type: 'text',
		name: 'name',
		label: 'Nombre del título',
		className: style.field,
		required: true,
	},
	{
		type: 'textarea',
		name: 'description',
		label: 'Descripción',
		className: style.field,
		required: true,
	},
];


function Entry({
	data,
	onDelete,
}: {
	data: DB.JobTitle;
	onDelete: (id: string) => void;
})
{
	async function onDeleteHandler()
	{
		const response = await window.api.fetch(`/user/job-title/remove/${data.id}`);

		if (response.ok) {
			onDelete(data.id);
		}
	}

	async function onUpdateDataHandler(dataToSend: Partial<DB.JobTitle>)
	{
		const response = await window.api.fetch(`/user/job-title/${data.id}/update`, dataToSend);

		if (!response.ok) {
			alert(response.message);

			return false;
		}

		return true;
	}


	return (
		<FormEntry
			isTemplate={ false }

			deleteQuestion='¿Estás seguro de eliminar este título profesional? Esta acción no se puede deshacer.'
			onDelete={ onDeleteHandler }

			onUpdateData={ onUpdateDataHandler }

			fields={[
				{
					...fields[0], // name
					value: data.name,
				},
				{
					...fields[1], // description
					value: data.description,
				},
			]}
		/>
	);
}


export default function Page()
{
	const userContext = useContext(UserDataContext);
	const userData = userContext.data;

	const [ addRow, setAddRow ] = useState(false);
	const [ loaded, setLoaded ] = useState(false);
	const [ jobTitles, setJobTitles ] = useState<DB.JobTitle[]>([]);


	async function onSubmit(data: DB.Address)
	{
		if (!userData) {
			return false;
		}

		const response = await window.api.fetch<DB.User>(`/user/${userData.id}/job-title/create`, data);

		if (!response.ok) {
			alert(response.message);

			return false;
		}

		setJobTitles(
			await fetchJobTitles(userData.id)
		);

		return true;
	}

	useEffect(() =>
	{
		if (!userData) {
			return;
		}

		(async () =>
		{
			setJobTitles(
				await fetchJobTitles(userData.id)
			);

			setLoaded(true);
		})();
	}, [ ]);


	const variants = {
		hide: {
			y: 30,
			opacity: 0,
			transition: {
				duration: 0.1,
			}
		},
		show: {
			y: 0,
			opacity: 1,
		},
	} satisfies Variants;

	return (
		loaded && <LayoutGroup>
			<AnimatePresence mode='popLayout' initial={ false }>
				{ jobTitles.map((jobTitle) =>
					<Entry
						data={ jobTitle }
						key={ jobTitle.id }

						onDelete={(id) =>
						{
							const addressesList = [ ...jobTitles ];
							const i = addressesList.findIndex((a) => a.id === id);

							if (i > -1) {
								addressesList.splice(i, 1);
								setJobTitles(addressesList);
							}
						}}
					/>
				) }


				{ addRow ?
					<motion.div
						key='new-entry'

						initial='hide'
						animate='show'
						exit='hide'

						layout
						variants={ variants }
					>
						<FormEntry<DB.Address>
							isTemplate={ true }

							onCancel={ () => setAddRow(false) }
							onSubmit={ onSubmit }

							fields={ fields }
						/>
					</motion.div>
					:
					<motion.div
						key='add-button'

						initial='hide'
						animate='show'
						exit='hide'

						layout
						variants={ variants }

						className={ style['add-row'] }
					>
						<button className={ layoutStyle['add-button'] } onClick={ () => setAddRow(true) }>
							<Image
								src={ addImage }
								alt='Agregar nuevo título profesional'
							/>
						</button>
					</motion.div>
				}
			</AnimatePresence>
		</LayoutGroup>
	);
}
