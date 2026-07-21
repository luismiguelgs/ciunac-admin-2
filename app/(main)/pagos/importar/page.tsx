"use client"

import { AlertCircle, CreditCard } from "lucide-react"
import NavigationBread from "@/components/navigation-bread"
import ProtectedRoute from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImportarPagos from "@/modules/pagos/components/importar-pagos"

export default function ImportarPagosPage() {
    return (
        <ProtectedRoute>
            <NavigationBread section="Gestión de Pagos" href="/pagos/datos-banco" page="Importar Pagos" />
            <main className="flex flex-1 flex-col gap-6 p-4 pt-0">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Importar Pagos de Banco
                        </CardTitle>
                        <CardDescription>
                            Cargue un archivo CSV bancario para procesar y conciliar sus pagos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ImportarPagos />
                        <div className="space-y-2 border-t pt-5 text-sm">
                            <div className="flex items-center gap-2 font-medium">
                                <AlertCircle className="h-4 w-4" />
                                Requisitos del archivo
                            </div>
                            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                                <li>Formato CSV emitido por el sistema bancario.</li>
                                <li>Tamano maximo de 10 MB.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </ProtectedRoute>
    )
}
