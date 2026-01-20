"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from './AuthContext';

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
    why?: string;
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
    const { user } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);
    const [saboteurs, setSaboteurs] = useState<Saboteur[]>([]);

    // Local state for UI only (not persisted yet, can be added to profiles later)
    const [chips, setChips] = useState<ProgressChips>({ finance: 0, health: 0, relationships: 0 });
    const [focusPillar, setFocusPillar] = useState<string>('');
    const [step, setStep] = useState(1);

    // Initial Fetch
    useEffect(() => {
        if (!user) {
            setGoals([]);
            setInitiatives([]);
            setSaboteurs([]);
            return;
        }

        const fetchData = async () => {
            // Fetch Goals
            const { data: goalsData } = await supabase
                .from('goals')
                .select('*')
                .order('created_at', { ascending: true });

            if (goalsData) {
                // Map DB columns to Frontend interface
                const mappedGoals: Goal[] = goalsData.map((g: any) => ({
                    id: g.id,
                    category: g.category as GoalCategory, // Assuming strict typing matches
                    what: g.title,
                    why: g.why,
                    number: g.number || '',
                    when: g.target_date || '', // mapped from target_date
                    guardian: g.guardian || '',
                    leverage: g.leverage || '',
                    metric: g.metric,
                    deadlineConfirm: g.deadline_confirm
                }));
                setGoals(mappedGoals);
            }

            // Fetch Initiatives
            const { data: initiativesData } = await supabase
                .from('initiatives')
                .select('*')
                .order('created_at', { ascending: true });

            if (initiativesData) {
                const mappedInitiatives: Initiative[] = initiativesData.map((i: any) => ({
                    id: i.id,
                    goalId: i.goal_id,
                    text: i.description,
                    type: 'initiative' // Defaulting to initiative as DB might not store type yet or it's implicitly 'initiative'
                }));
                // Note: If you added a 'type' column to initiatives in SQL, map it here. 
                // Since we didn't explicitly add 'type' in the logged SQL, we'll default or need to add it.
                // For now assuming all are initiatives.
                setInitiatives(mappedInitiatives);
            }

            // Fetch Saboteurs
            const { data: saboteursData } = await supabase
                .from('saboteurs')
                .select('*')
                .order('created_at', { ascending: true });

            if (saboteursData) {
                setSaboteurs(saboteursData as unknown as Saboteur[]);
            }
        };

        fetchData();
    }, [user]);

    // --- Actions ---

    const addGoal = async (goal: Goal) => {
        if (!user) return;

        // Optimistic Update
        setGoals((prev) => [...prev, goal]);

        // DB Insert
        const { error } = await supabase.from('goals').insert({
            id: goal.id, // Use frontend ID or let DB generate? Usually best to let DB generate or use UUID from frontend.
            // Since frontend generates UUIDs, we can use them.
            user_id: user.id,
            title: goal.what,
            category: goal.category,
            why: goal.why,
            number: goal.number,
            target_date: goal.when,
            guardian: goal.guardian,
            leverage: goal.leverage,
            metric: goal.metric,
            deadline_confirm: goal.deadlineConfirm,
            status: 'active'
        });

        if (error) {
            console.error('Error adding goal', error);
            // Rollback if needed
        }
    };

    const updateGoal = async (id: string, updates: Partial<Goal>) => {
        if (!user) return;
        setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));

        // Map updates to DB columns
        const dbUpdates: any = {};
        if (updates.what) dbUpdates.title = updates.what;
        if (updates.category) dbUpdates.category = updates.category;
        if (updates.why) dbUpdates.why = updates.why;
        if (updates.number) dbUpdates.number = updates.number;
        if (updates.when) dbUpdates.target_date = updates.when;
        if (updates.guardian) dbUpdates.guardian = updates.guardian;
        if (updates.leverage) dbUpdates.leverage = updates.leverage;
        if (updates.metric) dbUpdates.metric = updates.metric;
        if (updates.deadlineConfirm) dbUpdates.deadline_confirm = updates.deadlineConfirm;

        const { error } = await supabase.from('goals').update(dbUpdates).eq('id', id);
        if (error) console.error('Error updating goal', error);
    };

    const removeGoal = async (id: string) => {
        if (!user) return;
        setGoals((prev) => prev.filter((g) => g.id !== id));
        setInitiatives((prev) => prev.filter((i) => i.goalId !== id));

        const { error } = await supabase.from('goals').delete().eq('id', id);
        if (error) console.error('Error deleting goal', error);
    };

    const addInitiative = async (initiative: Initiative) => {
        if (!user) return;
        setInitiatives((prev) => [...prev, initiative]);

        const { error } = await supabase.from('initiatives').insert({
            id: initiative.id,
            user_id: user.id,
            goal_id: initiative.goalId,
            description: initiative.text,
            completed: false
        });
        if (error) console.error('Error adding initiative', error);
    };

    const removeInitiative = async (id: string) => {
        if (!user) return;
        setInitiatives((prev) => prev.filter((i) => i.id !== id));
        const { error } = await supabase.from('initiatives').delete().eq('id', id);
        if (error) console.error('Error deleting initiative', error);
    };

    const updateInitiative = async (id: string, updates: Partial<Initiative>) => {
        if (!user) return;
        setInitiatives((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));

        const dbUpdates: any = {};
        if (updates.text) dbUpdates.description = updates.text;
        // if type is added, map it here

        const { error } = await supabase.from('initiatives').update(dbUpdates).eq('id', id);
        if (error) console.error('Error updating initiative', error);
    };

    const addSaboteur = async (saboteur: Saboteur) => {
        if (!user) return;
        setSaboteurs((prev) => [...prev, saboteur]);

        const { error } = await supabase.from('saboteurs').insert({
            id: saboteur.id,
            user_id: user.id,
            name: saboteur.name,
            action: saboteur.action
        });
        if (error) console.error('Error adding saboteur', error);
    };

    const removeSaboteur = async (id: string) => {
        if (!user) return;
        setSaboteurs((prev) => prev.filter((s) => s.id !== id));
        const { error } = await supabase.from('saboteurs').delete().eq('id', id);
        if (error) console.error('Error removing saboteur', error);
    };

    const updateSaboteur = async (id: string, updates: Partial<Saboteur>) => {
        if (!user) return;
        setSaboteurs((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.action) dbUpdates.action = updates.action;

        const { error } = await supabase.from('saboteurs').update(dbUpdates).eq('id', id);
        if (error) console.error('Error updating saboteur', error);
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
