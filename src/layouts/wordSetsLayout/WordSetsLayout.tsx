import { useQuery } from '@tanstack/react-query';
import { Unsubscribe } from 'firebase/firestore';
import {
    Add,
    ArrowCircleDown,
    ArrowCircleUp,
    CloseCircle,
    Edit2,
    FolderAdd,
    FolderCross,
    More,
    Refresh2,
    Sort
} from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ListLoadingAnimation from '../../assets/animation/listLoading.json';
import CardComponent from '../../components/Card/CardComponent';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import SpinComponent from '../../components/commonComponent/Spin/SpinComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import EmptyComponent from '../../components/Empty/EmptyComponent';
import FloatingActionButtonComponent from '../../components/FloatButton/FloatingActionButtonComponent';
import GridCol from '../../components/Grid/GridCol';
import GridRow from '../../components/Grid/GridRow';
import SearchBoxComponent from '../../components/SearchBox/SearchBoxComponent';
import { getWordSets, onSnapshotWordSets } from '../../firebase/wordSetAPI';
import { useResponsive } from '../../hooks/useResponsive';
import { MenuItemInterface } from '../../types/MenuItemType';
import './WordSetsLayout.scss';
import { getFolder } from '../../firebase/folderAPI';
import { useAuth } from '../../hooks/useAuth';

