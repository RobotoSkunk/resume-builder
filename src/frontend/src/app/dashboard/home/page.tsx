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

import { useEffect, useState, type FormEvent } from 'react';

import style from './page.module.css';

import Input from '@/components/Input';
import InputImage from '@/components/ImageInput';


export default function Page()
{
	const [ firstname, setFirstname ] = useState<string>('');
	const [ lastname, setLastname ] = useState<string>('');
	const [ picture, setPicture ] = useState<string | undefined>(undefined);

	useEffect(() =>
	{
		(async () =>
		{
			const response = await window.api.fetch<UserData>('/user/get-info');
			const data = response.data as UserData;

			const pictureBuffer = Buffer.from(data.picture);

			setFirstname(data.firstname);
			setLastname(data.lastname);
			setPicture(`data:image/png;base64,${pictureBuffer.toString('base64')}`);
		})();
	}, [ ]);


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

		const response = await window.api.fetch('/user/create', data);

		if (response.code !== 0) {
			alert(response.message);
		} else {
			location.reload();
		}
	}


	return (
		<form
			className={ style.form }
			onSubmit={ onSubmitHandler }
		>
			<InputImage name='picture' defaultSrc={ picture }/>

			<Input type='text' name='firstname' label='Nombre(s)' value={ firstname } required/>

			<Input type='text' name='lastname' label='Apellido(s)' value={ lastname } required/>

			<section>
				<h2>Dirección</h2>
				<Input type='text' name='street' label='Calle' required/>
				<Input type='number' name='number_ext' label='Número exterior' min={ 0 }/>
				<Input type='number' name='number_int' label='Número interior' min={ 0 }/>
				<Input type='text' name='neighborhood' label='Colonia' required/>
				<Input type='number' name='postal_code' label='Código postal'/>
				<Input type='text' name='city' label='Ciudad' required/>
				<Input type='text' name='state' label='Estado' required/>
				<Input type='text' name='country' label='País' required/>
			</section>

			<p><span className={ style.required }>*</span> Campos requeridos</p>

			<button>
				Guardar Cambios
			</button>
		</form>
	);
}
