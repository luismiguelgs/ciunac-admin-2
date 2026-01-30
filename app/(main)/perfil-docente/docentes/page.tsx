import React from "react";
import NavigationBread from "@/components/navigation-bread";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DocentesDataTable } from "@/modules/perfil-docente/docentes/components/docentes-data-table";
import DocentesService from "@/modules/perfil-docente/docentes/docente.service";

async function getData() {
    const data = await DocentesService.fetchItems()
    return data
}

export default async function Docentes() {
    const docentes = await getData()
    return <React.Fragment>
        <NavigationBread section="Perfil Docentes" href="/perfil-docente" page="Docentes" />
        <div className="container mx-auto py-2 px-2">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Docentes</h1>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/perfil-docente/docentes/nuevo">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Docente
                        </Link>
                    </Button>
                </div>
            </div>
            <React.Suspense fallback={<div>Cargando...</div>}>
                <DocentesDataTable data={docentes} />
            </React.Suspense>
        </div>
    </React.Fragment>
}
