import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier'; // Used to disable ESLint rules that conflict with Prettier

export default [
  // 1. Global ignores (optional, e.g., build folders)
  // {
  //   ignores: ["dist/", "node_modules/"]
  // },

  // 2. Base ESLint recommended rules for all JS/TS files
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, // Browser globals like `document`, `navigator`
        ...globals.node, // Node.js globals like `process`, `require`
        ...globals.es2021, // ES2021 globals like `Promise`, `Map`
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      // Start with ESLint recommended rules
      // (These are implicitly included but good to be aware)
      // ...eslint.configs.recommended.rules,

      // Add or override rules as needed
    },
  },

  // 3. TypeScript specific configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json', // Link to your tsconfig for type-aware linting
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Apply recommended TS rules
      ...tsPlugin.configs['recommended'].rules,
      // ...tsPlugin.configs['recommended-requiring-type-checking'].rules, // Optionally add type-aware rules

      // Customize TS rules
      '@typescript-eslint/no-explicit-any': 'warn', // Warn on 'any' type
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ], // Warn on unused vars, allowing _ prefix
    },
  },

  // 4. Prettier integration (MUST be last)
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,json,md,html,css,scss,yaml,yml}'], // Apply Prettier formatting checks
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Apply prettier rules from eslint-config-prettier
      ...prettierConfig.rules,

      // Enable eslint-plugin-prettier rule
      'prettier/prettier': 'error',
    },
  },
];
