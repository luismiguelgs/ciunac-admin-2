import { IConstancia } from "./constancias.interface";
import { ConstanciasService } from "./constancias.service";
import React from "react";

const useConstancias = (state: string) => {
    const [data, setData] = React.useState<IConstancia[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await ConstanciasService.fetchByState(state);
            setData(res as IConstancia[]);
            setLoading(false);
        };
        fetchData();
    }, [state]);

    return { data, loading, setData };
};

export default useConstancias