import { useQuery } from '@tanstack/react-query';
import { Unsubscribe } from 'firebase/auth/web-extension';
import { Card, Element3, TableDocument, Text, Timer } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ListLoadingAnimation from '../../assets/animation/listLoading.json';
import NotFoundUser from '../../assets/image/no_avatar.png';
import CardComponent from '../../components/Card/CardComponent';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import SpinComponent from '../../components/commonComponent/Spin/SpinComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import EmptyComponent from '../../components/Empty/EmptyComponent';
import GridCol from '../../components/Grid/GridCol';
import GridRow from '../../components/Grid/GridRow';
import PaginationComponent from '../../components/Pagination/PaginationComponent';
import SearchBoxComponent from '../../components/SearchBox/SearchBoxComponent';
import SelectComponent from '../../components/Select/SelectComponent';
import { getFolders, onSnapshotFolders, removeFolder } from '../../firebase/folderAPI';
import { getUser } from '../../firebase/userAPI';
import { useAuth } from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { useResponsive } from '../../hooks/useResponsive';
import FolderType from '../../types/FolderType';
import './FoldersLayout.scss';

function FoldersLayout() {
    // State management -------------------------------------------------------------
    // user id from url params
    const { userid } = useParams();
    // current user who login in
    const { user: currentUser } = useAuth();

    const navigate = useNavigate();
    const { isTabletOrMobile, isDesktopOrLaptop, isMobile } = useResponsive();

    const viewModeOptions = (() => {
        if (isMobile)
            return [
                {
                    label: 'List',
                    value: 'list',
                    icon: <TableDocument size="16" />
                },
                {
                    label: 'Large card',
                    value: 'card',
                    icon: <Card size="16" />
                }
            ];
        else
            return [
                {
                    label: 'Table',
                    value: 'table',
                    icon: <Element3 size="16" />
                },
                {
                    label: 'List',
                    value: 'list',
                    icon: <TableDocument size="16" />
                },
                {
                    label: 'Large card',
                    value: 'card',
                    icon: <Card size="16" />
                }
            ];
    })();

    const [sortBy, setSortBy] = useState<'name_lowercase' | 'createAt'>();
    const sortByOptions = [
        { label: 'Name', value: 'name_lowercase', icon: <Text size="16" /> },
        { label: 'Date', value: 'createAt', icon: <Timer size="16" /> }
    ];

    useEffect(() => {
        console.log('isTabletOrMobile', isTabletOrMobile);
        console.log('isDesktopOrLaptop', isDesktopOrLaptop);
        console.log('isMobile', isMobile);
    }, [isTabletOrMobile, isDesktopOrLaptop, isMobile]);

    // Data
    // command state

    const [startAt, setStartAt] = useState(0);
    const [limit, setLimit] = useState(10);
    const [viewMode, setViewMode] = useState<'table' | 'list' | 'card'>();

    // set view mode to list if isMobile
    useEffect(() => {
        if (isMobile && viewMode === 'table') setViewMode('list');
    }, [isTabletOrMobile, isDesktopOrLaptop, isMobile]);

    const [currentPage, setCurrentPage] = useState(1);
    const limitPerPageOptions = [
        {
            label: '10',
            value: '10'
        },
        {
            label: '15',
            value: '15'
        },
        {
            label: '20',
            value: '20'
        }
    ];

    const [search, setSearch] = useState('');
    const deBoundSearch = useDebounce<string>(search, 500);
    // Get folders from data object and setFolders
    const fetchFolders = async () => {
        if (!userid) return null;
        const data = await getFolders(userid, deBoundSearch, sortBy, startAt, limit);
        return data;
    };
    // Query
    const query = useQuery({
        queryKey: ['folders', deBoundSearch, startAt, limit, userid, sortBy],
        queryFn: fetchFolders
    });

    const userQuery = useQuery({
        queryKey: ['user', userid],
        queryFn: async () => {
            if (!userid) return null;
            const data = await getUser(userid);
            return data;
        }
    });

    // snap shot folders when add or remove folder from database
    useEffect(() => {
        let unsubscribe: Unsubscribe;
        if (userid) {
            unsubscribe = onSnapshotFolders(userid, () => {
                query.refetch();
            });
        }
        return () => {
            // cleanup
            unsubscribe();
        };
    }, [userid]);
    //

    const handleNavigateToWordSets = (folder: FolderType) => {
        navigate(`/user/${userid}/folders/${folder.id_folder}`);
    };

    return (
        <div className="folder-layout-container" style={{}}>
            <div className="top-bar">
                {!isTabletOrMobile && (
                    <RowComponent alignItems="center">
                        <img
                            src={userQuery.data?.photoURL || NotFoundUser}
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
                                title={userQuery.data?.name || 'Unknown user'}
                                fontSize="1.5em"
                            />
                            <SpaceComponent height={4} />
                            <TextComponent text={userQuery.data?.email || '...'} fontSize="1.3em" />
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
                        backGroundColor="transparent"
                        borderType="none"
                        borderRadius={8}
                        style={{
                            backgroundColor: 'var(--bg-color)'
                        }}
                        borderColor="var(--border-color)"
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                        }}
                    />
                    {/* <FloatingActionButtonComponent
                        icon={<Sort size="20" />}
                        menuItems={topBar_commandBar_menuItems_sort}
                        text="Sort"
                        menuItemsPosition="left"
                        backgroundHoverColor="var(--bg-hover-color)"
                        backgroundActiveColor="var(--bg-active-color)"
                        containerStyle={{
                            height: '40px',
                            padding: '0 8px'
                        }}
                    /> */}
                </div>
            </div>
            <div className="flex flex-row justify-end mt-4">
                <SelectComponent
                    options={viewModeOptions}
                    title="View mode"
                    defaultValue={isMobile ? 'list' : 'table'}
                    value={viewMode}
                    positionPopup="bottom"
                    width="150px"
                    color="var(--secondary-text-color)"
                    style={{
                        backgroundColor: 'var(--bg-color)',
                        borderColor: 'var(--border-color)'
                    }}
                    optionStyle={{
                        backgroundColor: 'var(--bg-color)'
                    }}
                    hoverColor="var(--primary-color)"
                    onChange={(value) => {
                        setViewMode(value as 'table' | 'list' | 'card');
                    }}
                />
                <SpaceComponent width={8} />
                <SelectComponent
                    options={sortByOptions}
                    defaultValue="name_lowercase"
                    positionPopup="bottom"
                    width="120px"
                    color="var(--secondary-text-color)"
                    style={{
                        backgroundColor: 'var(--bg-color)',
                        borderColor: 'var(--border-color)'
                    }}
                    optionStyle={{
                        backgroundColor: 'var(--bg-color)'
                    }}
                    hoverColor="var(--primary-color)"
                    onChange={(value) => {
                        setSortBy(value as 'name_lowercase' | 'createAt');
                    }}
                    value={sortBy}
                    title="Sort by"
                />
            </div>
            <div
                className=" 
                mt-4
                px-4
                py-4
                scrollbar
                dark:scrollbarDark
                h-full
                w-full
                flex flex-row
                flex-wrap
                justify-center
                items-start
                gap-8
                overflow-y-auto
                overflow-x-hidden
            "
                style={{}}>
                {query.isLoading ? (
                    <SpinComponent
                        indicator={ListLoadingAnimation}
                        spinning={true}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    />
                ) : (
                    <GridRow gutter={[24, 24]} style={{}}>
                        {query.data?.folders.length === 0 && (
                            <EmptyComponent text="No folders found" />
                        )}
                        {query.data?.folders.map((folder, index) => {
                            return (
                                <GridCol
                                    span={
                                        // default view mode is table on pc/tablet and list on mobile
                                        viewMode === undefined
                                            ? isMobile
                                                ? 12 // list view mode
                                                : 4 // table view mode
                                            : // view mode is table
                                            viewMode === 'table'
                                            ? 4
                                            : viewMode === 'list'
                                            ? 12
                                            : viewMode === 'card'
                                            ? isMobile
                                                ? 12
                                                : isTabletOrMobile
                                                ? 6
                                                : 3
                                            : 12
                                    }
                                    key={index}>
                                    <CardComponent
                                        type={viewMode === 'card' ? 'card-image' : 'card-text'}
                                        imageSrc={folder.imageUrl}
                                        className="folder-card"
                                        style={{
                                            width: '100%',
                                            height: viewMode === 'card' ? '320px' : '100%'
                                        }}
                                        haveFloatingButton={true}
                                        createAt={new Date(
                                            folder.createAt?.seconds * 1000
                                        ).toDateString()}
                                        key={index}
                                        title={folder.name}
                                        hoverable={true}
                                        subTitle={folder.word_sets.length + ' word sets'}
                                        onClick={() => {
                                            handleNavigateToWordSets(folder);
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
                                                key: 'delete',
                                                disabled: currentUser?.uid !== userid
                                            }
                                        ]}
                                    />
                                </GridCol>
                            );
                        })}
                    </GridRow>
                )}
            </div>
            <SpaceComponent height={64} />
            <RowComponent
                className="footer-container"
                alignItems="center"
                justifyContent="flex-end">
                <PaginationComponent
                    align="right"
                    pageSize={limit}
                    color="var(--secondary-text-color)"
                    currentPage={currentPage}
                    numsButton={5}
                    total={query.data?.numOfTotalFolders as number}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        setStartAt((page - 1) * limit);
                    }}
                />
                <SpaceComponent width={16} />
                <SelectComponent
                    value={limit.toString()}
                    title="Limit per page"
                    positionPopup="top"
                    options={limitPerPageOptions}
                    onChange={(value) => {
                        setLimit(parseInt(value));
                    }}
                    width="100px"
                    color="var(--secondary-text-color)"
                    style={{
                        backgroundColor: 'var(--bg-color)',
                        borderColor: 'var(--border-color)'
                    }}
                    optionStyle={{
                        backgroundColor: 'var(--bg-color)'
                    }}
                    hoverColor="var(--primary-color)"
                />
            </RowComponent>
        </div>
    );
}

export default FoldersLayout;
