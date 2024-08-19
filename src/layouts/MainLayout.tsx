import {
    Add,
    Additem,
    Award,
    Folder,
    FolderAdd,
    HambergerMenu,
    Home,
    LampOn,
    LampSlash,
    Logout,
    NotificationStatus,
    Setting
} from 'iconsax-react';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import RowComponent from '../components/commonComponent/RowComponent';
import SpaceComponent from '../components/commonComponent/SpaceComponent';
import ButtonComponent from '../components/commonComponent/ButtonComponent';
import { useAuth } from '../hooks/useAuth';
import './MainLayout.scss';
import FloatingActionButtonComponent from '../components/FloatingActionButton/FloatingActionButtonComponent';
import SearchBoxComponent from '../components/SearchBox/SearchBoxComponent';
import MenuItemsComponent from '../components/MenuItems/MenuItemsComponent';
import ColumnComponent from '../components/commonComponent/ColumnComponent';
import TitleComponent from '../components/commonComponent/TitleComponent';
import TextComponent from '../components/commonComponent/TextComponent';
import { MenuItemInterface } from '../types/MenuItemType';
import useTheme from '../hooks/useTheme';
import ModalComponent from '../components/ModalComponent/ModalComponent';
import FormItemType from '../types/FormItemType';
import FormComponent from '../components/FormComponent/FormComponent';
import { addFolder } from '../firebase/folderAPI';
import FolderType from '../types/FolderType';
import { Timestamp } from 'firebase/firestore';

