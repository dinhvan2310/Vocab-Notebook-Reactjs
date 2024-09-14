import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import unsplash from '../../APIs/Unsplash/unsplashConfig';
import ImageLoading from '../../assets/animation/imageLoading.json';
import useDebounce from '../../hooks/useDebounce';
import { useMessage } from '../../hooks/useMessage';
import RowComponent from '../commonComponent/Row/RowComponent';
import EmptyComponent from '../Empty/EmptyComponent';
import InfiniteScroll from '../InfiniteScroll/InfiniteScrollComponent';
import SearchBoxComponent from '../SearchBox/SearchBoxComponent';

interface ImageSearchProps {
    onChoose: (url: string) => void;

    searchInitial?: string;
    perPage?: number;
    style?: React.CSSProperties;
    clasName?: string;
}
function ImageSearchComponent(props: ImageSearchProps) {
    // meta-data -------------------------------------------------------
    const { onChoose, clasName = '', style, searchInitial, perPage = 12 } = props;
    const message = useMessage();

    // state ------------------------------------------------------------
    const [searchText, setSearchText] = useState<string>(searchInitial || '');
    const searchDebounce = useDebounce(searchText, 500);
    const [photos, setPhotos] = useState<string[]>([]);

    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        if (photos.length !== 0) {
            setPhotos([]);
            setPage(1);
        }
    }, [searchDebounce]);

    useEffect(() => {
        (async () => {
            console.log(photos.length, page * perPage);
            if (page * perPage <= photos.length) return;
            try {
                const response = await unsplash.search.getPhotos({
                    query: searchDebounce,
                    page: page,
                    perPage: perPage
                });
                if (response.errors) {
                    console.log('error occurred: ', response.errors);
                    return [];
                }
                console.log('response: ', response.response.results);
                setPhotos((pre) => [
                    ...pre,
                    ...response.response.results.map((item) => item.urls.regular)
                ]);
                setTotalRows(response.response.total);
            } catch (error) {
                console.log('error: ', error);
                message(
                    'error',
                    `Error: Failed to fetch images from Unsplash, try again after a few minutes`
                );
                setPhotos([]);
                setTotalRows(1);
            }
        })();
    }, [page]);

    return (
        <div
            className={`${clasName}
            flex flex-col     
            h-full 
        `}
            style={style}>
            <RowComponent>
                <SearchBoxComponent
                    value={searchText}
                    onChange={(value) => setSearchText(value)}
                    searchWidth={'100%'}
                />
            </RowComponent>

            <div
                className="h-full overflow-y-auto
                scrollbar dark:scrollbarDark
                mt-4
            ">
                <InfiniteScroll
                    loader={
                        <Lottie
                            options={{ animationData: ImageLoading }}
                            height={100}
                            width={100}
                        />
                    }
                    className="
                    columns-2 md:columns-3 lg:columns-4 
                        gap-2.5
                        mr-4 ml-4
                    
                    "
                    fetchMore={() => setPage((prev) => prev + 1)}
                    hasMore={photos.length < totalRows}
                    endMessage={
                        <>
                            <EmptyComponent />
                        </>
                    }>
                    {photos.map((photo) => (
                        <div
                            style={{
                                breakInside: 'avoid',
                                marginBottom: 10,
                                display: 'inline-block',
                                width: '100%'
                            }}>
                            <img
                                src={photo}
                                className="
                                    hover:scale-[0.98]
                                "
                                alt="img"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    borderRadius: 10,
                                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                    cursor: 'pointer',
                                    transition: '0.3s'
                                }}
                                onClick={() => onChoose(photo)}
                            />
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default ImageSearchComponent;
