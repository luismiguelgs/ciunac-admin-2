export default interface RolPermiso {
    id?: number;
    rol: string;
    permisoId: number;
    descripcion: string;
    permiso: {
        id: number;
        codigo: string;
        modulo: string;
    }
}