export default interface Usuario {
    id?: number;
    email: string;
    password?: string;
    rol: string;
    isNew?: boolean;
}