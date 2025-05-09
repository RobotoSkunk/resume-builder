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

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

import style from './layout.module.css';

import { UserDataContext } from './context';

import defaultImage from '@/assets/icons/default-user.svg';



export default function Dashboard({
	children,
}: {
	children: React.ReactNode,
})
{
	const pathname = usePathname();
	const [ key, setKey ] = useState('');

	const [ userData, setUserData ] = useState<DB.User | null>(null);
	const [ picture, setPicture ] = useState<string | null>(null);

	const [ jobTitlesCount, setJobTitlesCount ] = useState(0);


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

		fetchJobTitlesCount();
	}, [ userData ]);

	useEffect(() =>
	{

		const pathParts = pathname.split('/').filter(v => v !== '');

		setKey(`/${pathParts[0]}/${pathParts[1]}`);
	}, [ pathname ]);


	const links = [
		{
			label: 'Inicio',
			href: '/dashboard/home',
			disabled: false,
		},
		{
			label: 'Educación',
			href: '/dashboard/education',
			disabled: !userData || jobTitlesCount === 0,
		},
		{
			label: 'Experiencia',
			href: '/dashboard/experience',
			disabled: !userData || jobTitlesCount === 0,
		},
		{
			label: 'Cursos',
			href: '/dashboard/courses',
			disabled: !userData || jobTitlesCount === 0,
		},
		{
			label: 'Logros',
			href: '/dashboard/achievements',
			disabled: !userData || jobTitlesCount === 0,
		},
		{
			label: 'Certificaciones',
			href: '/dashboard/certifications',
			disabled: !userData || jobTitlesCount === 0,
		},
		{
			label: 'Proyectos',
			href: '/dashboard/projects',
			disabled: !userData || jobTitlesCount === 0,
		},
	];

	function updateUserData(data: DB.User) 
	{
		setUserData(data);
	}

	function fetchJobTitlesCount()
	{
		if (!userData) {
			setJobTitlesCount(0);
			return;
		}

		(async () =>
		{
			const response = await window.api.fetch<number>(`/user/${userData.id}/job-title/count`);

			if (response.code === 0) {
				setJobTitlesCount(response.data || 0);
			}
		})();
	}


	return (
		<UserDataContext.Provider
			value={{
				data: userData,
				updateData: updateUserData,
				fetchJobTitlesCount,
			}}
		>
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
					{ links.map((link, index) => (
						<Link
							className={ link.disabled ? style.disabled : '' }
							href={ link.href }
							key={ index }
						>
							{ link.href === key &&
								<motion.div
									layoutId='nav-indicator'
								></motion.div>
							}
							{ link.label }
						</Link>
					)) }
				</nav>
			</div>
			<motion.div
				key={ key }

				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}

				className={ style.content }
			>
				{ children }
			</motion.div>
		</UserDataContext.Provider>
	);
}
