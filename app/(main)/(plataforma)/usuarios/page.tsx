import UsuariosDataTable from "@/modules/usuarios/usuarios-datatable";
import NavigationBread from "@/components/navigation-bread";
import ProtectedRoute from "@/components/protected-route";

export default function UsuariosPage() {
    return (
        <ProtectedRoute>
            <div className="container mx-auto py-6 px-2">
                <NavigationBread section="Dashboard" href="/dashboard" page="Usuarios" />
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
                        <p className="text-muted-foreground">
                            Administra los usuarios del sistema y sus roles.
                        </p>
                    </div>
                    <UsuariosDataTable />
                </div>
            </div>
        </ProtectedRoute>
    )
}
