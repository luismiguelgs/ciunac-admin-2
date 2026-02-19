import React from "react";
import NavigationBread from "@/components/navigation-bread";
import { RankingDataTable } from "@/modules/seguimiento-docente/ranking-docentes/ranking-datatable";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default function RankingDocentes() {
    return <React.Fragment>
        <NavigationBread section="Perfil Docentes" href="/perfil-docente" page="Ranking Docentes" />
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Ranking Docentes</h1>
                <Button asChild>
                    <Link href="/perfil-docente/nuevo">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Nuevo Perfil Docente
                    </Link>
                </Button>
            </div>
            <RankingDataTable />
        </div>
    </React.Fragment>
}
