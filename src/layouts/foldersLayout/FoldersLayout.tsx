import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import FloatingActionButtonComponent from '../../components/FloatingActionButton/FloatingActionButtonComponent';
import { getFolders, removeFolder } from '../../firebase/folderAPI';
import FolderType from '../../types/FolderType';
import { ArrowDown2, ArrowUp2, Grid2, HambergerMenu, Sort, TextalignRight } from 'iconsax-react';
import './FoldersLayout.scss';
import { MenuItemInterface } from '../../types/MenuItemType';
import SpaceComponent from '../../components/commonComponent/SpaceComponent';
import TitleComponent from '../../components/commonComponent/TitleComponent';
import SearchBoxComponent from '../../components/SearchBox/SearchBoxComponent';
import ColumnComponent from '../../components/commonComponent/ColumnComponent';
import TextComponent from '../../components/commonComponent/TextComponent';
import RowComponent from '../../components/commonComponent/RowComponent';
import { useResponsive } from '../../hooks/useResponsive';
import CardComponent from '../../components/CardComponent/CardComponent';

function FoldersLayout() {
    const { username } = useParams();
    const location = useLocation();

    const { isTabletOrMobile } = useResponsive();

    const [viewMode, setViewMode] = useState<'list' | 'smallList'>('list');

    const [folders, setFolders] = useState<FolderType[]>([]);
    useEffect(() => {
        const fetchFolders = async () => {
            const folders: FolderType[] = (await getFolders(location.state.uid)) as FolderType[];
            console.log(folders);
            setFolders(folders);
        };
        if (username) {
            fetchFolders();
        }
    }, [username]);

    const topBar_commandBar_menuItems_sort: MenuItemInterface[] = [
        {
            text: 'Name',
            onClick: () => {
                console.log('Sort by Name');
            },
            key: 'sort_by_name',
            icon: <ArrowDown2 size="20" />
        },
        {
            text: 'Date',
            onClick: () => {
                console.log('Sort by Date');
            },
            key: 'sort_by_date',
            icon: <ArrowUp2 size="20" />
        }
    ];

    const topBar_commandBar_menuItems_view: MenuItemInterface[] = [
        {
            onClick: () => {
                setViewMode('list');
            },
            icon: <HambergerMenu size="20" />,
            key: 'view_as_list',
            text: 'List'
        },
        {
            text: 'Small List',
            onClick: () => {
                setViewMode('smallList');
            },
            key: 'view_as_small_list',
            icon: <Grid2 size="20" />
        }
    ];

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
                    <SpaceComponent width={8} />
                    <FloatingActionButtonComponent
                        icon={<TextalignRight size="20" />}
                        menuItems={topBar_commandBar_menuItems_view}
                        text="View"
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
                                createAt={folder.createAt.toDate().toDateString()}
                                key={index}
                                title={folder.name}
                                hoverable={true}
                                subTitle={folder.nums_word_sets + ' word sets'}
                                // onClick={() => {
                                //     console.log('Folder clicked');
                                // }}
                                style={{
                                    width: viewMode === 'list' ? 'calc(100%)' : 'calc(50% - 16px)',
                                    margin: '8px'
                                }}
                                menuItems={[
                                    {
                                        text: 'Delete',
                                        onClick: async () => {
                                            console.log(folder.id_folder);
                                            await removeFolder(folder.id_folder || '');
                                            setFolders(
                                                folders.filter(
                                                    (f) => f.id_folder !== folder.id_folder
                                                )
                                            );
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
