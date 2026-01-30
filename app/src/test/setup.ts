import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'


// Cleanup after each test
afterEach(() => {
    cleanup()
})

// Mock Firebase
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn((_db, name) => ({ _collectionName: name })),
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
    getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
    query: vi.fn((...args) => ({ _query: args })),
    where: vi.fn((field, op, value) => ({ _where: { field, op, value } })),
    orderBy: vi.fn((field, direction) => ({ _orderBy: { field, direction } })),
    onSnapshot: vi.fn((_query, onNext) => {
        // Simulate successful snapshot with empty data
        const mockSnapshot = {
            docs: [],
            size: 0,
            empty: true,
        }

        // Call the success callback immediately
        setTimeout(() => onNext(mockSnapshot), 0)

        // Return unsubscribe function
        return vi.fn()
    }),
    doc: vi.fn((_db, collection, id) => ({ _doc: { collection, id } })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    Timestamp: {
        now: vi.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
        fromDate: vi.fn((date) => ({ seconds: date.getTime() / 1000, nanoseconds: 0 })),
    },
}))

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((_auth, callback) => {
        callback(null) // No user by default
        return vi.fn() // unsubscribe
    }),
}))
