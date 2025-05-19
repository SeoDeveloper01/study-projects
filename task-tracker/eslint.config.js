import globals from 'globals';
import jsEslint from '@eslint/js';
import tsEslint from 'typescript-eslint';

export default tsEslint.config([
	{
		name: 'common-config',
		files: ['**/*.{js,ts}'],
		plugins: { js: jsEslint, ts: tsEslint.plugin },
		extends: [jsEslint.configs.recommended, tsEslint.configs.strictTypeChecked, tsEslint.configs.stylisticTypeChecked],
		linterOptions: { noInlineConfig: true },
		languageOptions: {
			globals: globals.node,
			parser: tsEslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		name: 'testing-config',
		languageOptions: { globals: globals.jest }
		// TODO: complete after Jest install
	}
]);
