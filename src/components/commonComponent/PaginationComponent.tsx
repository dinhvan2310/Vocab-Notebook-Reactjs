import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import './Pagination.scss';
import TextComponent from './TextComponent';

interface PaginationProps {
    total: number;
    currentPage: number;
    pageSize: number;
    numsButton?: number;

    onPageChange: (page: number, pageSize: number) => void;

    color?: string;
    activeColor?: string;
    align?: 'left' | 'center' | 'right';
}
function PaginationComponent(props: PaginationProps) {
    const {
        total,
        color = 'var(--text-color)',
        currentPage = 1,
        pageSize = 10,
        activeColor = 'var(--primary-color)',
        numsButton = 5,
        align = 'left',
        onPageChange = () => {}
    } = props;

    // state

    const totalPages = Math.ceil(total / pageSize);
    console.log(totalPages);
    const pages = [];

    // chỉ hiện thị 5 nút ở giữa khi tổng số trang lớn hơn 5 trang
    const firstPage = 1;
    const lastPage = totalPages;

    if (totalPages > numsButton) {
        const start = Math.max(1, currentPage - Math.floor(numsButton / 2));
        const end = Math.min(totalPages, start + numsButton - 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
    } else {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
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
                <div
                    className="pagination__prev"
                    onClick={() => {
                        if (currentPage === 1) return;
                        onPageChange(currentPage - 1, pageSize);
                    }}
                    style={{
                        color: currentPage === 1 ? color : activeColor,
                        // chặn hành vi bấm
                        pointerEvents: currentPage === 1 ? 'none' : 'auto'
                    }}>
                    <ArrowLeft2 fontSize={20} />
                </div>

                <div className="pagination__pages">
                    {totalPages > numsButton &&
                        !pages.find((page) => {
                            return page === firstPage;
                        }) &&
                        currentPage > Math.ceil(numsButton / 2) && (
                            <>
                                <div
                                    className={`pagination__page`}
                                    onClick={() => onPageChange(firstPage, pageSize)}>
                                    <TextComponent
                                        text={firstPage}
                                        fontSize="1.4em"
                                        textColor={color}
                                    />
                                </div>
                                <div className="pagination__page">
                                    <TextComponent text="..." fontSize="1.4em" textColor={color} />
                                </div>
                            </>
                        )}
                    {pages.map((page) => {
                        return (
                            <div
                                key={page}
                                className={`pagination__page`}
                                style={{
                                    borderColor: currentPage === page ? activeColor : 'transparent'
                                }}
                                onClick={() => onPageChange(page, pageSize)}>
                                <TextComponent
                                    text={page}
                                    fontSize="1.4em"
                                    textColor={currentPage === page ? activeColor : color}
                                />
                            </div>
                        );
                    })}
                    {totalPages > numsButton &&
                        !pages.find((page) => {
                            return page === lastPage;
                        }) &&
                        currentPage < totalPages - Math.ceil(numsButton / 2) && (
                            <>
                                <div className="pagination__page">
                                    <TextComponent text="..." fontSize="1.4em" textColor={color} />
                                </div>
                                <div
                                    className={`pagination__page`}
                                    onClick={() => onPageChange(lastPage, pageSize)}>
                                    <TextComponent
                                        text={lastPage}
                                        fontSize="1.4em"
                                        textColor={color}
                                    />
                                </div>
                            </>
                        )}
                </div>

                <div
                    className="pagination__next"
                    onClick={() => {
                        if (currentPage === lastPage) return;
                        onPageChange(currentPage + 1, pageSize);
                    }}
                    style={{
                        color: currentPage === lastPage ? color : activeColor,
                        // chặn hành vi bấm
                        pointerEvents: currentPage === lastPage ? 'none' : 'auto'
                    }}>
                    <ArrowRight2 fontSize={20} />
                </div>
            </div>
        </div>
    );
}

export default PaginationComponent;