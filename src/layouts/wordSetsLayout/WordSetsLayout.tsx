import { useMutation, useQuery } from '@tanstack/react-query';
import { Unsubscribe } from 'firebase/firestore';
import {
    Add,
    Card,
    Edit,
    Edit2,
    Element3,
    FolderAdd,
    FolderCross,
    More,
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
import FormComponent from '../../components/Form/FormComponent';
import GridCol from '../../components/Grid/GridCol';
import GridRow from '../../components/Grid/GridRow';
import ModalComponent from '../../components/Modal/ModalComponent';
import PaginationComponent from '../../components/Pagination/PaginationComponent';
import SearchBoxComponent from '../../components/SearchBox/SearchBoxComponent';
import SelectComponent from '../../components/Select/SelectComponent';
import Upload from '../../components/Upload/Upload';
import { getFolder, removeFolder, updateFolder } from '../../firebase/folderAPI';
import { uploadImage } from '../../firebase/utils/uploadImage';
import {
    getWordSets,
    getWordSetViewMode,
    onSnapshotWordSets,
    removeWordSet,
    setWordSetViewMode
} from '../../firebase/wordSetAPI';
import { useAuth } from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { useMessage } from '../../hooks/useMessage';
import { useResponsive } from '../../hooks/useResponsive';
import FolderType from '../../types/FolderType';
import { MenuItemInterface } from '../../types/MenuItemType';
import './WordSetsLayout.scss';

function WordSetsLayout() {
    // state --------------------------------------------------------------------------------
    const { userid, folderid } = useParams();
    // destructuring user from useAuth and change variable name
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const message = useMessage();
    const { md, lg, xl, xxl } = useResponsive();

    const [viewMode, setViewMode] = useState<'table' | 'list' | 'card'>(() => {
        return getWordSetViewMode();
    });
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

    const [startAt, setStartAt] = useState(0);
    const [limit, setLimit] = useState(10);

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
    const [sortBy, setSortBy] = useState<'nameLowercase' | 'modifiedAt'>();
    const sortByOptions = [
        { label: 'Name', value: 'nameLowercase', icon: <Text size="16" /> },
        { label: 'Modified', value: 'modifiedAt', icon: <Refresh2 size="16" /> },
        { label: 'Created', value: 'createAt', icon: <Timer size="16" /> }
    ];

    // modal edit folder
    const [folderEditing, setFolderEditing] = useState<FolderType | null>(null);
    const [folderImageEditing, setFolderImageEditing] = useState<File | null>(null);
    const [openModalEditFolder, setOpenModalEditFolder] = useState(false);
    // fetch DATA -------------------------------------------------------------------------
    // fetch List of WordSets from folderid
    const query = useQuery({
        queryKey: ['wordSets', folderid, startAt, limit, sortBy, deBoundSearch],
        queryFn: async () => {
            const data = await getWordSets(folderid, startAt, limit, deBoundSearch, sortBy);
            return data;
        },
        staleTime: 0,
        gcTime: 0
    });

    console.log(query.data?.wordSets);

    // fetch Folder from folderid
    const folderQuery = useQuery({
        queryKey: ['folders', folderid],
        queryFn: async () => {
            const data = await getFolder(folderid);
            console.log(data);
            return data;
        },
        staleTime: 0,
        gcTime: 0
    });

    // snapshot
    useEffect(() => {
        let unsubscribe: Unsubscribe;
        if (userid) {
            unsubscribe = onSnapshotWordSets(folderid, () => {
                query.refetch();
            });
        }
        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userid, folderid]);
    //

    useEffect(() => {
        if (!lg && viewMode === 'table') {
            setViewMode('list');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lg]);

    // options for component ----------------------------------------------------------------
    const topBar_command_1: MenuItemInterface[] = [
        {
            key: 'create_wordset',
            text: 'Create Word Set',
            icon: <FolderAdd size="20" />,
            onClick: () => {
                navigate(`/create-wordset?inFolder=${folderid}`);
            },
            disabled: currentUser?.uid !== folderQuery.data?.userRef?.id
        }
    ];
    const topBar_command_2: MenuItemInterface[] = [
        {
            key: 'edit_folder',
            text: 'Edit Folder',
            onClick: () => {
                setOpenModalEditFolder(true);
                setFolderEditing(folderQuery.data as FolderType);
                console.log(folderQuery.data as FolderType);
            },
            icon: <Edit2 size="20" />,
            disabled: currentUser?.uid !== folderQuery.data?.userRef?.id
        },
        {
            key: 'delete_folder',
            text: 'Delete Folder',
            onClick: async () => {
                await removeFolder(folderid ?? '');
                navigate(`/user/${userid}/folders`);
                message('success', 'Delete folder successfully');
            },
            icon: <FolderCross size="20" />,
            disabled: currentUser?.uid !== folderQuery.data?.userRef?.id
        }
    ];

    const checkCanEditFolder = () => {
        if (folderEditing?.name?.trim() === '') {
            return false;
        }
        return true;
    };

    const updateFolderMutation = useMutation({
        mutationFn: async () => {
            let url;

            if (!checkCanEditFolder()) return null;

            if (folderImageEditing) {
                url = await uploadImage(folderImageEditing);
            }

            //
            if (!folderEditing) return null;
            if (folderQuery.data?.name === folderEditing.name && !url) return null;

            await updateFolder(folderid, folderEditing.name, url);

            folderQuery.refetch();
        },
        mutationKey: ['updateFolder', folderEditing, folderImageEditing]
    });

    const handleClickWordSet = (wordSetId: string) => {
        if (userid && folderid && wordSetId)
            navigate(`/user/${userid}/folders/${folderid}/wordset/${wordSetId}`);
        else message('error', 'Error when navigate to wordset');
    };

    return (
        <div
            className="wordset-container 
        flex flex-col h-full pb-8
    ">
            <ModalComponent
                animationType="zoomIn"
                width="600px"
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
                <SpaceComponent height={32} />
                <RowComponent justifyContent="center" alignItems="center">
                    {folderEditing?.imageUrl ? (
                        <>
                            <img
                                src={
                                    folderEditing?.imageUrl === ''
                                        ? FolderImage
                                        : folderEditing?.imageUrl
                                }
                                alt="folder"
                                className="w-[260px] h-[140px] object-cover rounded-lg
                            
                            "
                            />
                            <ButtonComponent
                                icon={
                                    <Trash
                                        size="24"
                                        className="
                                        text-textLight dark:text-textDark
                                        hover:text-red
                                    "
                                    />
                                }
                                onClick={async () => {
                                    setFolderImageEditing(null);
                                    setFolderEditing({ ...folderEditing, imageUrl: '' });
                                }}
                                backgroundHoverColor="transparent"
                                backgroundColor="transparent"
                                backgroundActiveColor="transparent"
                            />
                        </>
                    ) : (
                        <Upload
                            action={(file) => setFolderImageEditing(file as File)}
                            type="picture"
                            onRemove={() => setFolderImageEditing(null)}
                            name="Cover Image"
                            style={{
                                width: '260px',
                                height: '140px'
                            }}
                        />
                    )}
                </RowComponent>
            </ModalComponent>
            <RowComponent justifyContent="space-between" className="top-bar" alignItems="flex-end">
                {lg && (
                    <>
                        <ColumnComponent
                            alignItems="flex-start"
                            justifyContent="flex-start"
                            className="w-fit h-[64px]">
                            <TitleComponent title={folderQuery.data?.name ?? ''} fontSize="3em" />
                            <RowComponent>
                                <Refresh2
                                    size={16}
                                    color="var(--secondary-text-color)"
                                    className="mr-2"
                                />

                                <TextComponent
                                    style={{
                                        textWrap: 'nowrap'
                                    }}
                                    fontSize="1.2em"
                                    text={`Last updated:\u00A0 \u00A0 ${new Date(
                                        (folderQuery.data?.modifiedAt?.seconds || 0) * 1000
                                    ).toDateString()}`}
                                />
                            </RowComponent>
                        </ColumnComponent>
                    </>
                )}
                <div
                    className="
                        flex flex-row
                        w-[100%]
                        lg:max-w-[450px]
                        2xl:max-w-[600px]
                    ">
                    <SearchBoxComponent
                        searchWidth={'100%'}
                        style={{
                            backgroundColor: 'var(--bg-color)'
                        }}
                        placeholder="Search folders"
                        backGroundColor="var(--bg-color)"
                        borderType="none"
                        borderRadius={8}
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                        }}
                    />
                </div>
            </RowComponent>
            <RowComponent
                className="mt-4"
                justifyContent="flex-end"
                style={{
                    width: '100%'
                }}>
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
                        setWordSetViewMode(value as 'table' | 'list' | 'card');
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
                        setSortBy(value as 'nameLowercase' | 'modifiedAt');
                    }}
                    value={sortBy}
                    title="Sort by"
                />
                <SpaceComponent width={8} />
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
                        className="h-full"
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
                    <GridRow gutter={[24, 24]} className="w-full ">
                        {query.data?.numOfTotalWordSets === 0 && (
                            <EmptyComponent text="No folders found" className="h-full mt-24" />
                        )}
                        {query.data?.wordSets.map((item, index) => {
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
                                            item.imageUrl === '' ? FolderImage : item.imageUrl
                                        }
                                        className="folder-card"
                                        style={{
                                            width: '100%',
                                            height: viewMode === 'card' ? '320px' : '100%'
                                        }}
                                        haveFloatingButton={true}
                                        createAt={item.createAt?.toDate().toDateString()}
                                        key={index}
                                        title={item.name}
                                        hoverable={true}
                                        subTitle={item.words.length + ' words'}
                                        onClick={() => {
                                            handleClickWordSet(item.wordsetId ?? '');
                                        }}
                                        menuItems={[
                                            {
                                                text: 'Edit',
                                                onClick: () => {
                                                    navigate(
                                                        `/edit-wordset/${item.wordsetId}?inFolder=${folderid}`
                                                    );
                                                },
                                                key: 'edit',
                                                disabled: currentUser?.uid !== userid,
                                                icon: <Edit size="16" />
                                            },
                                            {
                                                text: 'Delete',
                                                onClick: async () => {
                                                    await removeWordSet(item.wordsetId ?? '');
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
                    total={query.data?.numOfTotalWordSets as number}
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

export default WordSetsLayout;

// return (
//     <div className="wordset-layout-container" style={{}}>
//         <ColumnComponent className="top-bar">
//
//             <SpaceComponent height={16} />
//             <RowComponent className="top-bar-query" justifyContent="space-between">
//                 <RowComponent
//                     style={
//                         {
//                             // display: isMobile ? 'none' : 'flex'
//                         }
//                     }>
//
//                     <SpaceComponent width={12} />
//                     <TextComponent
//                         style={{
//                             textWrap: 'nowrap'
//                         }}
//                         text={`Last updated:\u00A0 \u00A0 ${new Date(
//                             (folderQuery.data?.modifiedAt?.seconds || 0) * 1000
//                         ).toDateString()}`}
//                     />
//                 </RowComponent>
//
//             </RowComponent>
//         </ColumnComponent>

//     </div>
// );
