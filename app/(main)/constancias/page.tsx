import NavigationBread from "@/components/navigation-bread";
import React from "react";
import { ConstanciasTable } from "@/modules/constancias/components/constancias.table";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import Link from "next/link";

export default function PageConstancias() {
    return (
        <React.Fragment>
            <NavigationBread section="Constancias" href="/constancias" page="Constancias pendientes" />
            <div className="container mx-auto py-4 px-4 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Constancias pendientes</h1>
                        <p className="text-muted-foreground">
                            Gestión de constancias recibidas que aún no han sido procesadas.
                        </p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href="/constancias/nueva">
                            <FilePlus className="h-4 w-4" />
                            Nueva Constancia
                        </Link>
                    </Button>
                </div>

                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <ConstanciasTable state="pendientes" />
                </div>
            </div>
        </React.Fragment>
    );
}