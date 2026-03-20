'use client'
import React from "react";
import UsuariosService from "../../usuarios/usuarios.service";

const useUsuarios = <T,>() => {
    const [data, setData] = React.useState<T[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await UsuariosService.fetchItems<T>();
                setData(res);
            } catch (error) {
                console.error(`Error al cargar los usuarios:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, setData };
};

export default useUsuarios;
