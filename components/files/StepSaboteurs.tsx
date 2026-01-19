"use client";

import { useGoal, Saboteur } from "@/context/GoalContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export const StepSaboteurs = () => {
    const { saboteurs, addSaboteur, removeSaboteur, updateSaboteur, setStep } = useGoal();

    const handleAdd = () => {
        addSaboteur({
            id: uuidv4(),
            name: "",
            action: "",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">Sabotadores</h2>
                    <p className="text-muted-foreground">Identifique o que te impede e como neutralizar.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button onClick={() => setStep(2)} variant="ghost" className="hidden md:flex">
                        <ArrowLeft className="mr-2" size={16} />
                    </Button>
                    <Button onClick={() => setStep(4)} className="w-full md:w-auto gap-2">
                        Próximo: Painel do Progresso <ArrowRight size={16} />
                    </Button>
                </div>
            </div>

            <Card className="glass">
                <CardHeader className="bg-destructive/5 pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-destructive">Meus Sabotadores</CardTitle>
                        <Button onClick={handleAdd} size="sm" variant="secondary">
                            <Plus size={16} className="mr-2" /> Adicionar Sabotador
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/30 text-xs uppercase text-muted-foreground font-semibold">
                                <tr>
                                    <th className="px-6 py-3 text-left w-1/2">Qual Sabotador? (Vícios, distrações...)</th>
                                    <th className="px-6 py-3 text-left w-1/2">Quais ações para neutralizar?</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {saboteurs.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-muted-foreground italic">
                                            Nenhum sabotador identificado ainda.
                                        </td>
                                    </tr>
                                )}
                                {saboteurs.map((saboteur) => (
                                    <tr key={saboteur.id} className="group hover:bg-muted/10 transition-colors">
                                        <td className="p-4">
                                            <Input
                                                className="border-transparent bg-transparent focus:bg-background"
                                                placeholder="Ex: Procrastinação, redes sociais..."
                                                value={saboteur.name}
                                                onChange={(e) => updateSaboteur(saboteur.id, { name: e.target.value })}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <Input
                                                className="border-transparent bg-transparent focus:bg-background"
                                                placeholder="Ex: Usar app de bloqueio, cronômetro..."
                                                value={saboteur.action}
                                                onChange={(e) => updateSaboteur(saboteur.id, { action: e.target.value })}
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => removeSaboteur(saboteur.id)}
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
                </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
                <Button onClick={() => setStep(2)} variant="outline" className="gap-2">
                    <ArrowLeft size={16} /> Voltar
                </Button>
                <Button onClick={() => setStep(4)} size="lg" className="gap-2">
                    Próximo: Painel do Progresso <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
};
