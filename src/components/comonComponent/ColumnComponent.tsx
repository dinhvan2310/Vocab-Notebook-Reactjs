import React from 'react';

interface ColumnComponentProps {
    children: React.ReactNode;
    justifyContent?:
        | 'center'
        | 'flex-start'
        | 'flex-end'
        | 'space-between'
        | 'space-around'
        | 'space-evenly';
    alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
    flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
    style?: React.CSSProperties;
}
function ColumnComponent(props: ColumnComponentProps) {
    const { children, justifyContent, alignItems, flexWrap, style } = props;
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: justifyContent || 'center',
                alignItems: alignItems || 'center',
                flexWrap: flexWrap || 'wrap',
                ...style
            }}>
            {children}
        </div>
    );
}

export default ColumnComponent;
