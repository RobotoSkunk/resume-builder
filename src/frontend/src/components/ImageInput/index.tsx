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

import Image from 'next/image';
import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react';

import style from './input.module.css';

import defaultUserImg from '@/assets/icons/default-user.svg';


export default function InputImage({
	name,
}: {
	name: string,
})
{
	const [ id, setId ] = useState('');

	const inputRef: RefObject<HTMLInputElement | null> = useRef(null);
	const [ imgData, setImgData ] = useState('');

	useEffect(() =>
	{
		setId(crypto.randomUUID());
	}, [ ]);


	function handleInput(ev: ChangeEvent<HTMLInputElement>)
	{
		const file = ev.target.files ? ev.target.files[0] : undefined;

		if (!file) {
			return;
		}

		const fileReader = new FileReader();

		fileReader.onload = (ev) =>
		{
			if (!(ev.target?.result as string).startsWith('data:image/')) {
				alert('Por favor, elije una imagen válida.');
				return;
			}

			setImgData(ev.target?.result as string);

			if (inputRef.current) {
				inputRef.current.value = ev.target?.result as string;
			}
		};

		fileReader.readAsDataURL(file);
	}


	return (
		<>
			<input type='hidden' name={ name } ref={ inputRef }/>

			<div className={ style.container }>
				<label htmlFor={ id }>
					<Image
						src={ imgData === '' ? defaultUserImg : imgData }
						alt=''
						fill
					/>
				</label>
				<input
					id={ id }
					type='file'
					accept='image/*'
					onChange={ handleInput }
				/>
			</div>
		</>
	);
}
