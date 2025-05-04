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
import { useRef, type FormEvent } from 'react';

import Input from '@/components/Input';

import style from './page.module.css';

import cancelImage from '@/assets/icons/cancel.svg';
import acceptImage from '@/assets/icons/check.svg';
import deleteImage from '@/assets/icons/trash.svg';
import Checkbox from '@/components/Checkbox';


function AddressEntry({
	data,
}: {
	data?: AddressData,
})
{
	const formRef = useRef<HTMLFormElement | null>(null);

	function onSubmitHandler(ev: FormEvent<HTMLFormElement>)
	{

	}

	function deleteEntry()
	{
		const result = confirm('¿Seguro que deseas eliminar esta dirección?');

		if (!result) {
			return;
		}

		if (formRef.current) {
			formRef.current.remove();
		}
	}


	return (
		<form
			ref={ formRef }
			className={ style.entry }
			onSubmit={ onSubmitHandler }
		>
			<div className={ style.controls }>
				<div>
					<Checkbox
						label='Activo'
						name='is_active'
						value='0'
					/>
				</div>

				<div className={ style.actions }>
					{/* <button className={ style.success }>
						<Image
							src={ acceptImage }
							alt=''
						/>
					</button>
					<button className={ style.danger }>
						<Image
							src={ cancelImage }
							alt=''
						/>
					</button> */}
					<button className={ style.danger } type='button' onClick={ deleteEntry }>
						<Image
							src={ deleteImage }
							alt=''
						/>
					</button>
				</div>
			</div>

			<div className={ style.fields }>
				<Input type='text'   name='street'       label='Calle' required/>
				<Input type='number' name='number_ext'   label='Número exterior' min={ 0 }/>
				<Input type='number' name='number_int'   label='Número interior' min={ 0 }/>
				<Input type='text'   name='neighborhood' label='Colonia' required/>
				<Input type='number' name='postal_code'  label='Código postal' min={ 0 } max={ 99999 }/>
				<Input type='text'   name='city'         label='Ciudad' required/>
				<Input type='text'   name='state'        label='Estado' required/>
				<Input type='text'   name='country'      label='País' required/>
			</div>
		</form>
	);
}


export default function Page()
{
	return (
		<div className={ style.entries }>
			<AddressEntry/>
			<AddressEntry/>
			<AddressEntry/>
		</div>
	);
}
