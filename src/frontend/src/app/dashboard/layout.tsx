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
import { useEffect, useState } from 'react';

import style from './layout.module.css';

import defaultImage from '@/assets/icons/default-user.svg';
import Link from 'next/link';
import { UserDataContext } from './context';



export default function Dashboard({
	children,
}: {
	children: React.ReactNode,
})
{
	const [ userData, setUserData ] = useState<DB.User | null>(null);
	const [ picture, setPicture ] = useState<string | null>(null);

	useEffect(() =>
	{
		(async () =>
		{
			const response = await window.api.fetch<DB.User>('/user/get-info');

			if (response.code === 0) {
				setUserData(response.data as DB.User);
			}
		})();
	}, []);

	useEffect(() =>
	{
		if (!userData) {
			return;
		}

		const pictureBuffer = Buffer.from(userData.picture);

		setPicture(`data:image/png;base64,${pictureBuffer.toString('base64')}`);
	}, [ userData ]);


	function updateUserData(data: DB.User) 
	{
		setUserData(data);
	}


	return (
		<UserDataContext.Provider value={ { data: userData, updateData: updateUserData } }>
			<div className={ style.sidebar }>
				<Image
					src={ picture ? picture : defaultImage }
					alt=''
					className={ style.picture }
					width={ 180 }
					height={ 180 }
				/>
				<b className={ style.fullname }>
					{ userData ? userData.firstname : '...' } { userData?.lastname }
				</b>
				<nav className={ style.sections }>
					<Link href='home'>Inicio</Link>
					<Link className={ picture ? '' : style.disabled } href='education'>Educación</Link>
					<Link className={ picture ? '' : style.disabled } href='experience'>Experiencia</Link>
					<Link className={ picture ? '' : style.disabled } href='courses'>Cursos</Link>
					<Link className={ picture ? '' : style.disabled } href='achievements'>Logros</Link>
					<Link className={ picture ? '' : style.disabled } href='certifications'>Certificaciones</Link>
					<Link className={ picture ? '' : style.disabled } href='projects'>Proyectos</Link>
				</nav>
			</div>
			<div className={ style.content }>
				{ children }
			</div>
		</UserDataContext.Provider>
	);
}
