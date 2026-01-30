import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCollection, useQuadras } from '@/hooks/useFirestore';
import * as firestore from 'firebase/firestore';


// Mock Firestore
vi.mock('@/lib/firebase', () => ({
    db: {},
}));

describe('useCollection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with loading state', async () => {
        const { result } = renderHook(() => useCollection('users'));

        // Initially should be loading
        expect(result.current.loading).toBe(true);
        expect(result.current.data).toEqual([]);
        expect(result.current.error).toBe(null);

        // Wait for the mock to resolve
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
    });

    it('should provide add, update, and remove methods', async () => {
        const { result } = renderHook(() => useCollection('users'));

        // Wait for initialization
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.add).toBeDefined();
        expect(result.current.update).toBeDefined();
        expect(result.current.remove).toBeDefined();
        expect(typeof result.current.add).toBe('function');
        expect(typeof result.current.update).toBe('function');
        expect(typeof result.current.remove).toBe('function');
    });
});

describe('useQuadras', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with loading state', async () => {
        const { result } = renderHook(() => useQuadras());

        // Initially should be loading
        expect(result.current.loading).toBe(true);
        expect(result.current.quadras).toEqual([]);

        // Wait for the mock to resolve
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
    });

    it('should provide addQuadra and updateQuadra methods', async () => {
        const { result } = renderHook(() => useQuadras());

        // Wait for initialization
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.addQuadra).toBeDefined();
        expect(result.current.updateQuadra).toBeDefined();
        expect(typeof result.current.addQuadra).toBe('function');
        expect(typeof result.current.updateQuadra).toBe('function');
    });
});
