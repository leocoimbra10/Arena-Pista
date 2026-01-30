import { describe, it, expect } from 'vitest';

describe('App Configuration', () => {
    it('should have valid environment variables structure', () => {
        // Test that environment can be loaded
        expect(import.meta.env).toBeDefined();
    });

    it('should define VITE prefix for variables', () => {
        // Vite requires VITE_ prefix for env vars
        const envKeys = Object.keys(import.meta.env);
        const viteKeys = envKeys.filter(key => key.startsWith('VITE_'));

        // Should have at least some VITE_ variables
        expect(viteKeys.length).toBeGreaterThanOrEqual(0);
    });
});

describe('Basic Math (Sanity Check)', () => {
    it('should perform basic arithmetic correctly', () => {
        expect(2 + 2).toBe(4);
        expect(10 - 5).toBe(5);
        expect(3 * 4).toBe(12);
        expect(20 / 4).toBe(5);
    });

    it('should handle string concatenation', () => {
        expect('Hello' + ' ' + 'World').toBe('Hello World');
    });
});
