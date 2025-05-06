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
import { createContext, useContext, useEffect, useRef, useState, type FormEvent } from 'react';

import style from './page.module.css';

import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';

import cancelImage from '@/assets/icons/cancel.svg';
import acceptImage from '@/assets/icons/check.svg';
import deleteImage from '@/assets/icons/trash.svg';
import addImage from '@/assets/icons/add.svg';
import { UserDataContext } from '../../context';



async function fetchAddresses(userId: string): Promise<AddressData[]>
{
	const result = await window.api.fetch<AddressData[]>(`/user/${userId}/address/list-all`);

	if (result.data) {
		return result.data;
	}

	return [];
}


function AddressEntry({
	userId,
	data,
	updateData,
	onCancelEntry,
}: {
	userId: string,
	data?: AddressData,
	updateData: (data: AddressData[]) => void,
	onCancelEntry?: () => void,
})
{
	const formRef = useRef<HTMLFormElement | null>(null);

	const [ timeoutId, setTimeoutId ] = useState<NodeJS.Timeout | null>(null);
	const [ dataToUpdate, setDataToUpdate ] = useState<Partial<AddressData>>({ });


	async function invokeUpdateData()
	{
		updateData(
			await fetchAddresses(userId)
		);
	}

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

		const response = await window.api.fetch<UserData>(`/user/${userId}/address/create`, data);

		if (response.code !== 0) {
			alert(response.message);
		} else {
			await invokeUpdateData();

			cancelEntry();
		}
	}

	async function deleteEntry()
	{
		if (!data) {
			return;
		}

		const result = confirm('¿Seguro que deseas eliminar esta dirección?');

		if (!result) {
			return;
		}

		if (formRef.current) {
			const response = await window.api.fetch(`/user/address/remove/${data.id}`);

			if (response.code === 0) {
				await invokeUpdateData();
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
		const trigger = ev.currentTarget.checked ? 1 : 0;

		const response = await window.api.fetch<UserData>(`/user/${userId}/address/${data?.id}/set-active/${trigger}`);

		if (response.code !== 0) {
			alert(response.message);
		} else {
			await invokeUpdateData();
		}
	}


	return (
		<form
			ref={ formRef }
			className={ style.entry }
			onSubmit={ onSubmitHandler }
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
		</form>
	);
}


export default function Page()
{
	const userData = useContext(UserDataContext).data;

	const [ addRow, setAddRow ] = useState(false);
	const [ addresses, setAddresses ] = useState<AddressData[]>([]);

	useEffect(() =>
	{
		(async () =>
		{
			if (userData) {
				setAddresses(
					await fetchAddresses(userData.id)
				);
			}
		})();
	}, [ ]);


	function updateData(data: AddressData[])
	{
		setAddresses(data);
	}


	return (
		<div className={ style.entries }>
			{ addresses.map((address, index) =>
				<AddressEntry
					userId={ userData?.id || '' }
					updateData={ updateData }
					data={ address }
					key={ index }
				/>
			) }

			{ addRow ?
				<AddressEntry
					userId={ userData?.id || '' }
					updateData={ updateData }
					onCancelEntry={ () => setAddRow(false) }
				/>
				:
				<div className={ style['add-row'] }>
					<button onClick={ () => setAddRow(true) }>
						<Image
							src={ addImage }
							alt=''
						/>
					</button>
				</div>
			}
		</div>
	);
}
