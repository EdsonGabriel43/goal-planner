"use client";

import { useGoal, Initiative } from "@/context/GoalContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export const StepInitiatives = () => {
    const { goals, initiatives, addInitiative, removeInitiative, updateInitiative, setStep } = useGoal();

    // Helper to get initiatives for a specific goal
    const getInitiativesForGoal = (goalId: string, type: 'initiative' | 'routine') =>
        initiatives.filter((i) => i.goalId === goalId && i.type === type);

    const handleAdd = (goalId: string, type: 'initiative' | 'routine') => {
        addInitiative({
            id: uuidv4(),
            goalId,
            text: "",
            type,
        });
    };

    // If there are no goals, prompt user to go back
    if (goals.length === 0) {
        return (
            <div className="text-center py-20 space-y-4">
                <h2 className="text-2xl font-bold">Nenhuma meta definida</h2>
                <p className="text-muted-foreground">Você precisa definir metas antes de criar iniciativas.</p>
                <Button onClick={() => setStep(1)} variant="secondary">
                    <ArrowLeft className="mr-2" size={16} /> Voltar para Metas
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">Iniciativas e Rotinas</h2>
                    <p className="text-muted-foreground">Defina o que precisa ser feito para alcançar suas metas.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button onClick={() => setStep(1)} variant="ghost" className="hidden md:flex">
                        <ArrowLeft className="mr-2" size={16} />
                    </Button>
                    <Button onClick={() => setStep(3)} className="w-full md:w-auto gap-2">
                        Próximo: Sabotadores <ArrowRight size={16} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {goals.map((goal) => (
                    <Card key={goal.id} className="overflow-hidden bg-card/50 backdrop-blur-md">
                        <CardHeader className="bg-primary/5 pb-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div>
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{goal.category}</span>
                                    <CardTitle className="text-lg mt-1">{goal.what || "(Sem descrição)"}</CardTitle>
                                </div>
                                {(goal.number || goal.when) && (
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        {goal.number && <span><strong>Meta:</strong> {goal.number}</span>}
                                        {goal.when && <span><strong>Prazo:</strong> {goal.when}</span>}
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                                {/* Initiatives Column */}
                                <div className="p-4 space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Iniciativas (Projetos)</h4>
                                        <Button size="sm" variant="ghost" onClick={() => handleAdd(goal.id, 'initiative')} className="h-8 w-8 p-0 rounded-full">
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {getInitiativesForGoal(goal.id, 'initiative').map((item) => (
                                            <div key={item.id} className="flex gap-2 group">
                                                <Input
                                                    placeholder="Ex: Abrir conta na corretora"
                                                    className="h-9"
                                                    value={item.text}
                                                    onChange={(e) => updateInitiative(item.id, { text: e.target.value })}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive opacity-50 hover:opacity-100 px-2"
                                                    onClick={() => removeInitiative(item.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                        {getInitiativesForGoal(goal.id, 'initiative').length === 0 && (
                                            <p className="text-xs text-muted-foreground italic">Nenhuma iniciativa.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Routines Column */}
                                <div className="p-4 space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Rotinas (Hábitos)</h4>
                                        <Button size="sm" variant="ghost" onClick={() => handleAdd(goal.id, 'routine')} className="h-8 w-8 p-0 rounded-full">
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {getInitiativesForGoal(goal.id, 'routine').map((item) => (
                                            <div key={item.id} className="flex gap-2 group">
                                                <Input
                                                    placeholder="Ex: Treinar 3x semana"
                                                    className="h-9"
                                                    // Duplicate value prop removed
                                                    value={item.text}
                                                    onChange={(e) => updateInitiative(item.id, { text: e.target.value })}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive opacity-50 hover:opacity-100 px-2"
                                                    onClick={() => removeInitiative(item.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                        {getInitiativesForGoal(goal.id, 'routine').length === 0 && (
                                            <p className="text-xs text-muted-foreground italic">Nenhuma rotina.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-between pt-4">
                <Button onClick={() => setStep(1)} variant="outline" className="gap-2">
                    <ArrowLeft size={16} /> Voltar
                </Button>
                <Button onClick={() => setStep(3)} size="lg" className="gap-2">
                    Próximo: Sabotadores <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
};
