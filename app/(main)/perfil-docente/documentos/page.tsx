import React from "react";
import NavigationBread from "@/components/navigation-bread";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { PerfilesDataTable } from "@/modules/seguimiento-docente/perfil-docente/components/perfiles-datatable";

export default function Documentos() {
    return <React.Fragment>
        <NavigationBread section="Perfil Docentes" href="/perfil-docente" page="Perfiles/Documentos" />
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Perfiles y Documentos</h1>
                <Button asChild>
                    <Link href="/perfil-docente/nuevo">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Nuevo Perfil Docente
                    </Link>
                </Button>
            </div>
            <PerfilesDataTable />
        </div>
    </React.Fragment>
}
