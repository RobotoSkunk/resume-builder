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
import { AnimatePresence, motion } from 'framer-motion';

import FrozenRouter from '@/components/FrozenRouter';

import style from './layout.module.css';
import { usePathname } from 'next/navigation';



export default function Dashboard({
	children,
}: {
	children: React.ReactNode,
})
{
	const key = usePathname();

	return (
		<>
			<div className={ style.navigator }>
				<Link href='/dashboard/home'>
					<b>Principal</b>
				</Link>
				<Link href='/dashboard/home/directions'>
					<b>Direcciones</b>
				</Link>
				<Link href='/dashboard/home/contact'>
					<b>Contacto</b>
				</Link>
				<Link href='/dashboard/home/languages'>
					<b>Idiomas</b>
				</Link>
				<Link href='/dashboard/home/titles'>
					<b>Títulos profesionales</b>
				</Link>
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
