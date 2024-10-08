import { useMutation, useQuery } from '@tanstack/react-query';
import { Unsubscribe } from 'firebase/auth/web-extension';
import {
    Add,
    Card,
    Edit,
    Element3,
    FolderAdd,
    Refresh2,
    TableDocument,
    Text,
    Timer,
    Trash
} from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ListLoadingAnimation from '../../assets/animation/listLoading.json';
import FolderImage from '../../assets/image/folder.png';
import NotFoundUser from '../../assets/image/no_avatar.png';
import CardComponent from '../../components/Card/CardComponent';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import SpinComponent from '../../components/commonComponent/Spin/SpinComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import EmptyComponent from '../../components/Empty/EmptyComponent';
import FormComponent from '../../components/Form/FormComponent';
import GridCol from '../../components/Grid/GridCol';
import GridRow from '../../components/Grid/GridRow';
import ModalComponent from '../../components/Modal/ModalComponent';
import PaginationComponent from '../../components/Pagination/PaginationComponent';
import SearchBoxComponent from '../../components/SearchBox/SearchBoxComponent';
import SelectComponent from '../../components/Select/SelectComponent';
import Upload from '../../components/Upload/Upload';
import {
    addFolder,
    getFolders,
    getFolderViewModeDefault,
    onSnapshotFolders,
    removeFolder,
    setFolderViewModeDefault,
    updateFolder
} from '../../firebase/folderAPI';
import { getUser } from '../../firebase/userAPI';
import { uploadImage } from '../../firebase/utils/uploadImage';
import { useAuth } from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { useMessage } from '../../hooks/useMessage';
import { useResponsive } from '../../hooks/useResponsive';
import FolderType from '../../types/FolderType';
import './FoldersLayout.scss';
import { Timestamp } from 'firebase/firestore';
import FormItemType from '../../types/FormItemType';
import FloatingActionButtonComponent from '../../components/FloatButton/FloatingActionButtonComponent';
import { MenuItemInterface } from '../../types/MenuItemType';

