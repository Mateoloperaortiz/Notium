import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import type { Rule } from 'eslint';
import skipFormatting from 'eslint-config-prettier/flat';
import pluginVue from 'eslint-plugin-vue';
import { globalIgnores } from 'eslint/config';

const explicitTypeRestrictions = [
  {
    selector:
      ':matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression) > :matches(Identifier, ObjectPattern, ArrayPattern, RestElement).params:not([typeAnnotation])',
    message: 'AGENTS.md §2.1: declara explícitamente el tipo de cada parámetro.',
  },
  {
    selector:
      ':matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression) > AssignmentPattern.params > .left:not([typeAnnotation])',
    message: 'AGENTS.md §2.1: los parámetros con valor inicial también requieren tipo explícito.',
  },
  {
    selector:
      'TSParameterProperty > :matches(Identifier, ObjectPattern, ArrayPattern).parameter:not([typeAnnotation]), TSParameterProperty > AssignmentPattern.parameter > .left:not([typeAnnotation])',
    message: 'AGENTS.md §2.1: tipa explícitamente los atributos declarados en el constructor.',
  },
  {
    selector: ':matches(PropertyDefinition, TSPropertySignature):not([typeAnnotation])',
    message: 'AGENTS.md §2.1: declara explícitamente el tipo de los atributos y contratos.',
  },
];

// AGENTS.md §2.5: ordenar por ruta del módulo, incluidos imports de tipos y de efectos secundarios.
const alphabeticalImports: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      unordered:
        'Ordena los imports alfabéticamente por ruta: "{{current}}" antes de "{{previous}}".',
    },
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    return {
      Program(): void {
        let previous = '';

        for (const statement of context.sourceCode.ast.body) {
          if (statement.type !== 'ImportDeclaration') {
            continue;
          }

          const current = String(statement.source.value);

          if (current.toLowerCase() < previous.toLowerCase()) {
            context.report({
              node: statement,
              messageId: 'unordered',
              data: { current, previous },
            });
          }

          previous = current;
        }
      },
    };
  },
};

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    name: 'app/course-conventions',
    files: ['**/*.{vue,ts,mts,tsx}'],
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    plugins: { course: { rules: { 'alphabetical-imports': alphabeticalImports } } },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowDirectConstAssertionInArrowFunctions: false,
          allowHigherOrderFunctions: false,
          allowTypedFunctionExpressions: false,
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
      '@typescript-eslint/no-explicit-any': 'error',
      'course/alphabetical-imports': 'error',
      'no-restricted-syntax': ['error', ...explicitTypeRestrictions],
      'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
    },
  },
  {
    name: 'app/ui-service-boundary',
    files: ['src/**/*.vue'],
    languageOptions: {
      globals: { globalThis: 'readonly', self: 'readonly', window: 'readonly' },
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/data/**', '**/data/**', '@/infrastructure/**', '**/infrastructure/**'],
              message: 'AGENTS.md §3 y §6: accede a la infraestructura mediante un servicio.',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        {
          globals: ['fetch', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'indexedDB'],
          checkGlobalObject: true,
        },
      ],
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/no-restricted-syntax': [
        'error',
        {
          selector:
            'VElement[name="a"]:not(:has(VAttribute[key.name="download"])) > VStartTag > VAttribute[key.name="href"][value.value=/^(?![a-zA-Z][a-zA-Z0-9+.-]*:|\\/\\/|#).+/]',
          message: 'AGENTS.md §5.3: usa RouterLink para las rutas internas de la SPA.',
        },
      ],
    },
  },
  {
    name: 'app/setup-stores',
    files: ['src/stores/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...explicitTypeRestrictions,
        {
          selector:
            'CallExpression[callee.name="defineStore"]:matches([arguments.0.type="ObjectExpression"], [arguments.1.type="ObjectExpression"])',
          message: 'AGENTS.md §8.2: defineStore debe usar un id y una función Setup Store.',
        },
      ],
    },
  },
  {
    name: 'app/independent-utilities',
    files: ['src/utils/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'vue',
              message: 'AGENTS.md §9.1: las utilidades deben ser independientes de Vue.',
            },
          ],
        },
      ],
    },
  },

  skipFormatting,
);
