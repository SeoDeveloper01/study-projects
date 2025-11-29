import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		name: 'common-config',
		files: ['./*.{js,ts}', '{src,apps,libs}/**/*.ts'],
		ignores: ['eslint.config.js'],
		plugins: { js: eslint, ts: tseslint.plugin },
		extends: [eslint.configs.recommended, tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
		linterOptions: { noInlineConfig: true },
		languageOptions: {
			globals: globals.nodeBuiltin,
			parser: tseslint.parser,
			sourceType: 'module',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			'array-callback-return': ['error', { checkForEach: true }],
			'no-await-in-loop': 'warn',
			'no-duplicate-imports': ['error', { includeExports: true }],
			'no-promise-executor-return': 'error',
			'no-self-compare': 'error',
			'no-unmodified-loop-condition': 'error',
			'no-unreachable-loop': 'error',
			'no-useless-assignment': 'error',
			'require-atomic-updates': 'error',
			'camelcase': 'error',
			'eqeqeq': 'error',
			'id-length': ['warn', { min: 2, max: 32 }],
			'logical-assignment-operators': ['error', 'always', { enforceForIfStatements: true }],
			'max-classes-per-file': 'error',
			'max-depth': ['error', { max: 4 }],
			'no-alert': 'error',
			'no-console': 'error',
			'no-else-return': 'error',
			'no-extra-label': 'error',
			'no-label-var': 'error',
			'no-lone-blocks': 'error',
			'no-lonely-if': 'error',
			'no-new': 'error',
			'no-return-assign': 'error',
			'no-sequences': 'error',
			'no-undef-init': 'error',
			'no-unneeded-ternary': ['error', { defaultAssignment: false }],
			'no-useless-computed-key': 'error',
			'no-useless-concat': 'error',
			'no-useless-rename': 'error',
			'no-useless-return': 'error',
			'operator-assignment': 'error',
			'prefer-arrow-callback': 'error',
			'prefer-const': 'error',
			'prefer-exponentiation-operator': 'error',
			'prefer-numeric-literals': 'error',
			'prefer-rest-params': 'error',
			'strict': 'error',
			'yoda': 'error',
			'@typescript-eslint/consistent-type-exports': ['error', { fixMixedExportsWithInlineTypeSpecifier: true }],
			'@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
			'@typescript-eslint/default-param-last': 'error',
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/explicit-member-accessibility': 'error',
			'@typescript-eslint/explicit-module-boundary-types': 'error',
			'@typescript-eslint/method-signature-style': 'error',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/no-loop-func': 'error',
			'@typescript-eslint/no-shadow': ['error', { builtinGlobals: true }],
			'@typescript-eslint/no-unsafe-type-assertion': 'warn',
			'@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
			'@typescript-eslint/no-use-before-define': 'error',
			'@typescript-eslint/no-useless-empty-export': 'error',
			'@typescript-eslint/parameter-properties': 'error',
			'@typescript-eslint/prefer-readonly': 'error',
			'@typescript-eslint/promise-function-async': ['error']
		}
	}
]);
