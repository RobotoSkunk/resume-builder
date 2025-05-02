import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import electronConfig from '@electron-toolkit/eslint-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	electronConfig,
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	...compat.config({
		extends: [ 'next' ],
		settings: {
			next: {
				rootDir: 'src/frontend',
			}
		}
	}),
];

export default eslintConfig;
