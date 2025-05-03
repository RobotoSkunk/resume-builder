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

import defaultImage from '@/assets/icons/default-user.svg';


type UserData = {
	id: string;
	firstname: string;
	lastname: string;
	picture: string;
};


export default function Home()
{
	const [ picture, setPicture ] = useState<string | null>(null);

	useEffect(() =>
	{
		(async () =>
		{
			const response = await window.api.fetch<UserData | undefined>('/user/get-info');

			if (!response.data) {
				location.href = '/user-data';
				return;
			}

			setPicture(response.data.picture);
		})();
	}, []);

	return (
		<>
			<Image
				src={ picture ? picture : defaultImage }
				alt=''
				width={ 512 }
				height={ 512 }
			/>
		</>
	);
}
