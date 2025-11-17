/************************************************************
 * ESLint Configuration File
 * ----------------------------------------------------------
 * Purpose: Enforces code quality, style, and React best
 * practices for this Vite + React project.
 ************************************************************/

// ============================
// Import Required Dependencies
// ============================

// Core ESLint JavaScript configuration
import js from '@eslint/js'

// Common global variables (e.g., window, document, etc.)
import globals from 'globals'

// React Hooks plugin (checks correct usage of useEffect, useState, etc.)
import reactHooks from 'eslint-plugin-react-hooks'

// React Refresh plugin (supports fast refresh during development)
import reactRefresh from 'eslint-plugin-react-refresh'

// ESLint configuration helpers
import { defineConfig, globalIgnores } from 'eslint/config'


/************************************************************
 * Exported ESLint Configuration
 ************************************************************/
export default defineConfig([

  // ------------------------------------------
  // Global Ignored Files and Directories
  // ------------------------------------------
  // Ignore build output (no need to lint "dist" files)
  globalIgnores(['dist']),

  {
    // ==========================================
    // Targeted Files
    // ==========================================
    // Lint all JavaScript and JSX files
    files: ['**/*.{js,jsx}'],

    // ==========================================
    // Extend Recommended Configurations
    // ==========================================
    extends: [
      js.configs.recommended,                    // Base JavaScript rules
      reactHooks.configs['recommended-latest'],  // React Hooks best practices
      reactRefresh.configs.vite,                 // Vite + React fast refresh support
    ],

    // ==========================================
    // Language & Parsing Options
    // ==========================================
    languageOptions: {
      ecmaVersion: 2020,                         // Support modern JS (ES2020)
      globals: globals.browser,                  // Recognize browser globals
      parserOptions: {
        ecmaVersion: 'latest',                   // Always use the latest JS syntax
        ecmaFeatures: { jsx: true },             // Enable JSX for React components
        sourceType: 'module',                    // Use ES modules (import/export)
      },
    },

    // ==========================================
    // Custom Rules
    // ==========================================
    rules: {
      // Flag unused variables as errors,
      // but ignore names that start with a capital letter or underscore
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