function MainLayout() {
    //  state declaration ---------------------------------------------------------------
    // navigation
    const navigate = useNavigate();
    // theme
    const { theme, setTheme } = useTheme();
    // auth
    const { user, signOut } = useAuth();
    // search value in the search box
    const [searchValue, setSearchValue] = React.useState('');
    // keep track of the active page in the sidebar menu
    const [activePage, setActivePage] = React.useState<'home' | 'folders' | 'exams'>('home');

    // open modal to add new folder
    const [openModalAddNewFolder, setOpenModalAddNewFolder] = useState(false);
    // new folder name relate add add new folder modal
    const [createFolder_name, setCreateFolder_name] = useState<string>('');
    // function declaration ---------------------------------------------------------------
    const handleNavigatePage = (key: 'home' | 'folders' | 'exams') => {
        setActivePage(key);
        switch (key) {
            case 'home':
                navigate('/');
                break;
            case 'folders':
                navigate(`/user/${user?.displayName}/folders`, {
                    state: {
                        uid: user?.uid,
                        displayName: user?.displayName,
                        photoURL: user?.photoURL,
                        email: user?.email
                    }
                });
                break;
            case 'exams':
                navigate('/exams');
                break;
        }
    };

    //  data declaration ---------------------------------------------------------------
    // ADD MENU ITEMS - floating action button
    // function to add a new folder
    const formItems: FormItemType[] = [
        {
            label: 'Folder Name',
            type: 'text',
            placeholder: 'Enter folder name',
            value: createFolder_name,
            onChange: (value) => {
                setCreateFolder_name(value);
            }
        }
    ];
    const handleAddFolder = () => {
        setOpenModalAddNewFolder(true);
    };
    const handleAddFolderFinish = async () => {
        const folder: FolderType = {
            name: createFolder_name,
            id_user: user?.uid || '',
            createAt: Timestamp.now(),
            nums_word_sets: 0,
            modifiedAt: Timestamp.now()
        };
        await addFolder(folder);
        setOpenModalAddNewFolder(false);
        setCreateFolder_name('');
    };
    const menuItemsAdd: MenuItemInterface[] = [
        {
            text: 'Học phần',
            icon: <Additem size={20} />,
            key: 'subject',
            onClick: () => console.log('Học phần')
        },
        {
            text: 'Thư mục',
            icon: <FolderAdd size="20" />,
            key: 'folder',
            onClick: handleAddFolder
        }
    ];

    // SETTING MENU ITEMS
    // function to change the theme of the app
    const handleChangeTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    const menuItemsSetting: MenuItemInterface[] = [
        {
            key: 'achievement',
            text: 'Thành tựu',
            icon: <Award size={20} />,
            onClick: () => console.log('Thành tựu')
        },
        {
            key: 'setting',
            text: 'Cài đặt',
            icon: <Setting size={20} />,
            onClick: () => console.log('Cài đặt')
        },
        {
            key: 'theme',
            text: theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng',
            icon: theme === 'light' ? <LampSlash size={20} /> : <LampOn size={20} />,
            onClick: handleChangeTheme
        },
        {
            key: 'logout',
            text: 'Đăng xuất',
            icon: <Logout size={20} />,
            onClick: () => signOut(),
            borderType: 'top-bottom'
        },
        {
            key: 'help',
            text: 'Trợ giúp',
            onClick: () => console.log('Trợ giúp')
        },
        {
            key: 'introduce',
            text: 'Giới thiệu',
            onClick: () => console.log('Giới thiệu')
        },
        {
            key: 'rate',
            text: 'Đánh giá',
            onClick: () => console.log('Đánh giá')
        }
    ];

    // SIDEBAR MENU ITEMS
    const menuItemsSideBar: MenuItemInterface[] = [
        {
            key: 'home',
            text: 'Trang chủ',
            icon: <Home size={20} />
        },
        {
            key: 'folders',
            text: 'Thư mục của bạn',
            icon: <Folder size={20} />,
            onClick: () => handleNavigatePage('folders')
        },
        {
            key: 'exams',
            text: 'Đề thi online',
            icon: <NotificationStatus size={20} />
        }
    ];

    // render --------------------------------------------------------------------------------------------
    // setting header for the setting button
    const menuItemsSettingHeader = (
        <RowComponent alignItems="center">
            <img
                src={user?.photoURL || ''}
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
                <TitleComponent title={user?.displayName || ''} fontSize="1.5em" />
                <SpaceComponent height={4} />
                <TextComponent text={user?.email || ''} fontSize="1.3em" />
            </ColumnComponent>
        </RowComponent>
    );

    return (
        <div className="main-layout">
            {/* Modal Add Folder */}
            <ModalComponent
                animationType="zoomIn"
                isCloseIcon={true}
                width="800px"
                closeOnOverlayClick={true}
                open={openModalAddNewFolder}
                isFooter={false}
                onCancel={() => {
                    setOpenModalAddNewFolder(false);
                    setCreateFolder_name('');
                }}
                onConfirm={() => {}}
                title="Create new folder">
                <FormComponent
                    onFinished={handleAddFolderFinish}
                    formItems={formItems}
                    haveSubmitButton={true}
                    submitButtonText="Create"
                />
            </ModalComponent>
            {/* Header ------------------------------------------------------------------------------ */}
            <header className="headerContainer">
                <div className="iconMenuContainer">
                    <HambergerMenu className="iconMenu" color="#586380" size="42" />
                </div>
                <SearchBoxComponent value={searchValue} onChange={setSearchValue} />
                <SpaceComponent width={32} />
                <RowComponent alignItems="center" justifyContent="space-around" style={{}}>
                    <FloatingActionButtonComponent
                        backgroundColor="var(--primary-color)"
                        backgroundHoverColor="var(--primary-hover-color)"
                        backgroundActiveColor="var(--primary-active-color)"
                        icon={<Add size="32" color="#fff" />}
                        menuItems={menuItemsAdd}
                    />
                    <SpaceComponent width={32} />
                    <ButtonComponent
                        text="Nâng cấp lên Plus"
                        backgroundColor="var(--secondary-color)"
                        backgroundHoverColor="var(--secondary-hover-color)"
                        backgroundActiveColor="var(--secondary-active-color)"
                        textColor="var(--black-color)"
                        fontSize="1.1em"
                        style={{
                            height: '40px'
                        }}
                    />
                    <SpaceComponent width={32} />

                    <FloatingActionButtonComponent
                        headerComponent={menuItemsSettingHeader}
                        icon={
                            <img
                                src={user?.photoURL || ''}
                                alt="avatar"
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px'
                                }}
                            />
                        }
                        menuItems={menuItemsSetting}
                        menuItemWidth={312}
                    />
                </RowComponent>
            </header>
            {/* Content -------------------------------------------------------------------------------------- */}
            <section className="contentContainer">
                {/* Left container - left menu -------------------------------------------------------------- */}
                <div className="leftContainer">
                    <MenuItemsComponent
                        containerStyle={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'sticky',
                            top: '96px',
                            border: 'none',
                            flex: 0
                        }}
                        onSelectedKeyChange={(key) =>
                            handleNavigatePage(key as 'home' | 'folders' | 'exams')
                        }
                        border={false}
                        selectedKey={activePage}
                        menuItems={menuItemsSideBar}
                    />
                </div>
                {/* Right container - main content --------------------------------------------------------- */}
                <main className="rightContainer">
                    <Outlet />
                </main>
            </section>
        </div>
    );
}

export default MainLayout;
