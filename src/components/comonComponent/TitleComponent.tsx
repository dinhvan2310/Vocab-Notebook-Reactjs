import React from 'react';
import styles from './TitleComponent.module.css';
import SpaceComponent from './SpaceComponent';

interface TitleComponentProps {
    title: string;
    icon?: React.ReactNode;
    containerStyle?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
}
function TitleComponent(props: TitleComponentProps) {
    const { title, icon, containerStyle, titleStyle } = props;

    return (
        <div className={styles.container} style={containerStyle}>
            {icon && <div className={styles.iconContainer}>{icon}</div>}
            {icon && <SpaceComponent width={16} />}
            <div style={titleStyle} className={styles.title}>
                {title}
            </div>
        </div>
    );
}

export default TitleComponent;
