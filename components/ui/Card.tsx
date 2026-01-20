import { cn } from "@/utils/cn";
import React from "react";

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    return (
        <div className={cn("rounded-xl glass text-card-foreground shadow-lg backdrop-blur-md", className)}>
            {children}
        </div>
    );
};

export const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    return <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>;
};

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    return <h3 className={cn("font-semibold leading-none tracking-tight", className)}>{children}</h3>;
};

export const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    return <div className={cn("p-6 pt-0", className)}>{children}</div>;
};
