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

import NextImage from 'next/image';
import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react';

import { loadImage } from '@napi-rs/canvas';

import style from './input.module.css';

import defaultUserImg from '@/assets/icons/default-user.svg';


export default function InputImage({
	name,
	defaultSrc,
}: {
	name: string,
	defaultSrc?: string,
})
{
	const [ id, setId ] = useState('');

	const inputRef: RefObject<HTMLInputElement | null> = useRef(null);
	const [ imgData, setImgData ] = useState('');

	useEffect(() =>
	{
		setId(crypto.randomUUID());

		if (defaultSrc) {
			setImgData(defaultSrc);
		}
	}, [ defaultSrc ]);


	function handleInput(ev: ChangeEvent<HTMLInputElement>)
	{
		const file = ev.currentTarget.files ? ev.currentTarget.files[0] : undefined;

		if (!file) {
			return;
		}

		const fileReader = new FileReader();

		fileReader.onload = (fileEvent) =>
		{
			if (!(fileEvent.target?.result as string).startsWith('data:image/')) {
				alert('Por favor, elije una imagen válida.');
				return;
			}

			const image = new Image();

			image.onload = () =>
			{
				if (image.width < 512 || image.height < 512) {
					alert('La imagen es demasiado pequeña, usa una imagen de 512 píxeles de alto y ancho o mas.');
					return;
				}

				setImgData(image.src);

				if (inputRef.current) {
					inputRef.current.value = image.src;
				}
			};

			image.src = fileEvent.target?.result as string;
		};

		fileReader.readAsDataURL(file);
	}


	return (
		<>
			<input type='hidden' name={ name } ref={ inputRef }/>

			<div className={ style.container }>
				<label htmlFor={ id }>
					<NextImage
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
