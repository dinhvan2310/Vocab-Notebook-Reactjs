import { ArrowDown2, ArrowUp2, Sort } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CardComponent from '../../components/CardComponent/CardComponent';
import ColumnComponent from '../../components/commonComponent/ColumnComponent';
import RowComponent from '../../components/commonComponent/RowComponent';
import SpaceComponent from '../../components/commonComponent/SpaceComponent';
import TextComponent from '../../components/commonComponent/TextComponent';
import TitleComponent from '../../components/commonComponent/TitleComponent';
import FloatingActionButtonComponent from '../../components/FloatingActionButton/FloatingActionButtonComponent';
import SearchBoxComponent from '../../components/SearchBox/SearchBoxComponent';
import { getFolders, onSnapshotFolders, removeFolder } from '../../firebase/folderAPI';
import { useResponsive } from '../../hooks/useResponsive';
import FolderType from '../../types/FolderType';
import { MenuItemInterface } from '../../types/MenuItemType';
import './FoldersLayout.scss';
import { Firestore, onSnapshot } from 'firebase/firestore';
import useDebounce from '../../hooks/useDebounce';
import { ActionCodeURL, Unsubscribe } from 'firebase/auth/web-extension';

function FoldersLayout() {
    // State management -------------------------------------------------------------
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { isTabletOrMobile } = useResponsive();

    // Data
    const [folders, setFolders] = useState<FolderType[]>([]);
    // command state
    const [search, setSearch] = useState('');
    const deBoundSearch = useDebounce<string>(search, 500);

    useEffect(() => {
        let unsubscribe: Promise<Unsubscribe>;
        const fetchFolders = async () => {
            const folders: FolderType[] = (await getFolders(
                location.state.uid,
                deBoundSearch
            )) as FolderType[];
            setFolders(folders);
        };
        if (username) {
            fetchFolders();

            unsubscribe = onSnapshotFolders((folders) => {
                setFolders(folders);
            });
        }

        return () => {
            // cleanup
            unsubscribe && unsubscribe.then((f) => f());
        };
    }, [username, deBoundSearch]);

    const topBar_commandBar_menuItems_sort: MenuItemInterface[] = [
        {
            text: 'Name',
            onClick: () => {
                // sort_by === 'name' ? setSortBy('name_desc') : setSortBy('name');
            },
            key: 'sort_by_name',
            icon: <ArrowDown2 size="20" />
        },
        {
            text: 'Date',
            onClick: () => {
                // sort_by === 'createAt' ? setSortBy('createAt_desc') : setSortBy('createAt');
            },
            key: 'sort_by_date',
            icon: <ArrowDown2 size="20" />
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
                    {folders.map((folder, index) => {
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
                                    width: isTabletOrMobile ? '100%' : 'calc(50% - 16px)',
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
        </div>
    );
}

export default FoldersLayout;
