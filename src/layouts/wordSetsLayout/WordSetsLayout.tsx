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
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import FloatingActionButtonComponent from '../../components/FloatButton/FloatingActionButtonComponent';
import useDebounce from '../../hooks/useDebounce';
import { useResponsive } from '../../hooks/useResponsive';
import './WordSetsLayout.scss';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import SearchBoxComponent from '../../components/SearchBox/SearchBoxComponent';
import { MenuItemInterface } from '../../types/MenuItemType';
import { Timestamp } from 'firebase/firestore';

function WordSetsLayout() {
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { isTabletOrMobile, isMobile } = useResponsive();

    const [search, setSearch] = useState('');
    const deBoundSearch = useDebounce<string>(search, 500);
    // sort by name and date, but can chossen two options
    const [sortByName, setSortByName] = useState<'asc' | 'desc' | 'none'>('none');
    const [sortByDate, setSortByDate] = useState<'asc' | 'desc' | 'none'>('desc');
    const [startAt, setStartAt] = useState(0);
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    console.log(location.state);

    const topBar_command_1: MenuItemInterface[] = [
        {
            key: 'create_wordset',
            text: 'Create Word Set',
            icon: <FolderAdd size="20" />,
            onClick: () => {
                navigate(`/create-wordset?$inFolder=${location.state.folder.id_folder}`, {
                    state: {
                        folder: location.state.folder
                    }
                });
            }
        }
    ];
    const topBar_command_2: MenuItemInterface[] = [
        {
            key: 'delete_folder',
            text: 'Delete Folder',
            onClick: () => {
                console.log('delete folder');
            },
            icon: <FolderCross size="20" />
        },
        {
            key: 'edit_folder',
            text: 'Edit Folder',
            onClick: () => {
                console.log('edit folder');
            },
            icon: <Edit2 size="20" />
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
                    <TitleComponent title={location.state.folder.name} fontSize="3.2em" />
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
                                border: '2px solid var(--border-color)'
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
                                border: '2px solid var(--border-color)'
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
                                location.state.folder.modifiedAt?.seconds * 1000
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
                            backGroundColor="var(--bg-active-color)"
                            borderType="none"
                            borderRadius={8}
                            borderColor="var(--border-color)"
                            value={search}
                            onChange={(value) => {
                                setSearch(value);
                            }}
                        />
                        <SpaceComponent width={8} />
                        <FloatingActionButtonComponent
                            icon={<Sort size="20" />}
                            menuItems={topBar_query_menuItems_sort}
                            text="Sort"
                            menuItemsPosition="left"
                            backgroundHoverColor="var(--bg-hover-color)"
                            backgroundActiveColor="var(--bg-active-color)"
                        />
                    </RowComponent>
                </RowComponent>
            </ColumnComponent>
        </div>
    );
}

export default WordSetsLayout;
