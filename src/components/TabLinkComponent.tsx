import React from 'react';
import styles from './TabLinkComponent.module.css';

interface TabLinkComponentProps {
    text: string;
    active: boolean;
    onClick: () => void;
}
function TabLinkComponent(props: TabLinkComponentProps) {
    const { text, onClick, active } = props;

    return (
        <div
            className={`${styles['tab-link']} ${active ? styles['active'] : ''}`}
            onClick={onClick}
            style={{
                color: active ? '' : ''
            }}>
            {text}
        </div>
    );
}

export default TabLinkComponent;
