import { useEffect, useState } from "react";

function useTheme() {
    const [theme, setTheme] = useState<'light'|'dark'>('light');

    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    return {
        theme,
        setTheme
    }
}

export default useTheme