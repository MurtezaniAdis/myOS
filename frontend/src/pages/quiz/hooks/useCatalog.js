import { useEffect, useState } from "react";
import { getDistros } from "../api/catalogApi.js";

export function useCatalog() {
    const [distros, setDistros] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDistros = async () => {
            try {
                const data = await getDistros();
                setDistros(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        loadDistros();
    }, []);

    const filteredDistros = distros.filter((distro) =>
        distro.name.toLowerCase().includes(search.toLowerCase()),
    );

    return {
        distros,
        setDistros,
        search,
        setSearch,
        loading,
        setLoading,
        error,
        setError,
        filteredDistros,
    };
}
