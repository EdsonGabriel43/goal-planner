"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Global Types ---
export type GoalCategory =
    | 'Finanças e Patrimônio'
    | 'Saúde Física e Mental'
    | 'Relacionamento'
    | 'Trabalho'
    | 'Estudo'
    | 'Viagens'
    | 'Trabalho Voluntário' // Added these to match image
    | 'Espiritual';          // Added these to match image

export interface Goal {
    id: string;
    category: GoalCategory;
    what: string;
    number: string;
    when: string;
    guardian: string;
    leverage: string;
    // Step 4 additions
    metric?: string;
    deadlineConfirm?: string;
}

export interface Initiative {
    id: string;
    goalId: string; // Links to a specific goal
    text: string;
    type: 'initiative' | 'routine';
}

export interface Saboteur {
    id: string;
    name: string; // "Qual sabotador?"
    action: string; // "Quais ações para neutralizar?"
}

export interface ProgressChips {
    finance: number;
    health: number;
    relationships: number;
}

interface GoalContextType {
    goals: Goal[];
    addGoal: (goal: Goal) => void;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    removeGoal: (id: string) => void;

    initiatives: Initiative[];
    addInitiative: (initiative: Initiative) => void;
    removeInitiative: (id: string) => void;
    updateInitiative: (id: string, updates: Partial<Initiative>) => void;

    saboteurs: Saboteur[];
    addSaboteur: (saboteur: Saboteur) => void;
    removeSaboteur: (id: string) => void;
    updateSaboteur: (id: string, updates: Partial<Saboteur>) => void;

    chips: ProgressChips;
    updateChips: (category: keyof ProgressChips, value: number) => void;

    focusPillar: string;
    setFocusPillar: (pillar: string) => void;

    step: number;
    setStep: (step: number) => void;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);
    const [saboteurs, setSaboteurs] = useState<Saboteur[]>([]);
    const [chips, setChips] = useState<ProgressChips>({ finance: 0, health: 0, relationships: 0 });
    const [focusPillar, setFocusPillar] = useState<string>('');
    const [step, setStep] = useState(1);

    // Helper to add goal
    const addGoal = (goal: Goal) => {
        setGoals((prev) => [...prev, goal]);
    };

    const updateGoal = (id: string, updates: Partial<Goal>) => {
        setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    };

    const removeGoal = (id: string) => {
        setGoals((prev) => prev.filter((g) => g.id !== id));
        // Also remove linked initiatives
        setInitiatives((prev) => prev.filter((i) => i.goalId !== id));
    };

    const addInitiative = (initiative: Initiative) => {
        setInitiatives((prev) => [...prev, initiative]);
    };

    const removeInitiative = (id: string) => {
        setInitiatives((prev) => prev.filter((i) => i.id !== id));
    };

    const updateInitiative = (id: string, updates: Partial<Initiative>) => {
        setInitiatives((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    };

    const addSaboteur = (saboteur: Saboteur) => {
        setSaboteurs((prev) => [...prev, saboteur]);
    };

    const removeSaboteur = (id: string) => {
        setSaboteurs((prev) => prev.filter((s) => s.id !== id));
    };

    const updateSaboteur = (id: string, updates: Partial<Saboteur>) => {
        setSaboteurs((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    };

    const updateChips = (category: keyof ProgressChips, value: number) => {
        setChips((prev) => ({ ...prev, [category]: value }));
    };

    return (
        <GoalContext.Provider
            value={{
                goals,
                addGoal,
                updateGoal,
                removeGoal,
                initiatives,
                addInitiative,
                removeInitiative,
                updateInitiative,
                saboteurs,
                addSaboteur,
                removeSaboteur,
                updateSaboteur,
                chips,
                updateChips,
                focusPillar,
                setFocusPillar,
                step,
                setStep
            }}
        >
            {children}
        </GoalContext.Provider>
    );
};

export const useGoal = () => {
    const context = useContext(GoalContext);
    if (!context) {
        throw new Error('useGoal must be used within a GoalProvider');
    }
    return context;
};
