/*
 * robotoskunk.com front client. The frontend part of robotoskunk.com
 * Copyright (C) 2024  Edgar Lima (RobotoSkunk)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { NextRequest, NextResponse } from 'next/server';


export const config = {
	matcher: [
		{
			source: '/((?!assets|_next/static|_next/image|favicon.ico).*)',
			missing: [
				{ type: 'header', key: 'next-router-prefetch' },
				{ type: 'header', key: 'purpose', value: 'prefetch' },
			],
		},
	],
}


export function middleware(request: NextRequest)
{
	const allowInsecure = process.env.NODE_ENV !== 'production';
	const nonce = Buffer.from(crypto.getRandomValues(new Uint32Array(32))).toString('base64url');

	const csp = [
		`default-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${ allowInsecure ? "'unsafe-eval'" : '' };`,
		`style-src 'self' 'unsafe-inline';`,
		`img-src 'self' blob: data:;`,
		`font-src 'self';`,
		`object-src 'none';`,
		`base-uri 'self';`,
		`form-action 'self';`,
		`frame-ancestors 'none';`,
		allowInsecure ? '' : 'upgrade-insecure-requests;',
	];


	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('X-Nonce', nonce);


	const response = NextResponse.next({
		request: {
			headers: requestHeaders
		}
	});

	response.headers.set('Content-Security-Policy',   csp.join(' '));
	response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains;');
	response.headers.set('X-Frame-Options',           'sameorigin');
	response.headers.set('Referrer-Policy',           'strict-origin-when-cross-origin');
	response.headers.set('Feature-Policy',            "microphone 'none'; geolocation 'none'; camera 'none';");
	response.headers.set('Keep-Alive',                'timeout=5');


	return response;
}
