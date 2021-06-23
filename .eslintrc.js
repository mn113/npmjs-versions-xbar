module.exports = {
    'env': {
        'commonjs': true,
        'node': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'globals': {},
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'block-scoped-var': 'error',
        'complexity': 'error',
        'consistent-this': 'error',
        'curly': [
            'warn',
            'multi-line'
        ],
        'default-case': 'warn',
        'dot-location': [
            'error',
            'property'
        ],
        'dot-notation': 'error',
        'eol-last': 'error',
        'eqeqeq': 'error',
        'func-call-spacing': 'error',
        'id-match': 'error',
        'indent': 'warn',
        'key-spacing': 'warn',
        'keyword-spacing': 'error',
        'linebreak-style': [
            'error',
            'unix'
        ],
        'max-depth': 'warn',
        'max-lines-per-function': 'warn',
        'max-params': ['warn', 4],
        'new-cap': 'error',
        'new-parens': 'error',
        'no-alert': 'error',
        'no-array-constructor': 'error',
        'no-await-in-loop': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-confusing-arrow': 'error',
        'no-continue': 'error',
        'no-div-regex': 'error',
        'no-duplicate-imports': 'error',
        'no-empty-function': 'error',
        'no-eq-null': 'error',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-extra-label': 'error',
        'no-floating-decimal': 'error',
        'no-implicit-coercion': 'error',
        'no-implicit-globals': 'error',
        'no-invalid-this': 'error',
        'no-iterator': 'error',
        'no-label-var': 'error',
        'no-labels': 'error',
        'no-lone-blocks': 'error',
        'no-lonely-if': 'error',
        'no-loop-func': 'error',
        'no-multi-assign': 'error',
        'no-multi-str': 'error',
        'no-nested-ternary': 'warn',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-object': 'error',
        'no-new-wrappers': 'error',
        'no-octal-escape': 'error',
        'no-proto': 'error',
        'no-restricted-globals': 'error',
        'no-restricted-imports': 'error',
        'no-restricted-properties': 'error',
        'no-restricted-syntax': 'error',
        'no-return-assign': 'error',
        'no-script-url': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-shadow': 'error',
        'no-shadow-restricted-names': 'error',
        'no-tabs': 'warn',
        'no-template-curly-in-string': 'error',
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': 'warn',
        'no-unused-expressions': 'warn',
        'no-unused-vars': 'warn',
        'no-use-before-define': 'error',
        'no-useless-call': 'error',
        'no-useless-catch': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'error',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'no-var': 'error',
        'no-whitespace-before-property': 'error',
        'no-with': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-const': 'error',
        'prefer-named-capture-group': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'quotes': ['error', 'single'],
        'radix': 'error',
        'require-await': 'error',
        'rest-spread-spacing': [
            'error',
            'never'
        ],
        'semi': 'error',
        'semi-spacing': 'error',
        'semi-style': [
            'error',
            'last'
        ],
        'strict': [
            'error',
            'never'
        ],
        'vars-on-top': 'error'
    }
};
