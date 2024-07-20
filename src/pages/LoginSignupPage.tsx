import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import imageWallpaper from "../assets/wallpapers/loginsignupWallpaper.png";
import style from "./LoginSignupPage.module.css";
import LoginFormComponent from "../components/LoginFormComponent";

interface LoginSignupPageProps {}
function LoginSignupPage() {
    const { isDesktopOrLaptop, isTabletOrMobile } = useResponsive();
    console.log("isDesktopOrLaptop", isDesktopOrLaptop);
    console.log("isTabletOrMobile", isTabletOrMobile);
    return (
        <div>
            <div className={style["container"]}>
                <div className={style["wallpaperContainer"]}>
                    <img
                        className={style["wallpaper"]}
                        src={imageWallpaper}
                        alt="wallpaper"
                    />
                </div>
                <div className={style["contentContainer"]}>
                    <LoginFormComponent />
                </div>
            </div>
        </div>
    );
}

export default LoginSignupPage;
