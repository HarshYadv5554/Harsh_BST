/**
 * Programmatic Vite build for Render (avoids CLI module resolution issues).
 * Vite auto-loads vite.config.js from the current working directory.
 */
import { build } from 'vite';
await build();
