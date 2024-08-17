import { useEffect, useState } from "react";

function useTheme() {
    const [theme, setTheme] = useState<'light'|'dark'>(() => {
        const theme = localStorage.getItem('theme');
        return theme ? (theme as 'light'|'dark') : 'light';
    });

    useEffect(() => {
        document.body.dataset.theme = theme;
        localStorage.setItem('theme', theme)
    }, [theme]);

    return {
        theme,
        setTheme
    }
}

export default useTheme