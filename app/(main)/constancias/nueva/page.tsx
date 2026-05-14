import NavigationBread from "@/components/navigation-bread";
import React from "react";
import ConstanciaForm from "@/modules/constancias/components/constancia.form";

export default function PageNuevaConstancia() {
    return (
        <React.Fragment>
            <NavigationBread section="Constancias" href="/constancias" page="Nueva Constancia" />
            <div className="container mx-auto py-4 px-4 max-w-6xl">
                <ConstanciaForm />
            </div>
        </React.Fragment>
    );
}
