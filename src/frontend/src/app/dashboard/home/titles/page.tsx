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
import { useContext, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, Variants } from 'framer-motion';

import Input from '@/components/form/Input';
import TextArea from '@/components/form/TextArea';

import { UserDataContext } from '../../context';

import layoutStyle from '../layout.module.css';
import style from './page.module.css';

import cancelImage from '@/assets/icons/cancel.svg';
import acceptImage from '@/assets/icons/check.svg';
import deleteImage from '@/assets/icons/trash.svg';
import addImage from '@/assets/icons/add.svg';


function JobTitleEntry({
	userId,
	data,
	updateData,
	onDeleteEntry,
	onCancelEntry,
}: {
	userId: string,
	data?: DB.JobTitle,
	updateData?: (data: DB.JobTitle[]) => void,
	onDeleteEntry?: (id: string) => void,
	onCancelEntry?: () => void,
})
{
	const formRef = useRef<HTMLFormElement | null>(null);

	function cancelEntry()
	{
		if (formRef.current) {
			formRef.current.reset();
		}

		if (onCancelEntry) {
			onCancelEntry();
		}
	}


	return (
		<form
			ref={ formRef }
			className={ style.entry }
		>
			<input type='hidden' name='user_id' value={ userId }/>

			<div className={ style.controls }>
				{ data ?
					<button
						className={ [
							layoutStyle['action-button'],
							layoutStyle.danger,
						].join(' ') }
						type='button'
						// disabled={ !!timeoutId }
						// onClick={ deleteEntry }
					>
						<Image
							src={ deleteImage }
							alt=''
						/>
					</button>
					:
					<>
						<button
							className={ [
								layoutStyle['action-button'],
								layoutStyle.success,
							].join(' ') }
						>
							<Image
								src={ acceptImage }
								alt=''
							/>
						</button>
						<button
							className={ [
								layoutStyle['action-button'],
								layoutStyle.danger,
							].join(' ') }
							type='button'
							onClick={ cancelEntry }
						>
							<Image
								src={ cancelImage }
								alt=''
							/>
						</button>
					</>
				}
			</div>

			<div>
				<Input
					type='text'
					name='name'
					label='Título'
					required
				/>
				<TextArea
					name='description'
					label='Descripción'
					rows={ 3 }
					maxLength={ 250 }
					required
				/>
			</div>
		</form>
	);
}


export default function Page()
{
	const userData = useContext(UserDataContext).data;

	const [ addRow, setAddRow ] = useState(false);


	const variants = {
		hide: {
			y: 30,
			opacity: 0,
			transition: {
				duration: 0.1,
			}
		},
		show: {
			y: 0,
			opacity: 1,
		},
	} satisfies Variants;

	return (
		<LayoutGroup>
			<AnimatePresence mode='popLayout' initial={ false }>
				<JobTitleEntry key={ 1 } userId={ userData?.id || '' }/>

				{ addRow ?
					<motion.div
						key='new-entry'

						initial='hide'
						animate='show'
						exit='hide'

						layout
						variants={ variants }
					>
						<JobTitleEntry
							userId={ userData?.id || '' }
							onCancelEntry={ () => setAddRow(false) }
						/>
					</motion.div>
					:
					<motion.div
						key='add-button'

						initial='hide'
						animate='show'
						exit='hide'

						layout
						variants={ variants }

						className={ style['add-row'] }
					>
						<button className={ layoutStyle['add-button'] } onClick={ () => setAddRow(true) }>
							<Image
								src={ addImage }
								alt='Agregar nuevo título profesional'
							/>
						</button>
					</motion.div>
				}
			</AnimatePresence>
		</LayoutGroup>
	);
}
