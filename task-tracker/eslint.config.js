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
		},
		rules: {
			'array-callback-return': [2, { checkForEach: true }],
			'no-await-in-loop': 1,
			'no-constructor-return': 2,
			'no-duplicate-imports': [2, { includeExports: true }],
			'no-promise-executor-return': 2,
			'no-self-compare': 2,
			'no-unmodified-loop-condition': 2,
			'no-unreachable-loop': 2,
			'no-useless-assignment': 2,
			'require-atomic-updates': 2,
			'camelcase': 2,
			'eqeqeq': 2,
			'id-length': [1, { min: 2, max: 32 }],
			'logical-assignment-operators': [2, 'always', { enforceForIfStatements: true }],
			'max-classes-per-file': 2,
			'max-depth': [2, 4],
			'no-alert': 2,
			'no-else-return': 2,
			'no-extra-label': 2,
			'no-label-var': 2,
			'no-lone-blocks': 2,
			'no-lonely-if': 2,
			'no-new': 2,
			'no-return-assign': 2,
			'no-sequences': 2,
			'no-undef-init': 2,
			'no-unneeded-ternary': [2, { defaultAssignment: false }],
			'no-useless-computed-key': 2,
			'no-useless-concat': 2,
			'no-useless-rename': 2,
			'no-useless-return': 2,
			'operator-assignment': 2,
			'prefer-arrow-callback': 2,
			'prefer-const': 2,
			'prefer-exponentiation-operator': 2,
			'prefer-numeric-literals': 2,
			'prefer-rest-params': 2,
			'strict': 2,
			'yoda': 2,
			'@typescript-eslint/consistent-type-exports': [2, { fixMixedExportsWithInlineTypeSpecifier: true }],
			'@typescript-eslint/consistent-type-imports': [2, { fixStyle: 'inline-type-imports' }],
			'@typescript-eslint/default-param-last': 2,
			'@typescript-eslint/explicit-function-return-type': 2,
			'@typescript-eslint/explicit-member-accessibility': 2,
			'@typescript-eslint/explicit-module-boundary-types': 2,
			'@typescript-eslint/method-signature-style': 2,
			'@typescript-eslint/no-import-type-side-effects': 2,
			'@typescript-eslint/no-loop-func': 2,
			'@typescript-eslint/no-magic-numbers': 2,
			'@typescript-eslint/no-shadow': [2, { builtinGlobals: true }],
			'@typescript-eslint/no-unnecessary-type-conversion': 2,
			'@typescript-eslint/no-unsafe-type-assertion': 2,
			'@typescript-eslint/no-unused-expressions': [2, { allowTernary: true }],
			'@typescript-eslint/no-use-before-define': 2,
			'@typescript-eslint/no-useless-empty-export': 2,
			'@typescript-eslint/parameter-properties': 2,
			'@typescript-eslint/prefer-readonly': 2,
			'@typescript-eslint/promise-function-async': [2, { allowAny: false }]
		}
	},
	{
		name: 'testing-config',
		languageOptions: { globals: globals.jest }
		// TODO: complete after Jest install
	}
]);
