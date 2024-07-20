import React, { ReactNode } from "react";
import styles from "./ButtonComponent.module.css";
import SpaceComponent from "./SpaceComponent";

interface ButtonComponentProps {
    text: string;
    icon: ReactNode;
    onClick: () => void;
}
function ButtonComponent(props: ButtonComponentProps) {
    const { text, onClick, icon } = props;

    return (
        <div onClick={onClick} className={styles["button"]}>
            {icon}
            <SpaceComponent width={16} />
            {text}
        </div>
    );
}

export default ButtonComponent;
