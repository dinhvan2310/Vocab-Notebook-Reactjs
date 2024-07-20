import React from "react";
import styles from "./TabLinkComponent.module.css";

interface TabLinkComponentProps {
    text: string;
    active: boolean;
    onClick: () => void;
}
function TabLinkComponent(props: TabLinkComponentProps) {
    const { text, onClick, active } = props;

    return (
        <div
            className={styles["tab-link"]}
            onClick={onClick}
            style={{
                color: active ? "rgb(46, 56, 86)" : "rgb(88, 99, 128)",
            }}
        >
            {text}
        </div>
    );
}

export default TabLinkComponent;
