import { useMutation } from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';
import { Add, Export } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate, useParams } from 'react-router-dom';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import InputComponent from '../../components/commonComponent/Input/InputComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import EmptyComponent from '../../components/Empty/EmptyComponent';
import ModalComponent from '../../components/Modal/ModalComponent';
import Upload from '../../components/Upload/Upload';
import WordCardComponent from '../../components/WordCard/WordCardComponent';
import { getWords } from '../../firebase/wordAPI';
import { updateWords } from '../../firebase/wordSetAPI';
import { useMessage } from '../../hooks/useMessage';
import { WordSetType } from '../../types/WordSetType';
import { WordType } from '../../types/WordType';

function WordEditLayout() {
    // props
    // meta data ------------------------------------------------------------------------------
    // const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const password = location.state?.password ?? '';
    const message = useMessage();
    const { userid, folderid } = useParams();
    // load word set if case edit or null if case create
    const wordSet = useLoaderData() as WordSetType;

    // state --------------------------------------------------------------------------------------------------
    const [modalImportOpen, setModalImportOpen] = useState(false);
    const [dataImport, setDataImport] = useState<string>('');

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
            if (checkCanSave() === false) {
                message('error', 'Please fill all fields !');
                return;
            }

            const wordSetId = await updateWords(wordSet.wordsetId ?? '', data, password);

            navigate(`/user/${userid}/folders/${folderid}/wordset/${wordSetId}`);
        },
        mutationKey: ['handleSave']
    });

    return (
        <div
            className="word-layout-container flex flex-col
            max-w-[1024px] m-auto">
            {/* modal */}
            <ModalComponent
                open={modalImportOpen}
                disableButtonConfirm={dataImport === ''}
                animationType="zoomIn"
                style={{
                    width: '760px'
                }}
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
                            value={wordSet.name}
                            animationType="none"
                            onChange={() => {}}
                            readonly={true}
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
                        </RowComponent>
                    </RowComponent>
                </ColumnComponent>
            </header>
            <main className="mt-16">
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
                                learned: false
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
