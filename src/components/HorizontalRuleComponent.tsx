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
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}
            />
            <div
                style={{
                    margin: '0 8px',
                    color: 'rgba(0, 0, 0, 0.5)',
                    fontSize: 16,
                    fontWeight: 600
                }}>
                {text}
            </div>
            <div
                style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}
            />
        </div>
    );
}

export default HorizontalRuleComponent;
