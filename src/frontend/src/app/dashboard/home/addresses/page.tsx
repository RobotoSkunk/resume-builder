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
import { AnimatePresence, LayoutGroup, motion, Variants } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';

import layoutStyle from '../layout.module.css';
import style from './page.module.css';

import FormEntry, { Field } from '@/components/FormEntry';

import { UserDataContext } from '../../context';

import addImage from '@/assets/icons/add.svg';



async function fetchAddresses(userId: string): Promise<DB.Address[]>
{
	const result = await window.api.fetch<DB.Address[]>(`/user/${userId}/address/list-all`);

	if (result.data) {
		return result.data;
	}

	return [];
}


const fields: Field[] = [
	{
		type: 'text',
		name: 'street',
		label: 'Calle',
		className: style.field,
		required: true,
	},
	{
		type: 'number',
		name: 'number_ext',
		label: 'Número exterior',
		className: style.field,
	},
	{
		type: 'number',
		name: 'number_int',
		label: 'Número interior',
		className: style.field,
	},
	{
		type: 'text',
		name: 'neighborhood',
		label: 'Colonia',
		className: style.field,
		required: true,
	},
	{
		type: 'number',
		name: 'postal_code',
		label: 'Código postal',
		className: style.field,
	},
	{
		type: 'text',
		name: 'city',
		label: 'Ciudad',
		className: style.field,
		required: true,
	},
	{
		type: 'text',
		name: 'state',
		label: 'Estado',
		className: style.field,
		required: true,
	},
	{
		type: 'text',
		name: 'country',
		label: 'País',
		className: style.field,
		required: true,
	},
];


function Entry({
	data,
	onDelete,
	onSetActive,
}: {
	data: DB.Address;
	onDelete: (id: string) => void;
	onSetActive: (trigger: boolean) => Promise<void>;
})
{
	async function onDeleteHandler()
	{
		const response = await window.api.fetch(`/user/address/remove/${data.id}`);

		if (response.ok) {
			onDelete(data.id);
		}
	}

	async function onUpdateDataHandler(dataToSend: Partial<DB.Address>)
	{
		const response = await window.api.fetch(`/user/address/${data.id}/update`, dataToSend);

		if (!response.ok) {
			alert(response.message);

			return false;
		}

		return true;
	}


	return (
		<FormEntry<DB.Address>
			isTemplate={ false }

			deleteQuestion='¿Estás seguro de eliminar esta dirección? Esta acción no se puede deshacer.'
			onDelete={ onDeleteHandler }
			onUpdateData={ onUpdateDataHandler }

			actionsConfig={{
				checkbox: {
					enable: true,
					value: data.is_active === 1,
					handler: (ev) => onSetActive(ev.currentTarget.checked),
				}
			}}


			fields={[
				{
					...fields[0], // street
					value: data.street,
				},
				{
					...fields[1], // number_ext
					value: data.number_ext?.toString(),
				},
				{
					...fields[2], // number_int
					value: data.number_int?.toString(),
				},
				{
					...fields[3], // neighborhood
					value: data.neighborhood,
				},
				{
					...fields[4], // postal_code
					value: data.postal_code?.toString(),
				},
				{
					...fields[5], // city
					value: data.city,
				},
				{
					...fields[6], // state
					value: data.state,
				},
				{
					...fields[7], // country
					value: data.country,
				},
			]}
		/>
	);
}

export default function Page()
{
	const userData = useContext(UserDataContext).data;

	const [ addRow, setAddRow ] = useState(false);
	const [ addresses, setAddresses ] = useState<DB.Address[]>([]);
	const [ loaded, setLoaded ] = useState(false);

	useEffect(() =>
	{
		(async () =>
		{
			if (userData) {
				setAddresses(
					await fetchAddresses(userData.id)
				);

				setLoaded(true);
			}
		})();
	}, [ ]);


	async function onSubmit(data: DB.Address)
	{
		if (!userData) {
			return false;
		}

		const response = await window.api.fetch<DB.User>(`/user/${userData.id}/address/create`, data);

		if (!response.ok) {
			alert(response.message);

			return false;
		}

		setAddresses(
			await fetchAddresses(userData.id)
		);

		return true;
	}


	async function onSetActive(id: string, trigger: boolean)
	{
		if (!userData) {
			return;
		}

		const value = trigger ? 1 : 0;
		const response = await window.api.fetch<DB.User>(`/user/${userData.id}/address/${id}/set-active/${value}`);

		if (!response.ok) {
			alert(response.message);

			return;
		}

		const addressesList = [ ...addresses ];

		for (const address of addressesList) {
			address.is_active = address.id === id && trigger ? 1 : 0;
		}

		setAddresses(addressesList);
	}


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
		<div>
			{ loaded &&
				<LayoutGroup>
					<AnimatePresence mode='popLayout' initial={ false }>
						{ addresses.map((address) =>
							<Entry
								data={ address }
								key={ address.id }

								onDelete={(id) =>
								{
									const addressesList = [ ...addresses ];
									const i = addressesList.findIndex((a) => a.id === id);

									if (i > -1) {
										addressesList.splice(i, 1);
										setAddresses(addressesList);
									}
								}}

								onSetActive={async (trigger) =>
								{
									await onSetActive(address.id, trigger);
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
										alt=''
									/>
								</button>
							</motion.div>
						}
					</AnimatePresence>
				</LayoutGroup>
			}
		</div>
	);
}
