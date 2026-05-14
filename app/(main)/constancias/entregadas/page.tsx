import NavigationBread from "@/components/navigation-bread";
import React from "react";
import { ConstanciasTable } from "@/modules/constancias/components/constancias.table";

export default function PageConstanciasEntregadas() {
    return (
        <React.Fragment>
            <NavigationBread section="Constancias" href="/constancias" page="Constancias entregadas" />
            <div className="container mx-auto py-4 px-4 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Constancias entregadas</h1>
                    <p className="text-muted-foreground">
                        Historial de constancias que ya han sido impresas y entregadas a los estudiantes.
                    </p>
                </div>

                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <ConstanciasTable state="aceptados" />
                </div>
            </div>
        </React.Fragment>
    );
}
