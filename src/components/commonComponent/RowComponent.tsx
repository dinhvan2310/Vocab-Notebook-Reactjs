import React from 'react';

interface RowComponentProps {
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
function RowComponent(props: RowComponentProps) {
    const { children, justifyContent, alignItems, flexWrap, style } = props;
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: justifyContent || 'flex-start',
                alignItems: alignItems || 'flex-start',
                flexWrap: flexWrap || 'nowrap',
                ...style
            }}>
            {children}
        </div>
    );
}

export default RowComponent;