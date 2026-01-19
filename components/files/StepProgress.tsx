"use client";

import { useGoal, ProgressChips } from "@/context/GoalContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Check, Download } from "lucide-react";
import { useState, useEffect } from "react";
import ReactPDF, { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFDocument } from "@/components/pdf/PDFDocument";

export const StepProgress = () => {
    const { goals, initiatives, saboteurs, chips, updateChips, focusPillar, setFocusPillar, setStep, updateGoal } = useGoal();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const totalChipsUsed = chips.finance + chips.health + chips.relationships;
    const chipsRemaining = 5 - totalChipsUsed;

    const handleChipChange = (category: keyof ProgressChips, checked: boolean) => {
        const currentCount = chips[category];
        if (checked) {
            if (chipsRemaining > 0) {
                updateChips(category, currentCount + 1);
            }
        } else {
            if (currentCount > 0) {
                updateChips(category, currentCount - 1);
            }
        }
    };

    // Render 5 checkboxes for each pillar
    const renderChips = (category: keyof ProgressChips, label: string) => {
        return (
            <div className="flex flex-col items-center gap-2">
                <h4 className="font-semibold text-sm uppercase">{label}</h4>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((idx) => {
                        const isChecked = idx <= chips[category];
                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (isChecked) {
                                        // If clicking a filled chip, remove it (and any after it ideally, but here just decrement count)
                                        // Logic: if I click the 3rd chip and it is checked, I want to uncheck it.
                                        // Only allow unchecking from the end or just toggle logic based on count? 
                                        // Simplest: If I click index 3 (1-based) and count is >= 3, set count to 2. 
                                        // If I click index 3 and count is 2, set count to 3 (if budget allows).

                                        if (idx === chips[category] && isChecked) {
                                            updateChips(category, chips[category] - 1);
                                        } else if (!isChecked && chipsRemaining > 0) {
                                            updateChips(category, chips[category] + 1);
                                        }
                                    } else {
                                        // clicking an unchecked chip
                                        if (chipsRemaining > 0) {
                                            updateChips(category, chips[category] + 1);
                                        }
                                    }
                                }}
                                className={`w-6 h-6 rounded border cursor-pointer flex items-center justify-center transition-colors ${isChecked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 hover:border-primary"
                                    }`}
                            >
                                {isChecked && <Check size={14} />}
                            </div>
                        )
                    })}
                </div>
                <span className="text-xs text-muted-foreground">{chips[category]}/5 (Total usável: 5)</span>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">Painel do Progresso</h2>
                    <p className="text-muted-foreground">Distribua suas fichas e defina métricas claras.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button onClick={() => setStep(3)} variant="outline" className="gap-2">
                        <ArrowLeft size={16} /> Voltar
                    </Button>
                </div>
            </div>

            {/* Chips Section */}
            <Card>
                <CardHeader className="bg-secondary/10 pb-4">
                    <CardTitle className="text-lg text-secondary-foreground text-center">
                        Distribuição de Fichas (Máx: 5 no total)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row justify-around gap-8">
                        {renderChips('finance', 'Financeiro')}
                        {renderChips('health', 'Saúde')}
                        {renderChips('relationships', 'Relacionamento')}
                    </div>
                    {chipsRemaining < 0 && (
                        <p className="text-center text-destructive mt-4 font-bold">Você usou mais de 5 fichas! Remova {Math.abs(chipsRemaining)}.</p>
                    )}
                    <div className="text-center mt-6 p-4 bg-muted/20 rounded-lg">
                        <p className="font-medium">Fichas Restantes: <span className={chipsRemaining < 0 ? 'text-destructive' : 'text-primary'}>{chipsRemaining}</span></p>
                    </div>
                </CardContent>
            </Card>

            {/* Goal Specifics (Metrics/Deadlines) */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">Detalhamento das Metas</h3>
                {goals.map((goal) => (
                    <Card key={goal.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/20 pb-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase">{goal.category}</span>
                            <CardTitle className="text-lg">{goal.what || "Meta sem descrição"}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Como você medirá?</label>
                                <Input
                                    placeholder="Ex: Extrato bancário, Balança..."
                                    value={goal.metric || ""}
                                    onChange={(e) => updateGoal(goal.id, { metric: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Qual prazo irá estabelecer para ela?</label>
                                <Input
                                    placeholder="Confirmar prazo (Data)"
                                    value={goal.deadlineConfirm || goal.when || ""}
                                    onChange={(e) => updateGoal(goal.id, { deadlineConfirm: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Focus Pillar */}
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
                <CardContent className="p-8 text-center space-y-4">
                    <h3 className="text-lg font-semibold">Em qual Pilar você colocará seu Foco e Energia (F.E.)?</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Financeiro', 'Saúde', 'Relacionamento'].map((pillar) => (
                            <button
                                key={pillar}
                                onClick={() => setFocusPillar(pillar)}
                                className={`px-6 py-3 rounded-full border-2 transition-all font-bold ${focusPillar === pillar
                                        ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                                        : "bg-transparent border-muted-foreground/30 hover:border-primary text-muted-foreground"
                                    }`}
                            >
                                {pillar}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* PDF Generation */}
            <div className="flex justify-center pt-8 pb-12">
                {isClient && (
                    <PDFDownloadLink
                        document={<PDFDocument goals={goals} initiatives={initiatives} saboteurs={saboteurs} chips={chips} focusPillar={focusPillar} />}
                        fileName="planejamento-vida-premium.pdf"
                        className={`
                            inline-flex items-center justify-center gap-2 h-14 px-8 text-lg font-bold rounded-xl transition-all shadow-xl
                            ${chipsRemaining < 0
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 active:scale-95"
                            }
                        `}
                        // @ts-ignore
                        disabled={chipsRemaining < 0}
                    >
                        {({ blob, url, loading, error }) => (loading ? 'Gerando PDF...' : <><Download /> Baixar Planejamento Premium (.pdf)</>)}
                    </PDFDownloadLink>
                )}
            </div>
        </div>
    );
};
