import { useMutation } from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';
import { Add, Export, Setting2 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import InputComponent from '../../components/commonComponent/Input/InputComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import EmptyComponent from '../../components/Empty/EmptyComponent';
import ModalComponent from '../../components/Modal/ModalComponent';
import SelectComponent from '../../components/Select/SelectComponent';
import Upload from '../../components/Upload/Upload';
import WordCardComponent from '../../components/WordCard/WordCardComponent';
import { uploadImage } from '../../firebase/utils/uploadImage';
import { getWords } from '../../firebase/wordAPI';
import { addWordSet, updateWordSet } from '../../firebase/wordSetAPI';
import { useAuth } from '../../hooks/useAuth';
import { useMessage } from '../../hooks/useMessage';
import { WordSetType } from '../../types/WordSetType';
import { WordType } from '../../types/WordType';

// export interface WordEditType extends WordType {
//     titleErrorText?: string;
//     meaningErrorText?: string;
//     contextErrorText?: {
//         index: number;
//         contextErrorText: string;
//     };
// }

function WordEditLayout() {
    // props
    // meta data ------------------------------------------------------------------------------
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const message = useMessage();
    const [searchParams] = useSearchParams();
    const folderId = searchParams.get('inFolder');
    // load word set if case edit or null if case create
    const wordSet = useLoaderData() as WordSetType;

    // state --------------------------------------------------------------------------------------------------
    const [modalImportOpen, setModalImportOpen] = useState(false);
    const [dataImport, setDataImport] = useState<string>('');

    const [modalSettingOpen, setModalSettingOpen] = useState(false);

    const [title, setTitle] = useState(wordSet?.name ?? '');
    const [titleError, setTitleError] = useState('');

    // state --- meta data state
    const [imageCover, setImageCover] = useState<File | null | string>(
        wordSet?.imageUrl ? wordSet.imageUrl : null
    );
    const [visibility, setVisibility] = useState<'public' | 'private'>(
        wordSet?.visibility ?? 'public'
    );
    const [editableBy, setEditableBy] = useState<'owner' | 'everyone'>(
        wordSet?.editableBy ?? 'owner'
    );
    const [editableByPublicPass, setEditableByPublicPass] = useState<string>(
        wordSet?.editablePassword ?? ''
    );

    const [data, setData] = useState<WordType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (wordSet) {
                const wordSetData = await getWords(wordSet.wordsetId ?? '');
                setData(wordSetData);
            }
        };
        fetchData();
    }, [wordSet]);

    // options ui

    // function

    const checkCanSave = () => {
        return data.every((item) => {
            return (
                item.name !== '' &&
                item.meaning !== '' &&
                item.contexts.every((context) => context !== '')
            );
        });
    };

    const handleDeleteWord = (index: number) => {
        console.log(index);
        const newData = [...data];
        newData.splice(index, 1);
        console.log('newData', newData);
        setData([...newData]);
    };

    // query
    const importDataMutation = useMutation({
        mutationFn: async () => {
            try {
                const importData = JSON.parse(dataImport);
                if (!Array.isArray(importData)) {
                    message('error', 'Data is not an array');
                    return;
                }
                if (importData.length === 0) {
                    message('error', 'Data is empty');
                    return;
                }

                if (
                    importData[0].name === undefined ||
                    importData[0].meaning === undefined ||
                    importData[0].contexts === undefined ||
                    importData[0].imageURL === undefined
                ) {
                    message('error', 'Data is not valid');
                    return;
                }

                const newData = importData.map((item: WordType) => {
                    return {
                        name: item.name,
                        meaning: item.meaning,
                        contexts: item.contexts,
                        imageURL: item.imageURL,
                        learned: false,
                        createdAt: Timestamp.now()
                    };
                });

                setData(newData);

                message('success', 'Import successfully');

                setDataImport('');
            } catch (error) {
                message('error', 'Data is not valid');
            }
        },
        mutationKey: ['importData', dataImport]
    });
    const mutation = useMutation({
        mutationFn: async () => {
            console.log('data', data);

            if (title === '') {
                setTitleError('Title is required');
                message('error', 'Title is required !');
                return;
            }

            // reset error text
            // setData((prev) => {
            //     const newData = [...prev];
            //     newData.forEach((item) => {
            //         item.titleErrorText = undefined;
            //         item.meaningErrorText = undefined;
            //         item.contextErrorText = undefined;
            //     });
            //     return newData;
            // });

            if (checkCanSave() === false) {
                message('error', 'Please fill all fields !');

                // data.forEach((item, index) => {
                //     if (item.name === '') {
                //         setData((prev) => {
                //             const newData = [...prev];
                //             newData[index].titleErrorText = 'Name is required';
                //             return newData;
                //         });
                //     }
                //     if (item.meaning === '') {
                //         setData((prev) => {
                //             const newData = [...prev];
                //             newData[index].meaningErrorText = 'Meaning is required';
                //             return newData;
                //         });
                //     }
                //     if (!item.contexts.every((context) => context !== '')) {
                //         const i = item.contexts.findIndex((context) => context === '');
                //         setData((prev) => {
                //             const newData = [...prev];
                //             newData[index].contextErrorText = {
                //                 index: i,
                //                 contextErrorText: 'Context is required'
                //             };
                //             return newData;
                //         });
                //     }
                // });

                return;
            }

            let url;
            if (imageCover) {
                if (typeof imageCover === 'string') {
                    url = imageCover;
                } else {
                    url = await uploadImage(imageCover);
                }
            }

            const newWordSet: WordSetType = {
                wordsetId: wordSet?.wordsetId ?? '',
                imageUrl: url ?? '',
                folderRef: wordSet?.folderRef ?? folderId ?? '',

                name: title.trim(),
                nameLowercase: title.toLowerCase().trim(),

                visibility: visibility,
                editableBy: editableBy,
                editablePassword: editableBy === 'everyone' ? editableByPublicPass : '',
                createAt: Timestamp.now(),
                modifiedAt: Timestamp.now()
            };

            let wordSetId = '';
            if (wordSet) {
                wordSetId = await updateWordSet(
                    wordSet.wordsetId ?? '',
                    newWordSet.name,
                    newWordSet.visibility,
                    newWordSet.editableBy,
                    newWordSet.editablePassword ?? '',
                    newWordSet.imageUrl ?? '',
                    data
                );
            } else {
                wordSetId = await addWordSet(newWordSet, data);
            }

            navigate(
                `/user/${currentUser?.uid}/folders/${
                    folderId === undefined
                        ? typeof wordSet.folderRef !== 'string'
                            ? wordSet.folderRef.id
                            : wordSet.folderRef
                        : folderId
                }/wordset/${wordSetId}`
            );
        },
        mutationKey: ['handleSave']
    });

    return (
        <div className="word-layout-container">
            {/* modal */}
            <ModalComponent
                open={modalImportOpen}
                disableButtonConfirm={dataImport === ''}
                animationType="zoomIn"
                width="760px"
                isCloseIcon={true}
                buttonComfirmLoading={importDataMutation.isPending}
                closeOnOverlayClick={true}
                onCancel={() => {
                    setModalImportOpen(false);
                    setDataImport('');
                }}
                onConfirm={async () => {
                    // save setting on state
                    await importDataMutation.mutateAsync();
                    // await updateWordSetMutation.mutateAsync();
                    setModalImportOpen(false);
                }}
                title="Import"
                buttonConfirmText="Import"
                isFooter={true}>
                <ColumnComponent
                    alignItems="flex-start"
                    className="w-full 
                ">
                    <div className="w-full">
                        <div
                            className={`
                            w-full max-h-56 overflow-x-auto
                            scrollbar dark:scrollbarDark
                                px-2 py-2
                                border border-borderLight dark:border-borderDark
                                rounded-md

                        `}>
                            <InputComponent
                                type="textarea"
                                value={dataImport}
                                fontSize="1.2em"
                                style={{
                                    borderRadius: '0px'
                                }}
                                borderType="none"
                                placeholder='Paste your data here. Example: [{"name":"hello","meaning":"xin chào","contexts":[""],"imageURL":""}]'
                                onChange={function (value: string): void {
                                    setDataImport(value);
                                }}
                                inputStyle={{}}
                            />
                        </div>
                    </div>
                    <TextComponent text="Or upload a file" className="mt-4 mb-2" fontSize="1.2em" />
                    <Upload
                        type="file"
                        action={(file) => {
                            if (file && typeof file !== 'string') {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    const text = e.target?.result;
                                    setDataImport(text as string);
                                };
                                reader.readAsText(file);
                            }
                        }}
                        onRemove={() => {
                            setDataImport('');
                        }}
                        accept=".json"
                    />
                </ColumnComponent>
            </ModalComponent>
            {/* modal */}
            <ModalComponent
                open={modalSettingOpen}
                disableButtonConfirm={editableBy === 'everyone' && editableByPublicPass === ''}
                animationType="zoomIn"
                width="760px"
                isCloseIcon={true}
                closeOnOverlayClick={true}
                onCancel={() => {
                    setModalSettingOpen(false);
                    // reset state
                    if (!wordSet) {
                        setImageCover(null);
                        setVisibility('public');
                        setEditableBy('owner');
                        setEditableByPublicPass('');
                    } else {
                        setImageCover(wordSet.imageUrl ?? null);
                        setVisibility(wordSet.visibility);
                        setEditableBy(wordSet.editableBy);
                        setEditableByPublicPass(wordSet.editablePassword ?? '');
                    }
                }}
                onConfirm={async () => {
                    // save setting on state
                    setModalSettingOpen(false);
                }}
                title="Settings"
                buttonConfirmText="Save"
                isFooter={true}>
                <ColumnComponent className="w-full px-4">
                    <Upload
                        defaultImage={imageCover ?? undefined}
                        type="picture"
                        name="Upload a cover image"
                        action={(file) => {
                            setImageCover(file || null);
                        }}
                        onRemove={() => {
                            setImageCover(null);
                        }}
                        className="w-full mb-8 h-[200px]"
                    />

                    <RowComponent justifyContent="space-between" className="w-full mb-8">
                        <ColumnComponent className="w-full" alignItems="flex-start">
                            <TitleComponent title="Visible to" className="mb-2" />
                            <SelectComponent
                                style={{
                                    borderRadius: '0px'
                                }}
                                width="100%"
                                options={[
                                    {
                                        label: 'Everyone',
                                        value: 'public'
                                    },
                                    {
                                        label: 'Only me',
                                        value: 'private'
                                    }
                                ]}
                                optionStyle={{
                                    borderRadius: '0px'
                                }}
                                onChange={(value) => {
                                    setVisibility(value as 'public' | 'private');
                                }}
                                value={visibility}
                            />
                            <TextComponent
                                fontSize="1.2em"
                                className="mt-2"
                                text={
                                    visibility === 'public'
                                        ? 'Anyone can view'
                                        : 'Only you can view'
                                }
                            />
                        </ColumnComponent>
                        <SpaceComponent width={48} />
                        <ColumnComponent className="w-full" alignItems="flex-start">
                            <TitleComponent title="Editable by" className="mb-2" />
                            <SelectComponent
                                style={{
                                    borderRadius: '0px'
                                }}
                                width="100%"
                                options={[
                                    {
                                        label: 'Only me',
                                        value: 'owner'
                                    },
                                    {
                                        label: 'Everyone with password',
                                        value: 'everyone'
                                    }
                                ]}
                                optionStyle={{
                                    borderRadius: '0px'
                                }}
                                onChange={(value) => {
                                    setEditableBy(value as 'everyone' | 'owner');
                                }}
                                value={editableBy}
                            />
                            <TextComponent
                                fontSize="1.2em"
                                className="mt-2"
                                text={
                                    editableBy === 'everyone'
                                        ? 'Anyone can edit with password'
                                        : 'Only you can edit'
                                }
                            />
                        </ColumnComponent>
                    </RowComponent>
                    {editableBy === 'everyone' && (
                        <InputComponent
                            placeholder="Enter a password"
                            type="password"
                            style={{
                                borderRadius: '0px'
                            }}
                            borderType="bottom"
                            label={'Password'}
                            value={editableByPublicPass}
                            onChange={(value) => {
                                setEditableByPublicPass(value);
                            }}
                            animationType="slideInLeft"
                        />
                    )}
                </ColumnComponent>
            </ModalComponent>
            <header className="top-bar">
                <ColumnComponent alignItems="flex-start">
                    <RowComponent
                        justifyContent="space-between"
                        style={{
                            width: '100%'
                        }}>
                        <TitleComponent
                            title={wordSet ? 'Edit Word Set' : 'Create Word Set'}
                            fontSize="2.4em"
                            fontWeight={700}
                        />
                    </RowComponent>
                    <SpaceComponent height={8} />
                    <RowComponent
                        justifyContent="space-between"
                        style={{
                            width: '100%'
                        }}>
                        <InputComponent
                            className="mt-6"
                            placeholder="Enter a title for your word set"
                            type="text"
                            style={{
                                borderRadius: '0px',
                                maxWidth: '600px'
                            }}
                            borderType="bottom"
                            label={'Title'}
                            errorText={titleError}
                            value={title}
                            onChange={(value) => {
                                setTitle(value);
                                setTitleError('');
                            }}
                            animationType="slideInLeft"
                        />
                        <RowComponent
                            style={{
                                marginLeft: '12px'
                            }}>
                            <ButtonComponent
                                style={{
                                    height: '40px',
                                    paddingLeft: '16px',
                                    paddingRight: '16px'
                                }}
                                tooltip="Import"
                                icon={<Export size={20} />}
                                onClick={() => {
                                    setModalImportOpen(true);
                                }}
                                backgroundColor="var(--bg-color)"
                                backgroundHoverColor="var(--bg-hover-color)"
                                backgroundActiveColor="var(--bg-active-color)"
                                isBorder={true}
                                textColor="var(--secondary-text-color)"
                            />

                            <SpaceComponent width={8} />
                            <ButtonComponent
                                tabindex={-1}
                                text={wordSet ? 'Update' : 'Create'}
                                onClick={() => {
                                    mutation.mutate();
                                }}
                                backgroundColor="var(--primary-color)"
                                backgroundHoverColor="var(--primary-hover-color)"
                                backgroundActiveColor="var(--primary-active-color)"
                                isBorder={false}
                                borderColor="var(--border-color)"
                                // disabled={!checkCanSave()}
                                isLoading={mutation.isPending}
                                textColor="var(--white-color)"
                                style={{
                                    height: '40px',
                                    padding: '0 12px'
                                }}
                            />
                            <SpaceComponent width={8} />
                            <ButtonComponent
                                tabindex={-1}
                                icon={<Setting2 size={20} />}
                                onClick={() => {
                                    setModalSettingOpen(true);
                                }}
                                backgroundColor="var(--bg-color)"
                                backgroundHoverColor="var(--bg-hover-color)"
                                backgroundActiveColor="var(--bg-active-color)"
                                isBorder={true}
                                borderColor="var(--border-color)"
                                textColor="var(--secondary-text-color)"
                                style={{
                                    height: '40px',
                                    padding: '0 12px'
                                }}
                            />
                        </RowComponent>
                    </RowComponent>
                </ColumnComponent>
            </header>
            <main className="mt-16 sm:px-1 md:px-2 lg:px-3 xl:px-16 2xl:px-24">
                {data.length === 0 && <EmptyComponent />}
                {data.map((item, index) => {
                    return (
                        <WordCardComponent
                            key={index}
                            onDelete={() => {
                                handleDeleteWord(index);
                            }}
                            className="word-card mb-12"
                            index={index}
                            word={item}
                            onWordChange={(i, word) => {
                                const newData = [...data];
                                newData[i] = word;
                                // if (
                                //     data.length > 1 &&
                                //     data.find(
                                //         (item, index) => i !== index && item.name === word.name
                                //     )
                                // ) {
                                //     newData[i].titleErrorText = `${word.name} is duplicated`;
                                // } else {
                                //     newData[i].titleErrorText = undefined;
                                // }

                                setData(newData);
                            }}
                        />
                    );
                })}
            </main>
            <footer className="mt-12 mb-12 w-full flex justify-center items-center">
                <ButtonComponent
                    text="Add"
                    icon={<Add size={24} color="var(--text-color)" />}
                    fontSize="1.6em"
                    onClick={() => {
                        setData([
                            ...data,
                            {
                                name: '',
                                meaning: '',
                                contexts: [''],
                                imageURL: '',
                                learned: false,
                                createdAt: Timestamp.now()
                            }
                        ]);
                    }}
                    backgroundColor="var(--bg-hover-color)"
                    backgroundHoverColor="var(--bg-active-color)"
                    backgroundActiveColor="var(--bg-active-color)"
                    isBorder={false}
                    borderColor="var(--secondary-text-color)"
                    textColor="var(--text-color)"
                    style={{
                        height: '48px',
                        padding: '12px 48px'
                    }}
                />
            </footer>
        </div>
    );
}

export default WordEditLayout;
