import { useMediaQuery } from "react-responsive";

export function useResponsive() {
    const isDesktopOrLaptop = useMediaQuery({
        minWidth: 1224,
    });
    const isTabletOrMobile = useMediaQuery({
        maxWidth: 1224,
    });

    return {
        isDesktopOrLaptop,
        isTabletOrMobile,
    };
}
