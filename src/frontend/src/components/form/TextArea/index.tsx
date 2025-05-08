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

import style from '../input.module.css';
import { roboto400 } from '@/utils/fonts';


export default function TextArea({
	label,
	name,
	value,
	rows,
	cols,
	required,
	onInput,
}: {
	label: string,
	name: string,
	value?: string,
	rows?: number,
	cols?: number,
	required?: boolean,
	onInput?: (ev: React.FormEvent<HTMLTextAreaElement>) => (Promise<void> | void),
})
{
	const [ id, setId ] = useState('');

	const inputRef: RefObject<HTMLTextAreaElement | null> = useRef(null);
	const [ hasValue, setHasValue ] = useState(false);

	useEffect(() =>
	{
		setId(crypto.randomUUID());

		checkValue();
	}, [ value ]);


	function checkValue()
	{
		if (inputRef.current) {
			setHasValue(inputRef.current.value !== '');
		}
	}


	return (
		<div className={ style.container }>
			<textarea
				id={ id }
				name={ name }
				ref={ inputRef }
				defaultValue={ value }

				rows={ rows }
				cols={ cols }
				required={ required }
				
				className={ roboto400.className }
				onInput={(ev) =>
				{
					checkValue();

					if (onInput) {
						onInput(ev);
					}
				}}
			/>
			<label htmlFor={ id } className={ hasValue ? style['has-value'] : '' }>
				{ label }{ required ? <span className={ style.required }>*</span> : '' }
			</label>
		</div>
	);
}
