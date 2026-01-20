"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Lock, Mail, Loader2, Rocket } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage("Verifique seu e-mail para confirmar o cadastro!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <Card className="w-full max-w-md relative z-10 glass border border-white/10 shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/50 text-white shadow-lg shadow-primary/30">
                            <Rocket size={32} />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        {isSignUp ? "Criar Conta" : "Bem-vindo"}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                        {isSignUp
                            ? "Comece sua jornada de sucesso hoje."
                            : "Entre para gerenciar suas metas."}
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/50"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="******"
                                    className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/50"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                                {message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold py-6 shadow-lg shadow-primary/25 transition-all duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin mr-2" />
                            ) : isSignUp ? (
                                "Cadastrar Gratuitamente"
                            ) : (
                                "Acessar Plataforma"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {isSignUp ? "Já tem uma conta?" : "Não tem conta ainda?"}{" "}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline underline-offset-4"
                            >
                                {isSignUp ? "Faça Login" : "Crie agora"}
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
