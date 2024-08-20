import React from 'react';

interface HorizontalRuleComponentProps {
    text: string;
}

function HorizontalRuleComponent(props: HorizontalRuleComponentProps) {
    const { text } = props;
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                margin: '16px 0'
            }}>
            <div
                style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'var(--border-color)'
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
                    flex: 1,
                    height: 1,
                    backgroundColor: 'var(--border-color)'
                }}
            />
        </div>
    );
}

export default HorizontalRuleComponent;
