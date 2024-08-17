import React from 'react';

interface TextComponentProps {
    text: string;
    fontSize?: string;
    textColor?: string;
    style?: React.CSSProperties;
}

function TextComponent(props: TextComponentProps) {
    const { text, style, fontSize, textColor } = props;
    return (
        <div
            style={{
                fontSize: fontSize || '1.4em',
                fontWeight: 600,
                color: textColor || 'var(--secondary-text-color)',
                ...style
            }}>
            {text}
        </div>
    );
}

export default TextComponent;
