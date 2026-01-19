"use client";

import { useGoal, GoalCategory } from "@/context/GoalContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Categories defined in image
const CATEGORIES: GoalCategory[] = [
    "Finanças e Patrimônio",
    "Saúde Física e Mental",
    "Relacionamento",
    "Trabalho",
    "Estudo",
    "Viagens",
    "Trabalho Voluntário",
    "Espiritual",
];

export const StepGoals = () => {
    const { goals, addGoal, removeGoal, updateGoal, setStep } = useGoal();

    const handleAddGoal = (category: GoalCategory) => {
        addGoal({
            id: uuidv4(),
            category,
            what: "",
            number: "",
            when: "",
            guardian: "",
            leverage: "",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">Definição de Metas</h2>
                    <p className="text-muted-foreground">Preencha suas metas para cada pilar da sua vida.</p>
                </div>
                <Button onClick={() => setStep(2)} className="w-full md:w-auto gap-2">
                    Próximo: Iniciativas <ArrowRight size={16} />
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {CATEGORIES.map((category) => {
                    const categoryGoals = goals.filter((g) => g.category === category);

                    return (
                        <Card key={category} className="overflow-hidden border-t-4 border-t-primary/20 hover:border-t-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
                            <CardHeader className="bg-muted/20 pb-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg text-primary">{category}</CardTitle>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleAddGoal(category)}
                                        className="text-primary hover:bg-primary/10"
                                    >
                                        <Plus size={16} className="mr-1" /> Adicionar Meta
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {categoryGoals.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground text-sm italic">
                                        Nenhuma meta definida para esta categoria.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/30 text-xs uppercase text-muted-foreground font-semibold">
                                                <tr>
                                                    <th className="px-4 py-3 text-left min-w-[200px]">O Que?</th>
                                                    <th className="px-4 py-3 text-left w-32">Qual Número?</th>
                                                    <th className="px-4 py-3 text-left w-32">Quando?</th>
                                                    <th className="px-4 py-3 text-left w-32">Guardião?</th>
                                                    <th className="px-4 py-3 text-left w-24">Alavanca?</th>
                                                    <th className="px-4 py-3 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {categoryGoals.map((goal) => (
                                                    <tr key={goal.id} className="group hover:bg-muted/10 transition-colors">
                                                        <td className="p-2">
                                                            <Input
                                                                className="border-transparent bg-transparent focus:bg-background h-8"
                                                                placeholder="Descreva a meta..."
                                                                value={goal.what}
                                                                onChange={(e) => updateGoal(goal.id, { what: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <Input
                                                                className="border-transparent bg-transparent focus:bg-background h-8"
                                                                placeholder="Ex: R$ 10k"
                                                                value={goal.number}
                                                                onChange={(e) => updateGoal(goal.id, { number: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <Input
                                                                className="border-transparent bg-transparent focus:bg-background h-8"
                                                                placeholder="Data/Prazo"
                                                                value={goal.when}
                                                                onChange={(e) => updateGoal(goal.id, { when: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <Input
                                                                className="border-transparent bg-transparent focus:bg-background h-8"
                                                                // placeholder="Quem?"
                                                                value={goal.guardian}
                                                                onChange={(e) => updateGoal(goal.id, { guardian: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <Input
                                                                className="border-transparent bg-transparent focus:bg-background h-8"
                                                                // placeholder="Sim/Não"
                                                                value={goal.leverage}
                                                                onChange={(e) => updateGoal(goal.id, { leverage: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            <button
                                                                onClick={() => removeGoal(goal.id)}
                                                                className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} size="lg" className="w-full md:w-auto gap-2">
                    Próximo: Iniciativas e Rotinas <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
};
