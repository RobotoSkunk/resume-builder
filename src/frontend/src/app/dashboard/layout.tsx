/*
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
 */

'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import style from './layout.module.css';

import defaultImage from '@/assets/icons/default-user.svg';
import Link from 'next/link';


type UserData = {
	id: string;
	firstname: string;
	lastname: string;
	picture: Uint8Array;
};


export default function Dashboard({
	children,
}: {
	children: React.ReactNode,
})
{
	const [ firstname, setFirstname ] = useState<string>('');
	const [ lastname, setLastname ] = useState<string>('');
	const [ picture, setPicture ] = useState<string | null>(null);

	useEffect(() =>
	{
		(async () =>
		{
			const response = await window.api.fetch<UserData>('/user/get-info');
			const data = response.data as UserData;

			const pictureBuffer = Buffer.from(data.picture);

			setFirstname(data.firstname);
			setLastname(data.lastname);
			setPicture(`data:image/png;base64,${pictureBuffer.toString('base64')}`);
		})();
	}, []);

	return (
		<>
			<div className={ style.sidebar }>
				<Image
					src={ picture ? picture : defaultImage }
					alt=''
					className={ style.picture }
					width={ 180 }
					height={ 180 }
				/>
				<b className={ style.fullname }>{ firstname } { lastname }</b>
				<Link href='#'>AAAAA</Link>
				<Link href='#'>AAAAA</Link>
				<Link href='#'>AAAAA</Link>
				<Link href='#'>AAAAA</Link>
				<Link href='#'>AAAAA</Link>
			</div>
			<div className={ style.content }>
				{ children }
			</div>
		</>
	);
}
