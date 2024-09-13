import {
    Award,
    Folder,
    HambergerMenu,
    Home,
    LampOn,
    LampSlash,
    Logout,
    Setting
} from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from '../components/commonComponent/Button/ButtonComponent';
import ColumnComponent from '../components/commonComponent/Column/ColumnComponent';
import RowComponent from '../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../components/commonComponent/Space/SpaceComponent';
import TextComponent from '../components/commonComponent/Text/TextComponent';
import TitleComponent from '../components/commonComponent/Title/TitleComponent';
import FloatingActionButtonComponent from '../components/FloatButton/FloatingActionButtonComponent';
import MenuItemsComponent from '../components/MenuItems/MenuItemsComponent';
import SearchBoxComponent from '../components/SearchBox/SearchBoxComponent';
import { useAuth } from '../hooks/useAuth';
import { useResponsive } from '../hooks/useResponsive';
import useTheme from '../hooks/useTheme';
import { MenuItemInterface } from '../types/MenuItemType';
import './MainLayout.scss';

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

    // search value in the search box
    const [searchValue, setSearchValue] = React.useState('');
    // keep track of the active page in the sidebar menu
    const [activePage, setActivePage] = React.useState<'home' | 'folders' | 'none'>('home');
    const [inlineCollapsed, setInlineCollapsed] = useState<
        undefined | 'inline-collapsed' | 'popup-menu'
    >(() => (!md ? 'inline-collapsed' : undefined));
    // keep track of the active page in the sidebar menu

    useEffect(() => {
        if (location.pathname === '/') {
            setActivePage('home');
        } else if (RegExp('/user/.*/folders$').test(location.pathname)) {
            setActivePage('folders');
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
    // new folder name relate add add new folder modal
    // function declaration ---------------------------------------------------------------
    const handleNavigatePage = (key: 'home' | 'folders') => {
        switch (key) {
            case 'home':
                navigate('/');
                break;
            case 'folders':
                navigate(`/user/${user?.uid}/folders`);
                break;
        }
    };

    //  data declaration ---------------------------------------------------------------
    // ADD MENU ITEMS - floating action button
    // function to add a new folder

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
        }
    ];

    // render --------------------------------------------------------------------------------------------
    // setting header for the setting button
    const menuItemsSettingHeader = (
        <RowComponent
            alignItems="center"
            justifyContent="space-between"
            style={{
                width: '280px'
            }}>
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
            <ColumnComponent alignItems="flex-start">
                <TitleComponent title={user?.displayName || ''} fontSize="1.5em" />
                <SpaceComponent height={4} />
                <TextComponent text={user?.email || ''} fontSize="1.3em" />
            </ColumnComponent>
        </RowComponent>
    );

    return (
        <div className="main-layout">
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
                                menuItemWidth={500}
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
                        onSelectedKeyChange={(key) => handleNavigatePage(key as 'home' | 'folders')}
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
