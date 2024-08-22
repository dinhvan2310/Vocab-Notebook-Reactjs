import React from 'react';

interface TextComponentProps {
    text: string | number;
    fontSize?: string;
    isVisible?: boolean;
    textColor?: string;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
}

function TextComponent(props: TextComponentProps) {
    const { text, style, fontSize, textColor, isVisible = 'false', className, children } = props;
    return (
        <div
            className={className}
            style={{
                visibility: isVisible ? 'visible' : 'hidden',
                fontSize: fontSize || '1.4em',
                fontWeight: 600,
                color: textColor || 'var(--secondary-text-color)',
                ...style
            }}>
            <p>{text || children}</p>
        </div>
    );
}

export default TextComponent;
