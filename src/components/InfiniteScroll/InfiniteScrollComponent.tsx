import { ReactNode, useEffect, useRef } from 'react';

interface InfiniteScrollProps {
    loader: ReactNode;
    fetchMore: () => void;
    hasMore: boolean;
    endMessage: ReactNode;
    className?: string;
    children: ReactNode;
    style?: React.CSSProperties;
}
const InfiniteScroll = (props: InfiniteScrollProps) => {
    const { loader, fetchMore, hasMore, endMessage, className = '', children, style } = props;
    const pageEndRef = useRef(null);
    useEffect(() => {
        if (hasMore) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    // kiểm tra element có nằm trong viewport không?
                    fetchMore();
                }
            });

            if (pageEndRef.current) {
                observer.observe(pageEndRef.current);
            }

            return () => {
                if (pageEndRef.current) {
                    observer.unobserve(pageEndRef.current);
                }
            };
        }
    }, [hasMore]);
    return (
        <div className={className} style={style}>
            {children}

            {hasMore ? <div ref={pageEndRef}>{loader}</div> : endMessage}
        </div>
    );
};

export default InfiniteScroll;
