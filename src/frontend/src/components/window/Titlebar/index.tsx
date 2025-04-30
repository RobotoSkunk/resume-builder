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

import style from './titlebar.module.css';

import iconMinimize from '@/assets/icons/window/minimize.svg';
import iconMaximize from '@/assets/icons/window/maximize.svg';
import iconUnmaximize from '@/assets/icons/window/unmaximize.svg';
import iconClose from '@/assets/icons/window/close.svg';


type CallbackBoolean = RobotoSkunk.IPC.CallbackListener<boolean>;


export default function Titlebar()
{
	const [ focused, setFocused ] = useState(true);
	const [ maximized, setMaximized ] = useState(false);

	useEffect(() =>
	{
		const onWindowFocus: CallbackBoolean = (_, isFocused) =>
		{
			setFocused(isFocused);
		};

		const onWindowMaximize: CallbackBoolean = (_, isMaximized) =>
		{
			document.body.setAttribute('maximized', isMaximized ? 'true' : 'false');
			setMaximized(isMaximized);
		};


		window.api.events.onWindowFocus(onWindowFocus);
		window.api.events.onWindowMaximize(onWindowMaximize);

		return () => {
			window.api.events.removeWindowFocus(onWindowFocus);
			window.api.events.removeWindowMaximize(onWindowMaximize);
		};
	}, [ ]);

	return (
		<header
			className={ [
				style.titlebar,
				focused ? style.focused : '',
			].join(' ') }
		>
			<div></div>
			<span className={ style.title }>
				Resume Builder
			</span>
			<div className={ style.actions }>
				<button onClick={ () => window.api.actions.minimize() }>
					<Image
						src={ iconMinimize }
						alt='Minimizar'

						width={ 10 }
					/>
				</button>
				<button onClick={ () => window.api.actions.maximize() }>
					<Image
						src={ maximized ? iconUnmaximize : iconMaximize }
						alt='Maximizar'

						width={ 10 }
					/>
				</button>
				<button onClick={ () => window.api.actions.close() }>
					<Image
						src={ iconClose }
						alt='Cerrar'

						width={ 10 }
					/>
				</button>
			</div>
		</header>
	);
}
