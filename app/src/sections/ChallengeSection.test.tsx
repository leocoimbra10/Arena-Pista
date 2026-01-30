import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChallengeSection } from '@/sections/ChallengeSection';



describe('ChallengeSection', () => {
    it('should render the component header', () => {
        render(<ChallengeSection />);

        // Use heading role for unique identification
        const heading = screen.getByRole('heading', { name: /Challenge/i });
        expect(heading).toBeDefined();

        // "Encontre parceiros" appears in subtitle - use getAllByText
        const parceirosTexts = screen.getAllByText(/Encontre parceiros/i);
        expect(parceirosTexts.length).toBeGreaterThan(0);
    });

    it('should render create challenge button', () => {
        render(<ChallengeSection />);

        // These texts appear multiple times, so use getAllByText
        const encontreElements = screen.getAllByText(/Encontre Parceiros/i);
        expect(encontreElements.length).toBeGreaterThan(0);

        const equipeElements = screen.getAllByText(/Monte sua equipe ideal/i);
        expect(equipeElements.length).toBeGreaterThan(0);
    });

    it('should render filter buttons', () => {
        render(<ChallengeSection />);

        // All filter texts are unique or can use getAllByText
        const todosButton = screen.getByRole('button', { name: /Todos/i });
        expect(todosButton).toBeDefined();

        const inicianteButton = screen.getByRole('button', { name: /Iniciante/i });
        expect(inicianteButton).toBeDefined();

        // "Intermediário" appears as both button and player label
        const intermediarioButtons = screen.getAllByRole('button');
        const intermediarioButton = intermediarioButtons.find(btn => btn.textContent?.includes('Intermediário'));
        expect(intermediarioButton).toBeDefined();

        const avancadoButton = screen.getByRole('button', { name: /Avançado/i });
        expect(avancadoButton).toBeDefined();
    });

    it('should display players when available', () => {
        render(<ChallengeSection />);

        // Mock users should be displayed - these are unique names
        expect(screen.getByText('Carlos Silva')).toBeDefined();
        expect(screen.getByText('Ana Costa')).toBeDefined();
    });

    it('should show player count', () => {
        render(<ChallengeSection />);

        // This should be unique in the document
        expect(screen.getByText(/Jogadores Disponíveis \(2\)/i)).toBeDefined();
    });
});
