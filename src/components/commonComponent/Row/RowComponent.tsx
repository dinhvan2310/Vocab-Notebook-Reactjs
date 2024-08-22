import React from 'react';

interface RowComponentProps {
    children: React.ReactNode;
    className?: string;
    justifyContent?:
        | 'center'
        | 'flex-start'
        | 'flex-end'
        | 'space-between'
        | 'space-around'
        | 'space-evenly';
    alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
    flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
    onClick?: () => void;
    style?: React.CSSProperties;
}
function RowComponent(props: RowComponentProps) {
    const { children, justifyContent, alignItems, flexWrap, style, className, onClick } = props;
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: justifyContent || 'center',
                alignItems: alignItems || 'center',
                flexWrap: flexWrap || 'nowrap',
                ...style
            }}>
            {children}
        </div>
    );
}

export default RowComponent;
