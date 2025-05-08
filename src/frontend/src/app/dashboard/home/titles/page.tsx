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

import Input from "@/components/form/Input";

import style from './page.module.css';
import TextArea from "@/components/form/TextArea";


function JobTitleEntry()
{
	return (
		<form
			className={ style.entry }
		>
			<div className={ style.fields }>
				<Input
					type='text'
					name='name'
					label='Título'
				/>
				<TextArea
					name='description'
					label='Descripción'
					rows={ 3 }
					maxLength={ 250 }
				/>
			</div>
		</form>
	);
}


export default function Page()
{
	return (
		<div>
			<JobTitleEntry/>
			<JobTitleEntry/>
			<JobTitleEntry/>
		</div>
	);
}
