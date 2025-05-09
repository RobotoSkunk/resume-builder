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
import { useContext, useEffect, useRef, useState } from 'react';
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


async function fetchJobTitles(userId: string): Promise<DB.JobTitle[]>
{
	const result = await window.api.fetch<DB.JobTitle[]>(`/user/${userId}/job-title/list-all`);

	if (result.data) {
		return result.data;
	}

	return [];
}


function JobTitleEntry({
	userId,
	data,
	updateData,
	onDeleteEntry,
	onCancelEntry,
}: {
	userId: string,
	data?: DB.JobTitle,
	updateData: (data: DB.JobTitle[]) => void,
	onDeleteEntry?: (id: string) => void,
	onCancelEntry?: () => void,
})
{
	const formRef = useRef<HTMLFormElement | null>(null);

	const [ timeoutId, setTimeoutId ] = useState<NodeJS.Timeout | null>(null);
	const [ dataToUpdate, setDataToUpdate ] = useState<Partial<DB.Address>>({ });

	function cancelEntry()
	{
		if (formRef.current) {
			formRef.current.reset();
		}

		if (onCancelEntry) {
			onCancelEntry();
		}
	}

	async function onSubmitHandler(ev: React.FormEvent<HTMLFormElement>)
	{
		const form = ev.currentTarget;

		ev.preventDefault();

		if (!form.checkValidity()) {
			form.reportValidity();
		}

		const formData = new FormData(form);

		const data: { [ key: string ]: unknown } = {};
		formData.forEach((value, key) => data[key] = value);

		const response = await window.api.fetch<DB.User>(`/user/${userId}/job-title/create`, data);

		if (response.code !== 0) {
			alert(response.message);
		} else {
			updateData(
				await fetchJobTitles(userId)
			);

			cancelEntry();
		}
	}

	async function deleteEntry()
	{
		if (!data || !onDeleteEntry) {
			return;
		}

		const result = confirm('¿Seguro que deseas eliminar esta dirección?');

		if (!result) {
			return;
		}

		if (formRef.current) {
			const response = await window.api.fetch(`/user/job-title/remove/${data.id}`);

			if (response.code === 0) {
				onDeleteEntry(data.id);
			}
		}
	}

	async function onInputChange(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>)
	{
		if (!data) {
			return;
		}

		const input = ev.currentTarget;

		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		setDataToUpdate({
			...dataToUpdate,
			[ input.name ]: input.value,
		});


		setTimeoutId(
			setTimeout(() =>
			{
				(async () =>
				{
					const response = await window.api.fetch(`/user/job-title/${data.id}/update`, {
						...dataToUpdate,
						[ input.name ]: input.value,
					});

					if (response.code !== 0) {
						alert(response.message);
					} else {
						setDataToUpdate({ });
					}
				})();

				setTimeoutId(null);
			}, 500)
		);
	}

	return (
		<form
			ref={ formRef }
			className={ style.entry }

			onSubmit={ onSubmitHandler }
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
						onClick={ deleteEntry }
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
					label='Nombre del título'
					value={ data?.name }
					onInput={ onInputChange }
					required
				/>
				<TextArea
					name='description'
					label='Descripción'
					rows={ 3 }
					maxLength={ 250 }
					value={ data?.description }
					onInput={ onInputChange }
					required
				/>
			</div>
		</form>
	);
}


export default function Page()
{
	const userContext = useContext(UserDataContext);
	const userData = userContext.data;

	const [ addRow, setAddRow ] = useState(false);
	const [ loaded, setLoaded ] = useState(false);
	const [ jobTitles, setJobTitles ] = useState<DB.JobTitle[]>([]);

	function updateData(data: DB.JobTitle[])
	{
		setJobTitles(data);
		userContext.fetchJobTitlesCount();
	}


	useEffect(() =>
	{
		if (!userData) {
			return;
		}

		(async () =>
		{
			setJobTitles(
				await fetchJobTitles(userData.id)
			);

			setLoaded(true);
		})();
	}, [ ]);


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
		loaded && <LayoutGroup>
			<AnimatePresence mode='popLayout' initial={ false }>
				{ jobTitles.map((jobTitle) =>
					<JobTitleEntry
						userId={ userData?.id || '' }
						updateData={ updateData }
						data={ jobTitle }
						key={ jobTitle.id }

						onDeleteEntry={(id) =>
						{
							const addressesList = [ ...jobTitles ];
							const i = addressesList.findIndex((a) => a.id === id);

							if (i > -1) {
								addressesList.splice(i, 1);
								setJobTitles(addressesList);
							}

							userContext.fetchJobTitlesCount();
						}}
					/>
				) }


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
							updateData={ updateData }
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
