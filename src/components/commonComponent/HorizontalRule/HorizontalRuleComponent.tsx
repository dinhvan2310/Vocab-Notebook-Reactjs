import React from 'react';

interface HorizontalRuleComponentProps {
    text: string;
    style?: React.CSSProperties;
    className?: string;
    type: 'center' | 'left' | 'right';
}

function HorizontalRuleComponent(props: HorizontalRuleComponentProps) {
    const { text, style, className = '', type = 'center' } = props;
    return (
        <div
            className={`${className}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                margin: '16px 0',
                ...style
            }}>
            <div
                style={{
                    height: 1,
                    backgroundColor: 'var(--border-color)',
                    flex: type === 'center' || type === 'right' ? 1 : 0
                }}
            />
            <div
                style={{
                    margin: '0 8px',
                    color: 'var(--secondary-text-color)',
                    fontSize: 16,
                    fontWeight: 600
                }}>
                {text}
            </div>
            <div
                style={{
                    flex: type === 'center' || type === 'left' ? 1 : 0,
                    height: 1,
                    backgroundColor: 'var(--border-color)'
                }}
            />
        </div>
    );
}

export default HorizontalRuleComponent;
