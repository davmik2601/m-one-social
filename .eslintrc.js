module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'unused-imports',
    'simple-import-sort'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'unused-imports/no-unused-imports': 'error',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
  overrides: [
    {
      files: ['*.ts',  "*.js"],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              ['^@nestjs/', '^@?\\w'],
              [
                '^(@Src)(/.*|$)',
                '^(@Common)(/.*|$)',
                '^(@Config)(/.*|$)',
                '^(@Database)(/.*|$)',
                '^(@Decorators)(/.*|$)',
                '^(@Filters)(/.*|$)',
                '^(@Guards)(/.*|$)',
                '^(@Helpers)(/.*|$)',
                '^(@Modules)(/.*|$)',
              ],
              [
                '^\\.\\.(?!/?$)',
                '^\\.\\./?$',
                '^\\./(?=.*/)(?!/?$)',
                '^\\.(?!/?$)',
                '^\\./?$',
              ],
            ],
          },
        ],
      },
    },
  ],
};
