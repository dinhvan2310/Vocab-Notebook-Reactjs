import { Unsubscribe } from 'firebase/auth/web-extension';
import { ArrowCircleDown, ArrowCircleUp, CloseCircle, Sort } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CardComponent from '../../components/CardComponent/CardComponent';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import PaginationComponent from '../../components/commonComponent/Pagination/PaginationComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import EmptyComponent from '../../components/Empty/EmptyComponent';
import FloatingActionButtonComponent from '../../components/FloatingActionButton/FloatingActionButtonComponent';
import SearchBoxComponent from '../../components/SearchBox/SearchBoxComponent';
import { getFolders, onSnapshotFolders, removeFolder } from '../../firebase/folderAPI';
import useDebounce from '../../hooks/useDebounce';
import { useResponsive } from '../../hooks/useResponsive';
import FolderType from '../../types/FolderType';
import { MenuItemInterface } from '../../types/MenuItemType';
import './FoldersLayout.scss';

interface Data {
    folders: FolderType[];
    numOfTotalFolders: number;
}

function FoldersLayout() {
    // State management -------------------------------------------------------------
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { isTabletOrMobile } = useResponsive();

    // Data
    const [data, setData] = useState<Data>({ folders: [], numOfTotalFolders: 0 });
    // command state
    const [search, setSearch] = useState('');
    const deBoundSearch = useDebounce<string>(search, 500);
    // sort by name and date, but can chossen two options
    const [sortByName, setSortByName] = useState<'asc' | 'desc' | 'none'>('none');
    const [sortByDate, setSortByDate] = useState<'asc' | 'desc' | 'none'>('desc');
    const [startAt, setStartAt] = useState(0);
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Get folders from data object and setFolders
    const fetchFolders = async () => {
        const data = await getFolders(
            location.state.uid,
            deBoundSearch,
            sortByName,
            sortByDate,
            startAt,
            limit
        );
        setData(data);
    };
    //
    useEffect(() => {
        let unsubscribe: Promise<Unsubscribe>;
        if (username) {
            fetchFolders();
            unsubscribe = onSnapshotFolders(() => {
                // setFolders(folders);
                fetchFolders();
            });
        }
        return () => {
            // cleanup
            unsubscribe && unsubscribe.then((f) => f());
        };
    }, [username]);
    //
    useEffect(() => {
        fetchFolders();
    }, [deBoundSearch, sortByName, sortByDate, startAt, limit]);

    const topBar_commandBar_menuItems_sort: MenuItemInterface[] = [
        {
            text: `Name`,
            onClick: () => {
                setSortByName(
                    sortByName === 'asc' ? 'desc' : sortByName === 'desc' ? 'none' : 'asc'
                );
            },
            key: 'sort_by_name',
            icon:
                sortByName === 'asc' ? (
                    <ArrowCircleDown size="20" />
                ) : sortByName === 'desc' ? (
                    <ArrowCircleUp size="20" />
                ) : (
                    <CloseCircle size="20" />
                )
        },
        {
            text: 'Date',
            onClick: () => {
                setSortByDate(
                    sortByDate === 'asc' ? 'desc' : sortByDate === 'desc' ? 'none' : 'asc'
                );
            },
            key: 'sort_by_date',
            icon:
                sortByDate === 'asc' ? (
                    <ArrowCircleDown size="20" />
                ) : sortByName === 'desc' ? (
                    <ArrowCircleUp size="20" />
                ) : (
                    <CloseCircle size="20" />
                )
        }
    ];

    const handleNavigateToWordSets = (id_folder: string) => {
        navigate(`/user/${username}/folders/${id_folder}`);
    };

    return (
        <div className="folder-layout-container">
            <div className="top-bar">
                {!isTabletOrMobile && (
                    <RowComponent alignItems="center">
                        <img
                            src={location.state?.photoURL || ''}
                            alt="avatar"
                            style={{
                                objectFit: 'cover',
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%'
                            }}
                        />
                        <SpaceComponent width={16} />
                        <ColumnComponent alignItems="flex-start">
                            <TitleComponent
                                title={location.state?.displayName || ''}
                                fontSize="1.5em"
                            />
                            <SpaceComponent height={4} />
                            <TextComponent text={location.state?.email || ''} fontSize="1.3em" />
                        </ColumnComponent>
                    </RowComponent>
                )}
                {!isTabletOrMobile && <SpaceComponent width={64} />}
                <div
                    className="command-bar"
                    style={{
                        maxWidth: isTabletOrMobile ? '100%' : '600px'
                    }}>
                    <SearchBoxComponent
                        searchWidth={'100%'}
                        placeholder="Search folders"
                        backGroundColor="var(--bg-color)"
                        borderType="none"
                        borderRadius={0}
                        borderColor="var(--border-color)"
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                        }}
                    />
                    <SpaceComponent width={8} />
                    <FloatingActionButtonComponent
                        icon={<Sort size="20" />}
                        menuItems={topBar_commandBar_menuItems_sort}
                        text="Sort"
                        menuItemsPosition="left"
                        backgroundHoverColor="var(--bg-hover-color)"
                        backgroundActiveColor="var(--bg-active-color)"
                    />
                </div>
            </div>
            <div className="folders-container">
                <RowComponent
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    style={{
                        marginLeft: -8
                    }}>
                    {data.folders.length === 0 && <EmptyComponent text="No folders found" />}
                    {data.folders.map((folder, index) => {
                        return (
                            <CardComponent
                                className="folder-card"
                                haveFloatingButton={true}
                                createAt={folder.createAt.toDate().toUTCString()}
                                key={index}
                                title={folder.name}
                                hoverable={true}
                                subTitle={folder.word_sets.length + ' word sets'}
                                onClick={() => {
                                    handleNavigateToWordSets(folder.id_folder || '');
                                }}
                                style={{
                                    width:
                                        isTabletOrMobile || data.folders.length === 1
                                            ? '100%'
                                            : 'calc(50% - 16px)',
                                    margin: 8
                                }}
                                menuItems={[
                                    {
                                        text: 'Delete',
                                        onClick: async () => {
                                            await removeFolder(folder.id_folder || '');
                                            // setFolders(
                                            //     folders.filter(
                                            //         (f) => f.id_folder !== folder.id_folder
                                            //     )
                                            // );
                                        },
                                        key: 'delete'
                                    }
                                ]}
                            />
                        );
                    })}
                </RowComponent>
            </div>
            <SpaceComponent height={64} />
            <PaginationComponent
                align="right"
                pageSize={limit}
                currentPage={currentPage}
                numsButton={5}
                total={data.numOfTotalFolders}
                onPageChange={(page) => {
                    setCurrentPage(page);
                    setStartAt((page - 1) * limit);
                }}
            />
        </div>
    );
}

export default FoldersLayout;
