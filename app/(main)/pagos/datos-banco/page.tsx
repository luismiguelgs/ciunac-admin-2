"use client"

import NavigationBread from "@/components/navigation-bread"
import ProtectedRoute from "@/components/protected-route"
import { DatosBanco } from "@/modules/pagos/components/datos-banco"

export default function DatosBancoPage() {
    return (
        <ProtectedRoute>
            <NavigationBread section="Gestión de Pagos" href="/pagos/datos-banco" page="Datos Banco" />
            <main className="flex flex-1 flex-col gap-5 p-4 pt-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Datos Banco</h1>
                    <p className="text-sm text-muted-foreground">Pagos bancarios organizados por mes calendario.</p>
                </div>
                <DatosBanco />
            </main>
        </ProtectedRoute>
    )
}
