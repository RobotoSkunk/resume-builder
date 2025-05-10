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

import style from './input.module.css';
import { roboto400 } from '@/utils/fonts';


interface Props
{
	label: string;
	name: string;

	value?: string;
	rows?: number;
	cols?: number;
	minLength?: number;
	maxLength?: number;

	disabled?: boolean;
	required?: boolean;
	className?: string;

	onInput?: (ev: React.FormEvent<HTMLTextAreaElement>) => (Promise<void> | void);
};


export default function TextArea(props: Props)
{
	const [ id, setId ] = useState('');

	const inputRef: RefObject<HTMLTextAreaElement | null> = useRef(null);
	const [ hasValue, setHasValue ] = useState(false);

	useEffect(() =>
	{
		setId(crypto.randomUUID());

		checkValue();
	}, [ props.value ]);


	function checkValue()
	{
		if (inputRef.current) {
			setHasValue(inputRef.current.value !== '');
		}
	}

	function onInputHandler(ev: React.ChangeEvent<HTMLTextAreaElement>)
	{
		checkValue();

		const textArea = ev.currentTarget;

		textArea.style.height = 'auto';
		textArea.style.height = textArea.scrollHeight + 'px';

		if (props.onInput) {
			props.onInput(ev);
		}
	}


	return (
		<div className={ style.container }>
			<textarea
				id={ id }
				name={ props.name }
				ref={ inputRef }
				defaultValue={ props.value }

				rows={ props.rows }
				cols={ props.cols }
				minLength={ props.minLength }
				maxLength={ props.maxLength }
				required={ props.required }
				disabled={ props.disabled }

				className={ [
					roboto400.className,
					props.className || '',
				].join(' ') }

				onInput={ onInputHandler }
			/>
			<label htmlFor={ id } className={ hasValue ? style['has-value'] : '' }>
				{ props.label }{ props.required ? <span className={ style.required }>*</span> : '' }
			</label>
		</div>
	);
}
