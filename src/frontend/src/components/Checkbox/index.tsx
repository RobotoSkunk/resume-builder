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

import { RefObject, useEffect, useRef, useState } from 'react';

import style from './checkbox.module.css';


export default function Checkbox({
	label,
	name,
	value,
	checked,
}: {
	label: string,
	name: string,
	value: string,
	checked?: boolean,
})
{
	const [ id, setId ] = useState('');
	const [ isChecked, setIsChecked ] = useState(false);

	useEffect(() =>
	{
		setId(crypto.randomUUID());
		setIsChecked(!!checked);
	}, [ checked ]);

	function onChangeHandler(ev: React.ChangeEvent<HTMLInputElement>)
	{
		setIsChecked(ev.currentTarget.checked);
	}


	return (
		<>
			<input
				id={ id }
				name={ name }
				type='checkbox'
				value={ value }

				checked={ checked }
				onChange={ onChangeHandler }

				className={ style.input }
			/>
			<label
				htmlFor={ id }
			>
				<div
					className={[
						style.checkbox,
						isChecked ? style.checked : '',
					].join(' ')}
				></div>
				{ label }
			</label>
		</>
	);
}
