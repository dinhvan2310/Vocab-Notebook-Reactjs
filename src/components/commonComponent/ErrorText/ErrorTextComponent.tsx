import React from 'react';
import styles from './ErrorTextComponent.module.css';

interface ErrorTextComponentProps {
    text: string;
}

function ErrorTextComponent(props: ErrorTextComponentProps) {
    const { text } = props;

    return <div className={styles['container']}>{text}</div>;
}

export default ErrorTextComponent;
