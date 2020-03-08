module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module"
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended'
    ],
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        "prettier/prettier": 2,
        "eqeqeq": 0,
        // "no-undef": 0,
        "camelcase": 0,
        "no-unused-expressions": 0,
        "no-new": 0,
        "prefer-rest-params": 0,
        // typescript
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/ban-ts-ignore": 0,
        "@typescript-eslint/triple-slash-reference": 0,
        "@typescript-eslint/camelcase": 0,
        "@typescript-eslint/no-this-alias": 0,
        '@typescript-eslint/explicit-function-return-type': [
            // 'warn',
            'off',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
            }
        ]
    },
    globals: {
        MI: "readonly"
    }
};