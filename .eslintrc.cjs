/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-ts/eslint-recommended',
    '@vue/eslint-config-typescript/recommended'
    // '@vue/eslint-config-prettier'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    // "no-unused-variable": [true, { "ignore-pattern": "^_" }],
    'vue/no-unused-vars': 'off',
    'vue/html-indent': 'off',
    'vue/attributes-order': 'off',
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/require-valid-default-prop': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/component-definition-name-casing': 'off',
    'vue/html-self-closing': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'no-async-promise-executor': 'off',
    'no-constant-condition': 'off',
    'no-unused-variable': 'off',
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    'no-redeclare': 'off',
    'no-useless-catch': 'off',
    'no-empty': 'off',
    'no-empty-function': 'off',
    'prefer-rest-params': 'off'
  }
}
