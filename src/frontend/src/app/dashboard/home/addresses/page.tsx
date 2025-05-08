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
import { useContext, useEffect, useRef, useState, type FormEvent } from 'react';

import style from './page.module.css';

import Input from '@/components/form/Input';
import Checkbox from '@/components/form/Checkbox';

import cancelImage from '@/assets/icons/cancel.svg';
import acceptImage from '@/assets/icons/check.svg';
import deleteImage from '@/assets/icons/trash.svg';
import addImage from '@/assets/icons/add.svg';
import { UserDataContext } from '../../context';



async function fetchAddresses(userId: string): Promise<DB.Address[]>
{
	const result = await window.api.fetch<DB.Address[]>(`/user/${userId}/address/list-all`);

	if (result.data) {
		return result.data;
	}

	return [];
}


function AddressEntry({
	userId,
	data,
	updateData,
	onDeleteEntry,
	onSetActiveEntry,
	onCancelEntry,
}: {
	userId: string,
	data?: DB.Address,
	updateData: (data: DB.Address[]) => void,
	onDeleteEntry?: (id: string) => void,
	onSetActiveEntry?: (id: string, trigger: boolean) => void,
	onCancelEntry?: () => void,
})
{
	const formRef = useRef<HTMLFormElement | null>(null);

	const [ timeoutId, setTimeoutId ] = useState<NodeJS.Timeout | null>(null);
	const [ dataToUpdate, setDataToUpdate ] = useState<Partial<DB.Address>>({ });


	async function onSubmitHandler(ev: FormEvent<HTMLFormElement>)
	{
		const form = ev.currentTarget;

		ev.preventDefault();

		if (!form.checkValidity()) {
			form.reportValidity();
		}

		const formData = new FormData(form);

		const data: { [ key: string ]: unknown } = {};
		formData.forEach((value, key) => data[key] = value);

		const response = await window.api.fetch<DB.User>(`/user/${userId}/address/create`, data);

		if (response.code !== 0) {
			alert(response.message);
		} else {
			updateData(
				await fetchAddresses(userId)
			);

			cancelEntry();
		}
	}

	async function deleteEntry()
	{
		if (!data || !onDeleteEntry) {
			return;
		}

		const result = confirm('¿Seguro que deseas eliminar esta dirección?');

		if (!result) {
			return;
		}

		if (formRef.current) {
			const response = await window.api.fetch(`/user/address/remove/${data.id}`);

			if (response.code === 0) {
				onDeleteEntry(data.id);
			}
		}
	}

	function cancelEntry()
	{
		if (formRef.current) {
			formRef.current.reset();
		}

		if (onCancelEntry) {
			onCancelEntry();
		}
	}

	async function onInputChange(ev: React.FormEvent<HTMLInputElement>)
	{
		if (!data) {
			return;
		}

		const input = ev.currentTarget;

		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		setDataToUpdate({
			...dataToUpdate,
			[ input.name ]: input.value,
		});


		setTimeoutId(
			setTimeout(() =>
			{
				(async () =>
				{
					const response = await window.api.fetch(`/user/address/${data.id}/update`, {
						...dataToUpdate,
						[ input.name ]: input.value,
					});

					if (response.code !== 0) {
						alert(response.message);
					} else {
						setDataToUpdate({ });
					}
				})();

				setTimeoutId(null);
			}, 500)
		);
	}

	async function onSetActive(ev: React.ChangeEvent<HTMLInputElement>)
	{
		if (!data || !onSetActiveEntry) {
			return;
		}

		const trigger = ev.currentTarget.checked ? 1 : 0;

		const response = await window.api.fetch<DB.User>(`/user/${userId}/address/${data.id}/set-active/${trigger}`);

		if (response.code !== 0) {
			alert(response.message);
		} else {
			onSetActiveEntry(data.id, trigger === 1);
		}
	}

	const variants = {
		hide: {
			x: 100,
			opacity: 0,
			transition: {
				duration: 0.2,
			}
		},
		show: {
			x: 0,
			opacity: 1,
			transition: {
				duration: 0.4,
				type: 'spring',
			}
		},
	} satisfies Variants;


	return (
		<motion.form
			ref={ formRef }
			className={ style.entry }
			onSubmit={ onSubmitHandler }

			initial='hide'
			animate='show'
			exit='hide'

			layout
			variants={ data ? variants : undefined }
		>
			<input type='hidden' name='user_id' value={ userId }/>

			<div className={ style.controls }>
				{ data && 
					<div>
						<Checkbox
							label='Activo'
							name='is_active'
							value='1'
							checked={ data.is_active === 1 }
							disabled={ !!timeoutId }
							onChange={ onSetActive }
						/>
					</div>
				}

				<div className={ style.actions }>
					{ data ?
						<button
							className={ style.danger }
							type='button'
							disabled={ !!timeoutId }
							onClick={ deleteEntry }
						>
							<Image
								src={ deleteImage }
								alt=''
							/>
						</button>
						:
						<>
							<button className={ style.success }>
								<Image
									src={ acceptImage }
									alt=''
								/>
							</button>
							<button className={ style.danger } type='button' onClick={ cancelEntry }>
								<Image
									src={ cancelImage }
									alt=''
								/>
							</button>
						</>
					}
				</div>
			</div>

			<div className={ style.fields }>
				<Input
					type='text'
					name='street'
					value={ data?.street ?? '' }
					label='Calle'
					onInput={ data ? onInputChange : undefined }
					required
				/>
				<Input
					type='number'
					name='number_ext'
					value={ data?.number_ext?.toString() ?? '' }
					label='Número exterior'
					onInput={ data ? onInputChange : undefined }
					min={ 0 }
				/>
				<Input
					type='number'
					name='number_int'
					value={ data?.number_int?.toString() ?? '' }
					label='Número interior'
					onInput={ data ? onInputChange : undefined }
					min={ 0 }
				/>
				<Input
					type='text'
					name='neighborhood'
					value={ data?.neighborhood ?? '' }
					label='Colonia'
					onInput={ data ? onInputChange : undefined }
					required
				/>
				<Input
					type='number'
					name='postal_code'
					value={ data?.postal_code?.toString() ?? '' }
					label='Código postal'
					onInput={ data ? onInputChange : undefined }
					min={ 0 }
					max={ 99999 }
				/>
				<Input
					type='text'
					name='city'
					value={ data?.city ?? '' }
					label='Ciudad'
					onInput={ data ? onInputChange : undefined }
					required
				/>
				<Input
					type='text'
					name='state'
					value={ data?.state ?? '' }
					label='Estado'
					onInput={ data ? onInputChange : undefined }
					required
				/>
				<Input
					type='text'
					name='country'
					value={ data?.country ?? '' }
					label='País'
					onInput={ data ? onInputChange : undefined }
					required
				/>
			</div>
		</motion.form>
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


	function updateData(data: DB.Address[])
	{
		setAddresses(data);
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
							<AddressEntry
								userId={ userData?.id || '' }
								updateData={ updateData }
								data={ address }
								key={ address.id }

								onDeleteEntry={(id) =>
								{
									const addressesList = [ ...addresses ];
									const i = addressesList.findIndex((a) => a.id === id);

									if (i > -1) {
										addressesList.splice(i, 1);
										setAddresses(addressesList);
									}
								}}

								onSetActiveEntry={(id, trigger) =>
								{
									const addressesList = [ ...addresses ];

									for (const address of addressesList) {
										address.is_active = address.id === id && trigger ? 1 : 0;
									}

									setAddresses(addressesList);
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
								<AddressEntry
									userId={ userData?.id || '' }
									updateData={ updateData }
									onCancelEntry={ () => setAddRow(false) }
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
								<button onClick={ () => setAddRow(true) }>
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
