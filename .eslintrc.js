module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true
        },
        sourceType: "module"
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'prettier/react'
    ],
    plugins: ['@typescript-eslint', 'react', 'prettier'],
    rules: {
        "prettier/prettier": 2,
        "react/prop-types": 0,
        "react/display-name": 0,
        "eqeqeq": 0,
        // "no-undef": 0,
        "camelcase": 0,
        "no-unused-expressions": 0,
        "no-new": 0,
        // typescript
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/ban-ts-ignore": 0,
        "@typescript-eslint/triple-slash-reference": 0,
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
        MI: "readonly",
        routes: "readonly"
    },
    settings: {
        "react": {
            "pragma": "React",
            "version": "detect", // React version. "detect" automatically picks the version you 
        }
    }
};