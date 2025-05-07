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

import { useContext, useEffect, useState, type FormEvent } from 'react';

import style from './page.module.css';

import Input from '@/components/Input';
import InputImage from '@/components/ImageInput';
import { UserDataContext } from '../context';


export default function Page()
{
	const userContext = useContext(UserDataContext);
	const [ picture, setPicture ] = useState<string | undefined>(undefined);

	useEffect(() =>
	{
		if (!userContext.data) {
			return;
		}

		const pictureBuffer = Buffer.from(userContext.data.picture);

		setPicture(`data:image/png;base64,${pictureBuffer.toString('base64')}`);
	}, [ userContext ]);
	

	// useEffect(() =>
	// {
	// 	(async () =>
	// 	{
	// 		const response = await window.api.fetch<DB.User>('/user/get-info');

	// 		if (response.code === 0) {
	// 			const data = response.data as DB.User;

	// 			const pictureBuffer = Buffer.from(data.picture);

	// 			setUserId(data.id);
	// 			setFirstname(data.firstname);
	// 			setLastname(data.lastname);
	// 			setPicture(`data:image/png;base64,${pictureBuffer.toString('base64')}`);
	// 		}
	// 	})();
	// }, [ ]);


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

		const response = await window.api.fetch<DB.User>('/user/update', data);

		if (response.code !== 0) {
			alert(response.message);
		} else {
			userContext.updateData(response.data as DB.User);
		}
	}


	return (
		<form
			className={ style.form }
			onSubmit={ onSubmitHandler }
		>
			<input type='hidden' name='id' value={ userContext.data ? userContext.data.id : '' }/>

			<InputImage name='picture' defaultSrc={ picture } required={ !(userContext.data?.id) }/>

			<div className={ style.fullname }>
				<Input type='text' name='firstname' label='Nombre(s)' value={ userContext.data?.firstname } required/>

				<Input type='text' name='lastname' label='Apellido(s)' value={ userContext.data?.lastname } required/>
			</div>

			<p><span className={ style.required }>*</span> Campos requeridos</p>

			<button className='generic success'>
				Guardar Cambios
			</button>
		</form>
	);
}
