import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import './Pagination.scss';

interface PaginationProps {
    total: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number, pageSize: number) => void;
    color?: string;
    align: 'left' | 'center' | 'right';
}
function PaginationComponent(props: PaginationProps) {
    const {
        total,
        color = 'var(--text-color)',
        currentPage = 1,
        pageSize = 10,
        align = 'left',
        onPageChange = () => {}
    } = props;
    const totalPages = Math.ceil(total / pageSize);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div
            className="pagination-container"
            style={{
                color: color
            }}>
            <div
                className="pagination"
                style={{
                    justifyContent:
                        align === 'center'
                            ? 'center'
                            : align === 'right'
                            ? 'flex-end'
                            : 'flex-start'
                }}>
                <div className="pagination__prev">
                    <ArrowLeft2 fontSize={20} />
                </div>

                <div className="pagination__pages">
                    {pages.map((page) => (
                        <div
                            key={page}
                            className={`pagination__page ${currentPage === page ? 'active' : ''}`}
                            onClick={() => onPageChange(page, pageSize)}>
                            {page}
                        </div>
                    ))}
                </div>

                <div className="pagination__next">
                    <ArrowRight2 fontSize={20} />
                </div>
            </div>
        </div>
    );
}

export default PaginationComponent;
