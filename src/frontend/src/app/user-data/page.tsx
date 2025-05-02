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

'use client';

import style from './page.module.css';
import Input from '@/components/Input';
import InputImage from '@/components/ImageInput';


export default function Home()
{
	return (
		<form className={ style.form }>
			<h1>Ingresa tus datos</h1>
			<InputImage/>

			<Input type='text' name='firstname' label='Nombre(s)' required/>

			<Input type='text' name='lastname' label='Apellido(s)' required/>

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
		</form>
	);
}