function WordSetsLayout() {
    const { userid, folderid } = useParams();
    // destructuring user from useAuth and change variable name
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const { isTabletOrMobile, isMobile } = useResponsive();

    const [search, setSearch] = useState('');
    // sort by name and date, but can chossen two options
    const [sortByName, setSortByName] = useState<'asc' | 'desc' | 'none'>('none');
    const [sortByDate, setSortByDate] = useState<'asc' | 'desc' | 'none'>('desc');

    const query = useQuery({
        queryKey: ['wordSets', folderid],
        queryFn: async () => {
            const data = await getWordSets(folderid);
            return data;
        }
    });

    const folderQuery = useQuery({
        queryKey: ['folders', userid],
        queryFn: async () => {
            const data = await getFolder(folderid);
            return data;
        }
    });

    useEffect(() => {
        let unsubscribe: Unsubscribe;
        if (userid) {
            console.log(folderid);
            unsubscribe = onSnapshotWordSets(folderid, () => {
                query.refetch();
            });
        }
        return () => {
            unsubscribe();
        };
    }, [userid, folderid]);
    //

    const topBar_command_1: MenuItemInterface[] = [
        {
            key: 'create_wordset',
            text: 'Create Word Set',
            icon: <FolderAdd size="20" />,
            onClick: () => {
                navigate(`/create-wordset?inFolder=${folderid}`);
            },
            disabled: currentUser?.uid !== folderQuery.data?.id_user
        }
    ];
    const topBar_command_2: MenuItemInterface[] = [
        {
            key: 'delete_folder',
            text: 'Delete Folder',
            onClick: () => {
                console.log('delete folder');
            },
            icon: <FolderCross size="20" />,
            disabled: currentUser?.uid !== folderQuery.data?.id_user
        },
        {
            key: 'edit_folder',
            text: 'Edit Folder',
            onClick: () => {
                console.log('edit folder');
            },
            icon: <Edit2 size="20" />,
            disabled: currentUser?.uid !== folderQuery.data?.id_user
        }
    ];
    const topBar_query_menuItems_sort: MenuItemInterface[] = [
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
                    <ArrowCircleUp size="20" />
                ) : sortByName === 'desc' ? (
                    <ArrowCircleDown size="20" />
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
                    <ArrowCircleUp size="20" />
                ) : sortByDate === 'desc' ? (
                    <ArrowCircleDown size="20" />
                ) : (
                    <CloseCircle size="20" />
                )
        }
    ];
    return (
        <div className="wordset-layout-container" style={{}}>
            <ColumnComponent className="top-bar">
                <RowComponent className="top-bar-header" justifyContent="space-between">
                    <TitleComponent title={folderQuery.data?.name ?? ''} fontSize="3.2em" />
                    <RowComponent className="top-bar-header-command">
                        <ButtonComponent
                            style={{
                                height: '40px',
                                paddingLeft: '16px',
                                paddingRight: '16px'
                            }}
                            text="Study"
                            onClick={() => {}}
                            backgroundColor="var(--bg-color)"
                            backgroundHoverColor="var(--bg-hover-color)"
                            backgroundActiveColor="var(--bg-active-color)"
                            isBorder={true}
                            textColor="var(--secondary-text-color)"
                        />
                        <SpaceComponent width={8} />
                        <FloatingActionButtonComponent
                            containerStyle={{
                                height: '40px',
                                width: '40px',
                                border: '1px solid var(--border-color)'
                            }}
                            backgroundColor="var(--bg-color)"
                            backgroundHoverColor="var(--bg-hover-color)"
                            backgroundActiveColor="var(--bg-active-color)"
                            icon={<Add size={26} />}
                            menuItems={topBar_command_1}
                        />
                        <SpaceComponent width={8} />
                        <FloatingActionButtonComponent
                            containerStyle={{
                                height: '40px',
                                width: '40px',
                                border: '1px solid var(--border-color)'
                            }}
                            backgroundColor="var(--bg-color)"
                            backgroundHoverColor="var(--bg-hover-color)"
                            backgroundActiveColor="var(--bg-active-color)"
                            icon={<More size={26} />}
                            menuItems={topBar_command_2}
                        />
                    </RowComponent>
                </RowComponent>
                <SpaceComponent height={16} />
                <RowComponent className="top-bar-query" justifyContent="space-between">
                    <RowComponent
                        style={{
                            display: isMobile ? 'none' : 'flex'
                        }}>
                        <Refresh2 size={18} color="var(--secondary-text-color)" />
                        <SpaceComponent width={12} />
                        <TextComponent
                            style={{
                                textWrap: 'nowrap'
                            }}
                            text={`Last updated:\u00A0 \u00A0 ${new Date(
                                (folderQuery.data?.modifiedAt.seconds || 0) * 1000
                            ).toDateString()}`}
                        />
                    </RowComponent>
                    <RowComponent
                        justifyContent="flex-end"
                        style={{
                            width: '100%'
                        }}>
                        <SearchBoxComponent
                            searchWidth={isMobile ? '100%' : '350px'}
                            placeholder="Search folders"
                            backGroundColor="var(--bg-color)"
                            borderType="none"
                            borderRadius={8}
                            value={search}
                            onChange={(value) => {
                                setSearch(value);
                            }}
                        />
                        <FloatingActionButtonComponent
                            icon={<Sort size="20" />}
                            menuItems={topBar_query_menuItems_sort}
                            text="Sort"
                            containerStyle={{
                                height: '40px',
                                padding: '0 8px'
                            }}
                            menuItemsPosition="left"
                            backgroundColor="transparent"
                            backgroundHoverColor="var(--bg-hover-color)"
                            backgroundActiveColor="var(--bg-active-color)"
                        />
                    </RowComponent>
                </RowComponent>
            </ColumnComponent>

            <div className="word-sets-container" style={{}}>
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
                    <GridRow
                        gutter={[24, 24]}
                        style={{
                            height: '100%'
                        }}>
                        {query.data?.length === 0 && <EmptyComponent text="No folders found" />}
                        {query.data?.map((wordSet, index) => {
                            return (
                                <GridCol
                                    span={isTabletOrMobile || query.data?.length === 1 ? 12 : 6}
                                    key={index}>
                                    <CardComponent
                                        className="folder-card"
                                        haveFloatingButton={true}
                                        createAt={new Date(
                                            wordSet.createAt?.seconds * 1000
                                        ).toDateString()}
                                        key={index}
                                        title={wordSet.name}
                                        hoverable={true}
                                        subTitle={wordSet.words.length + ' words'}
                                        onClick={() => {
                                            // handleNavigateToWordSets(folder);
                                        }}
                                        // style={{
                                        //     width:
                                        //         isTabletOrMobile || query.data?.folders.length === 1
                                        //             ? '100%'
                                        //             : 'calc(50% - 16px)',
                                        //     margin: 8
                                        // }}
                                        menuItems={[
                                            {
                                                text: 'Delete',
                                                onClick: async () => {
                                                    // await removeFolder(folder.id_folder || '');
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
                                </GridCol>
                            );
                        })}
                    </GridRow>
                )}
            </div>
        </div>
    );
}

export default WordSetsLayout;