function FoldersLayout() {
    // State management -------------------------------------------------------------
    // user id from url params
    const { userid } = useParams();
    // current user who login in
    const { user: currentUser } = useAuth();
    const message = useMessage();
    const navigate = useNavigate();
    const { md, lg, xl, xxl } = useResponsive();
    const [openModalEditFolder, setOpenModalEditFolder] = useState(false);
    const [folderEditing, setFolderEditing] = useState<FolderType | null>(null);
    const [folderImageEditing, setFolderImageEditing] = useState<File | undefined | string>(
        undefined
    );

    const [sortBy, setSortBy] = useState<'nameLowercase' | 'modifiedAt' | 'createAt'>();
    const sortByOptions = [
        { label: 'Name', value: 'nameLowercase', icon: <Text size="16" /> },
        { label: 'Modified', value: 'modifiedAt', icon: <Refresh2 size="16" /> },
        { label: 'Created', value: 'createAt', icon: <Timer size="16" /> }
    ];

    // Data
    // command state

    const [newFolderImage, setNewFolderImage] = useState<File | null | string>(null);

    const handleAddFolderFinishMutation = useMutation({
        mutationFn: async () => {
            const imageUrl =
                typeof newFolderImage === 'string'
                    ? newFolderImage
                    : newFolderImage !== null
                    ? await uploadImage(newFolderImage)
                    : '';

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

    const [openModalAddNewFolder, setOpenModalAddNewFolder] = useState(false);
    const [createFolder_name, setCreateFolder_name] = useState<string>('');

    const handleAddFolderFinish = async () => {
        if (currentUser === null) throw new Error('User is not logged in');

        try {
            const newFolder = await handleAddFolderFinishMutation.mutateAsync();

            setCreateFolder_name('');
            setNewFolderImage(null);
            setOpenModalAddNewFolder(false);

            message('success', 'Create folder successfully', 3000);

            if (!RegExp('/user/.*/folders$').test(location.pathname)) {
                navigate(`/user/${currentUser?.uid}/folders/${newFolder.id}`);
            }
        } catch (exception) {
            console.log(exception);
        }
    };

    const [startAt, setStartAt] = useState(0);
    const [limit, setLimit] = useState(10);
    const [viewMode, setViewMode] = useState<'table' | 'list' | 'card'>(() => {
        return getFolderViewModeDefault();
    });
    useEffect(() => {
        if (!lg && viewMode === 'table') {
            setViewMode('list');
        }
    }, [lg]);
    // set view mode to list if isMobile

    const viewModeOptions = [
        {
            label: 'Table',
            value: 'table',
            icon: <Element3 size="16" />,
            disable: !lg
        },
        {
            label: 'List',
            value: 'list',
            icon: <TableDocument size="16" />
        },
        {
            label: 'Card',
            value: 'card',
            icon: <Card size="16" />
        }
    ];

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

    const topBar_command_1: MenuItemInterface[] = [
        {
            key: 'addFolder',
            text: 'Create folder',
            icon: <FolderAdd size="20" />,
            onClick: () => {
                setOpenModalAddNewFolder(true);
            },
            disabled: currentUser?.uid !== userid
        }
    ];

    const [search, setSearch] = useState('');
    const deBoundSearch = useDebounce<string>(search, 500);
    // Get folders from data object and setFolders
    const fetchFolders = async () => {
        if (!userid) return null;
        const data = await getFolders(userid, startAt, limit, deBoundSearch, sortBy);
        return data;
    };
    // Query
    const query = useQuery({
        queryKey: ['folders', startAt, limit, deBoundSearch, sortBy],
        queryFn: fetchFolders,
        staleTime: 0
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
                // clear cache
            });
        }
        return () => {
            // cleanup
            unsubscribe();
        };
    }, [userid]);
    //

    const handleNavigateToWordSets = (folder: FolderType) => {
        navigate(`/user/${userid}/folders/${folder.folderId}`);
    };

    const checkCanEditFolder = () => {
        if (folderEditing?.name?.trim() === '') {
            return false;
        }
        return true;
    };
    const handleOpenModalEditFolder = (folder: FolderType) => {
        setOpenModalEditFolder(true);
        setFolderEditing(folder);
        // setFolderNameEditing(folder.name);
        // setFolderImageURLEditing(folder.imageUrl);
        // setFolderIDEditing(folder.id_folder ?? '');
    };

    const updateFolderMutation = useMutation({
        mutationFn: async () => {
            let url = '';

            if (!checkCanEditFolder()) return null;

            if (!folderEditing) return null;
            if (folderImageEditing && typeof folderImageEditing !== 'string') {
                url = (await uploadImage(folderImageEditing)) ?? '';
            }
            if (folderImageEditing && typeof folderImageEditing === 'string') {
                url = folderImageEditing;
            }

            const folder: FolderType = {
                ...folderEditing,
                imageUrl: url
            };

            return await updateFolder(folder.folderId || '', folder.name, folder.imageUrl || '');
        },
        mutationKey: ['updateFolder', folderEditing, folderImageEditing]
    });

    return (
        <div className="folder-layout-container" style={{}}>
            {/* Modal Add Folder */}
            <ModalComponent
                animationType="zoomIn"
                style={{}}
                bodyStyle={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                isCloseIcon={true}
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
                    style={{
                        width: '100%'
                    }}
                    // onFinished={handleAddFolderFinish}
                    formItems={formItems}
                    haveSubmitButton={false}
                    submitButtonText="Create"
                />
                <ColumnComponent
                    justifyContent="center"
                    alignItems="flex-start"
                    style={{
                        width: '100%'
                    }}>
                    <Upload
                        action={(f) => {
                            if (!f) return;
                            setNewFolderImage(f);
                        }}
                        type="picture"
                        onRemove={() => setNewFolderImage(null)}
                        name="Upload Image"
                        style={{
                            width: '100%',
                            height: '260px'
                        }}
                    />
                    <TitleComponent title="FOLDER IMAGE" fontSize="1.1em" className="mt-1" />
                </ColumnComponent>
            </ModalComponent>
            <ModalComponent
                animationType="zoomIn"
                style={{}}
                isCloseIcon={true}
                buttonComfirmLoading={updateFolderMutation.isPending}
                disableButtonConfirm={!checkCanEditFolder()}
                closeOnOverlayClick={true}
                open={openModalEditFolder}
                onCancel={() => {
                    setOpenModalEditFolder(false);
                    setFolderEditing(null);
                }}
                onConfirm={async () => {
                    await updateFolderMutation.mutateAsync();

                    setOpenModalEditFolder(false);
                    message('success', 'Edit folder successfully');
                }}
                title="Edit folder"
                buttonConfirmText="Save"
                isFooter={true}>
                <FormComponent
                    // onFinished={handleAddFolderFinish}
                    style={{
                        width: '100%'
                    }}
                    formItems={[
                        {
                            type: 'text',
                            label: 'Name',
                            placeholder: 'Folder name',
                            required: true,
                            value: folderEditing?.name,
                            onChange: (value) =>
                                setFolderEditing(
                                    folderEditing ? { ...folderEditing, name: value } : null
                                )
                        }
                    ]}
                    haveSubmitButton={false}
                    submitButtonText="Create"
                />
                <ColumnComponent justifyContent="center" alignItems="flex-start" style={{}}>
                    <Upload
                        defaultImage={folderImageEditing}
                        action={(f) => {
                            if (!f) return;
                            setFolderImageEditing(f);
                        }}
                        type="picture"
                        onRemove={() => setFolderImageEditing(undefined)}
                        name="Upload Image"
                        style={{
                            width: '100%',
                            height: '260px'
                        }}
                    />
                    <TitleComponent title="FOLDER IMAGE" fontSize="1.1em" className="mt-1" />
                </ColumnComponent>
            </ModalComponent>

            <div className="top-bar">
                {lg && (
                    <>
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
                                <TextComponent
                                    text={userQuery.data?.email || '...'}
                                    fontSize="1.3em"
                                />
                            </ColumnComponent>
                        </RowComponent>
                        <SpaceComponent width={64} />
                    </>
                )}
                <div
                    className="command-bar
                        max-w-[100%]
                        lg:max-w-[360px]
                        xl:max-w-[480px]
                        2xl:max-w-[600px]
                    ">
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
                </div>
            </div>
            <div className="flex flex-row justify-end mt-4">
                <SelectComponent
                    options={viewModeOptions}
                    title="View mode"
                    defaultValue={'table'}
                    value={viewMode}
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
                        setViewMode(value as 'table' | 'list' | 'card');
                        setFolderViewModeDefault(value as 'table' | 'list' | 'card');
                    }}
                />
                <SpaceComponent width={8} />
                <SelectComponent
                    options={sortByOptions}
                    defaultValue="nameLowercase"
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
                        setSortBy(value as 'nameLowercase' | 'modifiedAt' | 'createAt');
                    }}
                    value={sortBy}
                    title="Sort by"
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
            </div>
            <div
                className=" 
                mt-6
                pt-2
                px-0
                lg:px-4
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
                    <GridRow gutter={[24, 24]} wrap={true} className={`w-full`}>
                        {query.data?.folders.length === 0 && (
                            <ColumnComponent
                                style={{
                                    width: '100%'
                                }}>
                                <EmptyComponent text="No folders" className="mt-24 mb-4" />
                                {search === '' && (
                                    <ButtonComponent
                                        tabindex={-1}
                                        icon={<Add size={20} />}
                                        onClick={() => {
                                            setOpenModalAddNewFolder(true);
                                        }}
                                        text="Create folder"
                                        backgroundColor="transparent"
                                        backgroundHoverColor="var(--primary-color-light)"
                                        backgroundActiveColor="var(--primary-hover-color-light)"
                                        isBorder={false}
                                        borderColor="var(--border-color)"
                                        textColor="var(--text-color)"
                                        fontSize="1.5em"
                                        style={{
                                            height: '40px',
                                            padding: '12px 26px'
                                        }}
                                    />
                                )}
                            </ColumnComponent>
                        )}
                        {query.data?.folders.map((folder, index) => {
                            return (
                                <GridCol
                                    span={
                                        viewMode === 'table'
                                            ? !xl
                                                ? 6
                                                : !xxl
                                                ? 4
                                                : 3
                                            : viewMode === 'list'
                                            ? 12
                                            : !md
                                            ? 12
                                            : !xl
                                            ? 6
                                            : !xxl
                                            ? 3
                                            : 2
                                    }
                                    key={index}>
                                    <CardComponent
                                        type={viewMode === 'card' ? 'card-image' : 'card-text'}
                                        imageSrc={
                                            folder.imageUrl === '' ? FolderImage : folder.imageUrl
                                        }
                                        className="folder-card"
                                        style={{
                                            width: '100%',
                                            height: viewMode === 'card' ? '320px' : '100%'
                                        }}
                                        haveFloatingButton={true}
                                        visible={undefined}
                                        createAt={folder.createAt?.toDate().toDateString()}
                                        key={index}
                                        title={folder.name}
                                        hoverable={true}
                                        subTitle={folder?.wordSets?.length + ' word sets'}
                                        onClick={() => {
                                            handleNavigateToWordSets(folder);
                                        }}
                                        menuItems={[
                                            {
                                                text: 'Edit',
                                                onClick: () => {
                                                    handleOpenModalEditFolder(folder);
                                                },
                                                key: 'edit',
                                                disabled: currentUser?.uid !== userid,
                                                icon: <Edit size="16" />
                                            },
                                            {
                                                text: 'Delete',
                                                onClick: async () => {
                                                    await removeFolder(folder.folderId || '');

                                                    message(
                                                        'success',
                                                        'Delete folder successfully'
                                                    );
                                                },
                                                key: 'delete',
                                                disabled: currentUser?.uid !== userid,
                                                icon: <Trash size="16" />
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
