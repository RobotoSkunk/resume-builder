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

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { useContext, useEffect, useRef, useState, type FormEvent } from 'react';

import { UserDataContext } from '@/app/dashboard/context';

import style from './entry.module.css';

import Input from '@/components/form/Input';
import Checkbox from '@/components/form/Checkbox';

import cancelImage from '@/assets/icons/cancel.svg';
import acceptImage from '@/assets/icons/check.svg';
import deleteImage from '@/assets/icons/trash.svg';
import TextArea from '../form/TextArea';


// #region Tipos de entradas
interface FieldBase
{
	name: string;
	value?: string;
	label: string;
	required?: boolean;
	className?: string;
}

interface TextAreaField extends FieldBase
{
	type: 'textarea';

	rows?: number;
	cols?: number;
	minLength?: number;
	maxLength?: number;
};

interface InputField extends FieldBase
{
	type: 'text' | 'number' | 'date' | 'url';

	min?: number;
	max?: number;
};


type Field = TextAreaField | InputField;
// #endregion

// #region Tipos de propiedades
interface PropsBase
{
	fields: Field[];
	actionsConfig?: {
		checkbox?: (
			{
				enable: false;
			} | {
				enable: true;
				value: boolean;
				handler: (event: React.ChangeEvent<HTMLInputElement>) => (Promise<void> | void);
			}
		)
	};
}

interface TemplateProps<T> extends PropsBase
{
	/**
	 * Si es verdadero, la entrada será usada como plantilla para crear nuevas entradas.
	 */
	isTemplate: true;

	/**
	 * Se llama cuando se presiona el botón para subir la plantilla.
	 * @returns Si es verdadero, se llamará a la función `onCancel()` al finalizar.
	 */
	onSubmit: (dataToSend: T) => Promise<boolean>;

	/**
	 * Se llama cuando se cancela la subida de la plantilla.
	 */
	onCancel: () => void;
}


interface EntryProps<T> extends PropsBase
{
	/**
	 * Si es verdadero, la entrada será usada como plantilla para crear nuevas entradas.
	 */
	isTemplate: false;

	/**
	 * La pregunta que se le realizará al usuario cuando intente eliminar una entrada.
	 */
	deleteQuestion: string;

	/**
	 * Se llama a la función cuando se actualizan los datos de la entrada y están listos para subirse.
	 * @returns Si es verdadero, la actualización de los datos ha sido un éxito y la caché de datos actualizados será
	 * reiniciada.
	 */
	onUpdateData: (dataToSend: Partial<T>) => Promise<boolean>;

	/**
	 * Se llama cuando se presiona el botón para eliminar la entrada.
	 */
	onDelete: () => Promise<void>;
}


type Props<T> = TemplateProps<T> | EntryProps<T>;
// #endregion



export default function FormEntry<T>(props: Props<T>)
{
	const userData = useContext(UserDataContext).data;
	const formRef = useRef<HTMLFormElement | null>(null);

	const [ isBusy, setIsBusy ] = useState(false);

	const [ timeoutId, setTimeoutId ] = useState<NodeJS.Timeout | null>(null);
	const [ dataToUpdate, setDataToUpdate ] = useState<Partial<T>>({ });


	// #region Funciones de plantilla
	async function onSubmitHandler(ev: FormEvent<HTMLFormElement>)
	{
		if (!props.isTemplate) {
			return;
		}

		const form = ev.currentTarget;

		ev.preventDefault();

		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		const formData = new FormData(form);

		const dataToSend: { [ key: string ]: FormDataEntryValue } = {};
		formData.forEach((value, key) => dataToSend[key] = value);

		setIsBusy(true);

		const success = await props.onSubmit(dataToSend as T);

		setIsBusy(false);

		if (success) {
			onCancelHandler();
		}
	}

	function onCancelHandler()
	{
		if (!props.isTemplate) {
			return;
		}

		if (formRef.current) {
			formRef.current.reset();
		}

		props.onCancel();
	}
	// #endregion


	// #region Funciones de entrada
	async function onDeleteHandler()
	{
		if (props.isTemplate) {
			return;
		}

		const success = confirm(props.deleteQuestion);

		if (!success) {
			return;
		}

		await props.onDelete();
	}

	async function onInputChange(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>)
	{
		if (props.isTemplate || !formRef.current) {
			return;
		}

		const input = ev.currentTarget;
		const form = formRef.current;

		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}


		function prepareValue()
		{
			if (input.type === 'number') {
				return Number(input.value);
			}

			return input.value;
		}


		setDataToUpdate({
			...dataToUpdate,
			[ input.name ]: prepareValue(),
		});


		setTimeoutId(
			setTimeout(() =>
			{
				(async () =>
				{
					const dataToSend = {
						...dataToUpdate,
						[ input.name ]: prepareValue(),
					};

					setIsBusy(true);

					const success = await props.onUpdateData(dataToSend);

					setIsBusy(false);

					if (success) {
						setDataToUpdate({ });
					}
				})();

				setTimeoutId(null);
			}, 500)
		);
	}
	// #endregion

	const variants = {
		hide: {
			x: 100,
			opacity: 0,
			transition: {
				duration: 0.2,
			}
		},
		show: {
			x: 0,
			opacity: 1,
			transition: {
				duration: 0.4,
				type: 'spring',
			}
		},
	} satisfies Variants;


	return (
		<motion.form
			ref={ formRef }
			className={ style.entry }
			onSubmit={ onSubmitHandler }

			initial='hide'
			animate='show'
			exit='hide'

			layout
			variants={ props.isTemplate ? variants : undefined }
		>
			{ userData && <input type='hidden' name='user_id' value={ userData.id }/> }

			<div className={ style.controls }>
				{ props.actionsConfig?.checkbox?.enable && 
					<div>
						<Checkbox
							label='Activo'
							name=''
							value=''
							checked={ props.actionsConfig.checkbox.value }
							disabled={ isBusy }
							onChange={ props.actionsConfig.checkbox.handler }
						/>
					</div>
				}

				<div className={ style.actions }>
					{ props.isTemplate ?
						<button
							className={ style.danger }

							type='button'
							disabled={ isBusy }
							onClick={ onDeleteHandler }
						>
							<Image
								src={ deleteImage }
								alt=''
							/>
						</button>
						:
						<>
							<button
								className={ style.success }
								disabled={ isBusy }
							>
								<Image
									src={ acceptImage }
									alt=''
								/>
							</button>
							<button
								className={ style.danger }
								disabled={ isBusy }

								type='button'
								onClick={ onCancelHandler }
							>
								<Image
									src={ cancelImage }
									alt=''
								/>
							</button>
						</>
					}
				</div>
			</div>

			<div className={ style.fields }>
				{ props.fields.map((field) => ( field.type === 'textarea' ?
					<TextArea
						name={ field.name }
						label={ field.label }
						value={ field.value }

						required={ field.required }
						className={ field.className }

						disabled={ isBusy }
						onInput={ onInputChange }

						rows={ field.rows }
						cols={ field.cols }
						minLength={ field.minLength }
						maxLength={ field.maxLength }
					/>
					:
					<Input
						type={ field.type }
						name={ field.name }
						label={ field.label }
						value={ field.value }

						required={ field.required }
						className={ field.className }

						disabled={ isBusy }
						onInput={ onInputChange }

						min={ field.min }
						max={ field.max }
					/>
				)) }
			</div>
		</motion.form>
	);
}
