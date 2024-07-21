import React from 'react';
import styles from './TitleComponent.module.css';
import SpaceComponent from './SpaceComponent';

interface TitleComponentProps {
    title: string;
    icon?: React.ReactNode;
}
function TitleComponent(props: TitleComponentProps) {
    const { title, icon } = props;

    return (
        <div className={styles.container}>
            {icon && <div className={styles.iconContainer}>{icon}</div>}
            <SpaceComponent width={16} />
            <div className={styles.title}>{title}</div>
        </div>
    );
}

export default TitleComponent;
