interface LinkComponentProps {
    children: React.ReactNode;
    onClick?(event: React.MouseEvent<HTMLAnchorElement>): void;
    href?: string;

    style?: React.CSSProperties;
    className?: string;
}
function LinkComponent(props: LinkComponentProps) {
    const { children, onClick, href, style, className = '' } = props;

    return (
        <a
            href={href}
            onClick={onClick}
            style={style}
            className={`${className}
            cursor-pointer
            underline 
        `}>
            {children}
        </a>
    );
}

export default LinkComponent;
