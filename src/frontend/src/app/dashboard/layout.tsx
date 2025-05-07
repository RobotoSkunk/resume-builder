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
import { AnimatePresence, motion } from 'framer-motion';

import style from './layout.module.css';

import { UserDataContext } from './context';

import defaultImage from '@/assets/icons/default-user.svg';
import FrozenRouter from '@/components/FrozenRouter';



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

	useEffect(() =>
	{
		setKey(pathname.split('/')[2]);
	}, [ pathname ]);


	const links = [
		{
			label: 'Inicio',
			href: 'home',
			disabled: false,
		},
		{
			label: 'Educación',
			href: 'education',
			disabled: !userData,
		},
		{
			label: 'Experiencia',
			href: 'experience',
			disabled: !userData,
		},
		{
			label: 'Cursos',
			href: 'courses',
			disabled: !userData,
		},
		{
			label: 'Logros',
			href: 'achievements',
			disabled: !userData,
		},
		{
			label: 'Certificaciones',
			href: 'certifications',
			disabled: !userData,
		},
		{
			label: 'Proyectos',
			href: 'projects',
			disabled: !userData,
		},
	];

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
