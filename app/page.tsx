"use client";

import { useGoal } from "@/context/GoalContext";
import { AnimatePresence, motion } from "framer-motion";
import { StepGoals } from "@/components/files/StepGoals";
import { StepInitiatives } from "@/components/files/StepInitiatives";
import { StepSaboteurs } from "@/components/files/StepSaboteurs";
import { StepProgress } from "@/components/files/StepProgress";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const { step, setStep } = useGoal();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepGoals />;
      case 2:
        return <StepInitiatives />;
      case 3:
        return <StepSaboteurs />;
      case 4:
        return <StepProgress />;
      default:
        return <StepGoals />;
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background via-accent/20 to-primary/5">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 pt-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            Planejamento de Vida Premium
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Defina seus sonhos, elimine sabotadores e estruture sua jornada para o sucesso.
          </p>
        </header>

        {/* Progress Indicator */}
        <div className="flex justify-center items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${s <= step ? "w-12 bg-primary" : "w-4 bg-muted"
                }`}
            />
          ))}
        </div>

        {/* Dynamic Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
