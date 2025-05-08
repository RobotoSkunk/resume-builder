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
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import FrozenRouter from '@/components/form/FrozenRouter';

import style from './layout.module.css';
import { UserDataContext } from '../context';
import { useContext } from 'react';



export default function Dashboard({
	children,
}: {
	children: React.ReactNode,
})
{
	const userData = useContext(UserDataContext).data;
	const key = usePathname();

	const links = [
		{
			href: '/dashboard/home',
			label: 'Principal',
			disabled: false,
		},
		{
			href: '/dashboard/home/titles',
			label: 'Títulos profesionales',
			disabled: !userData,
		},
		{
			href: '/dashboard/home/addresses',
			label: 'Direcciones',
			disabled: !userData,
		},
		{
			href: '/dashboard/home/contact',
			label: 'Contacto',
			disabled: !userData,
		},
		{
			href: '/dashboard/home/languages',
			label: 'Idiomas',
			disabled: !userData,
		},
	];


	return (
		<>
			<div className={ style.navigator }>
				{ links.map((link, index) =>
				(
					<Link href={ link.href } key={ index } className={ link.disabled ? style.disabled : '' }>
						{ link.label }
						{ link.href === key &&
							<motion.div
								layoutId='link-underline'
							></motion.div>
						}
					</Link>
				))}
			</div>

			<AnimatePresence mode='popLayout'>
				<motion.div
					key={ key }

					initial={{ x: 20, opacity: 0 }}
					exit={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}

					className={ style.content }
				>
					<FrozenRouter>{ children }</FrozenRouter>
				</motion.div>
			</AnimatePresence>
		</>
	);
}
