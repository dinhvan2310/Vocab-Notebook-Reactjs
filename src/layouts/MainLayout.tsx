import { Timestamp } from 'firebase/firestore';
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
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import FloatingActionButtonComponent from '../components/FloatButton/FloatingActionButtonComponent';
import FormComponent from '../components/Form/FormComponent';
import MenuItemsComponent from '../components/MenuItems/MenuItemsComponent';
import ModalComponent from '../components/Modal/ModalComponent';
import SearchBoxComponent from '../components/SearchBox/SearchBoxComponent';
import { addFolder } from '../firebase/folderAPI';
import { useAuth } from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import FolderType from '../types/FolderType';
import FormItemType from '../types/FormItemType';
import { MenuItemInterface } from '../types/MenuItemType';
import './MainLayout.scss';
import RowComponent from '../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../components/commonComponent/Space/SpaceComponent';
import ColumnComponent from '../components/commonComponent/Column/ColumnComponent';
import TitleComponent from '../components/commonComponent/Title/TitleComponent';
import TextComponent from '../components/commonComponent/Text/TextComponent';
import ButtonComponent from '../components/commonComponent/Button/ButtonComponent';
import { useResponsive } from '../hooks/useResponsive';
import Upload from '../components/Upload/Upload';
import { uploadImage } from '../firebase/utils/uploadImage';
import { useMutation } from '@tanstack/react-query';
import { useMessage } from '../hooks/useMessage';

