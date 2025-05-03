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

import { RefObject, useEffect, useRef, useState, type HTMLInputTypeAttribute } from 'react';

import style from './input.module.css';
import { roboto400 } from '@/utils/fonts';


export default function Input({
	label,
	type,
	name,
	value,
	min,
	max,
	required,
}: {
	label: string,
	type: HTMLInputTypeAttribute,
	name: string,
	value?: string,
	min?: number,
	max?: number,
	required?: boolean,
})
{
	const [ id, setId ] = useState('');

	const inputRef: RefObject<HTMLInputElement | null> = useRef(null);
	const [ hasValue, setHasValue ] = useState(false);

	useEffect(() =>
	{
		setId(crypto.randomUUID());
	}, [ ]);

	return (
		<div className={ style.container }>
			<input
				type={ type }
				id={ id }
				ref={ inputRef }
				name={ name }
				defaultValue={ value }

				min={ min }
				max={ max }
				required={ required }
				
				className={ roboto400.className }
				onInput={ () =>
				{
					if (inputRef.current) {
						setHasValue(inputRef.current.value !== '');
					}
				}}
			/>
			<label htmlFor={ id } className={ hasValue ? style['has-value'] : '' }>
				{ label }{ required ? <span className={ style.required }>*</span> : '' }
			</label>
		</div>
	);
}