function MainLayout() {
    //  state declaration ---------------------------------------------------------------
    // theme
    const { theme, setTheme } = useTheme();
    // auth
    const { user } = useAuth();
    const { signOut } = useAuth();

    const { md } = useResponsive();
    // navigation
    const navigate = useNavigate();
    const location = useLocation();
    const message = useMessage();

    // search value in the search box
    const [searchValue, setSearchValue] = React.useState('');
    const [newFolderImage, setNewFolderImage] = useState<File | null>(null);
    // keep track of the active page in the sidebar menu
    const [activePage, setActivePage] = React.useState<'home' | 'folders' | 'exams' | 'none'>(
        'home'
    );
    const [inlineCollapsed, setInlineCollapsed] = useState<
        undefined | 'inline-collapsed' | 'popup-menu'
    >(() => (!md ? 'inline-collapsed' : undefined));
    // keep track of the active page in the sidebar menu

    useEffect(() => {
        if (location.pathname === '/') {
            setActivePage('home');
        } else if (RegExp('/user/.*/folders$').test(location.pathname)) {
            setActivePage('folders');
        } else if (location.pathname === '/exams') {
            setActivePage('exams');
        } else {
            setActivePage('none');
        }
    }, [location]);

    useEffect(() => {
        if (!md) {
            setInlineCollapsed('inline-collapsed');
        } else {
            setInlineCollapsed(undefined);
        }
    }, [!md]);

    // open modal to add new folder
    const [openModalAddNewFolder, setOpenModalAddNewFolder] = useState(false);
    // new folder name relate add add new folder modal
    const [createFolder_name, setCreateFolder_name] = useState<string>('');
    // function declaration ---------------------------------------------------------------
    const handleNavigatePage = (key: 'home' | 'folders' | 'exams') => {
        switch (key) {
            case 'home':
                navigate('/');
                break;
            case 'folders':
                navigate(`/user/${user?.uid}/folders`);
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

    const handleAddFolderFinishMutation = useMutation({
        mutationFn: async () => {
            const imageUrl = newFolderImage ? await uploadImage(newFolderImage) : '';

            const folder: FolderType = {
                name: createFolder_name,
                createAt: Timestamp.now(),
                modifiedAt: Timestamp.now(),

                imageUrl: imageUrl,

                wordSets: []
            };

            const newFolder = await addFolder(folder);
            return newFolder;
        },
        mutationKey: ['addFolder']
    });

    const checkFolderNameIsValid = () => {
        return createFolder_name.trim() !== '';
    };
    const handleAddFolderFinish = async () => {
        if (user === null) throw new Error('User is not logged in');

        try {
            const newFolder = await handleAddFolderFinishMutation.mutateAsync();

            setCreateFolder_name('');
            setNewFolderImage(null);
            setOpenModalAddNewFolder(false);

            message('success', 'Create folder successfully', 3000);

            if (!RegExp('/user/.*/folders$').test(location.pathname)) {
                navigate(`/user/${user?.uid}/folders/${newFolder.id}`);
            }
        } catch (exception) {
            console.log(exception);
        }
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
            onClick: () => {
                signOut();
                document.location.href = '/login';
            },
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
            onClick: () => handleNavigatePage('folders'),
            disabled: user === null
        },
        {
            key: 'exams',
            text: 'Đề thi online',
            icon: <NotificationStatus size={20} />,
            disabled: user === null
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
                width="600px"
                closeOnOverlayClick={true}
                open={openModalAddNewFolder}
                isFooter={true}
                onCancel={() => {
                    setOpenModalAddNewFolder(false);
                    setCreateFolder_name('');
                    setNewFolderImage(null);
                }}
                onConfirm={handleAddFolderFinish}
                disableButtonConfirm={!checkFolderNameIsValid()}
                buttonComfirmLoading={handleAddFolderFinishMutation.isPending}
                title="Create new folder">
                <FormComponent
                    // onFinished={handleAddFolderFinish}
                    formItems={formItems}
                    haveSubmitButton={false}
                    submitButtonText="Create"
                />
                <SpaceComponent height={32} />
                <RowComponent justifyContent="center" alignItems="flex-start">
                    <Upload
                        action={(f) => setNewFolderImage(f as File)}
                        type="picture"
                        onRemove={() => setNewFolderImage(null)}
                        name="Cover Image"
                        style={{
                            width: '260px',
                            height: '140px'
                        }}
                    />
                </RowComponent>
            </ModalComponent>
            {/* Header ------------------------------------------------------------------------------ */}
            <header className="headerContainer">
                <div
                    className="iconMenuContainer"
                    onClick={() => {
                        if (!md) {
                            setInlineCollapsed(
                                inlineCollapsed === 'popup-menu' ? 'inline-collapsed' : 'popup-menu'
                            );
                        } else {
                            setInlineCollapsed(
                                inlineCollapsed === 'inline-collapsed'
                                    ? undefined
                                    : 'inline-collapsed'
                            );
                        }
                    }}>
                    <HambergerMenu className="iconMenu" color="#586380" size="42" />
                </div>
                <SearchBoxComponent
                    value={searchValue}
                    onChange={setSearchValue}
                    className="w-1/2"
                />
                <SpaceComponent width={32} />
                <RowComponent alignItems="center" justifyContent="space-around" style={{}}>
                    {user ? (
                        <>
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
                        </>
                    ) : (
                        <ButtonComponent
                            text="Đăng nhập"
                            backgroundColor="var(--primary-color)"
                            backgroundHoverColor="var(--primary-hover-color)"
                            backgroundActiveColor="var(--primary-active-color)"
                            textColor="var(--white-color)"
                            fontSize="1.1em"
                            onClick={() => navigate('/login')}
                            style={{
                                height: '40px'
                            }}
                        />
                    )}
                </RowComponent>
            </header>
            {/* Content -------------------------------------------------------------------------------------- */}
            <section className="contentContainer">
                {/* Left container - left menu -------------------------------------------------------------- */}
                <div className="leftContainer">
                    <MenuItemsComponent
                        backGroundColor="transparent"
                        inlineCollapsed={inlineCollapsed}
                        containerStyle={{
                            display: 'flex',
                            flexDirection: 'column',
                            top: '96px',
                            border: 'none'
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
                    <div
                        className="rightContent
                            scrollbar
                            dark:scrollbarDark
                        "
                        style={{
                            paddingLeft: !md ? '16px' : '48px',
                            paddingRight: !md ? '16px' : '48px'
                        }}>
                        <Outlet />
                    </div>
                </main>
            </section>
        </div>
    );
}

export default MainLayout;
