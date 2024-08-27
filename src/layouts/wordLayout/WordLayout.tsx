import { Add, Setting2 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import InputComponent from '../../components/commonComponent/Input/InputComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import FloatingActionButtonComponent from '../../components/FloatButton/FloatingActionButtonComponent';
import WordCardComponent from '../../components/WordCard/WordCardComponent';
import { useResponsive } from '../../hooks/useResponsive';
import { WordType } from '../../types/WordType';
import './WordLayout.scss';
import EmptyComponent from '../../components/Empty/EmptyComponent';
import { WordSetType } from '../../types/WordSetType';
import { Timestamp } from 'firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { addWordSet } from '../../firebase/wordSetAPI';
import { useAuth } from '../../hooks/useAuth';

function WordLayout() {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const { isTabletOrMobile, isMobile } = useResponsive();

    const [searchParams] = useSearchParams();
    const folderId = searchParams.get('inFolder');

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');

    const mutation = useMutation({
        mutationFn: async (newWordSet: WordSetType) => {
            console.log(newWordSet);
            return addWordSet(newWordSet);
        }
    });

    const [data, setData] = useState<WordType[]>([
        {
            name: '',
            meanings: [
                {
                    meaning: ''
                }
            ],
            contexts: [
                {
                    context: ''
                }
            ]
        },
        {
            name: '',
            meanings: [
                {
                    meaning: ''
                }
            ],
            contexts: [
                {
                    context: ''
                }
            ]
        }
    ]);

    const handleSave = async () => {
        console.log(data);

        if (title === '') {
            setTitleError('Title is required');
            return;
        }

        const words: WordType[] = data.map((item) => {
            return {
                name: item.name,
                meanings: item.meanings,
                contexts: item.contexts
            };
        });

        const wordSet: WordSetType = {
            name: title,
            id_folder: folderId ?? '',
            modifiedAt: Timestamp.now(),
            createAt: Timestamp.now(),
            visibility: 'public',
            words: words
        };

        mutation.mutate(wordSet);

        navigate(`/user/${currentUser?.uid}/folders/${folderId}`);
    };

    const checkCanSave = () => {
        return data.every((item) => {
            return item.name !== '' && item.meanings[0].meaning !== '';
        });
    };

    return (
        <div className="word-layout-container">
            <header className="top-bar">
                <ColumnComponent alignItems="flex-start">
                    <RowComponent
                        justifyContent="space-between"
                        style={{
                            width: '100%'
                        }}>
                        <TitleComponent
                            title="Create a new word set"
                            fontSize="2.4em"
                            fontWeight={700}
                        />
                    </RowComponent>
                    <SpaceComponent height={12} />
                    <RowComponent
                        justifyContent="space-between"
                        style={{
                            width: '100%'
                        }}>
                        <InputComponent
                            placeholder="Enter a title for your word set"
                            type="text"
                            style={{
                                borderRadius: '0px',
                                maxWidth: '600px'
                            }}
                            borderType="bottom"
                            label={titleError !== '' ? titleError : 'Title'}
                            value={title}
                            onChange={(value) => setTitle(value)}
                            animationType="slideInLeft"
                        />
                        <RowComponent
                            style={{
                                marginLeft: '12px'
                            }}>
                            <ButtonComponent
                                tabindex={-1}
                                icon={<Add size={20} />}
                                text="Import"
                                onClick={() => {}}
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
                            <SpaceComponent width={12} />
                            <ButtonComponent
                                tabindex={-1}
                                text="Create"
                                onClick={() => {
                                    handleSave();
                                }}
                                backgroundColor="var(--primary-color)"
                                backgroundHoverColor="var(--primary-hover-color)"
                                backgroundActiveColor="var(--primary-active-color)"
                                isBorder={false}
                                borderColor="var(--border-color)"
                                disabled={!checkCanSave()}
                                textColor="var(--white-color)"
                                style={{
                                    height: '40px',
                                    padding: '0 12px'
                                }}
                            />
                            <SpaceComponent width={12} />
                            <FloatingActionButtonComponent
                                menuItems={[]}
                                icon={<Setting2 size={24} />}
                            />
                        </RowComponent>
                    </RowComponent>
                </ColumnComponent>
            </header>
            <main className="word-content">
                {data.length === 0 && <EmptyComponent />}
                {data.map((item, index) => {
                    return (
                        <WordCardComponent
                            onDelete={(i) => {
                                const newData = [...data];
                                newData.splice(i, 1);
                                setData(newData);
                            }}
                            className="word-card"
                            index={index}
                            term={data[index].name}
                            definition={data[index].meanings[0]?.meaning}
                            context={data[index].contexts.map((item) => item.context)}
                            onDefinitionChange={(i, value) => {
                                const newData = [...data];
                                newData[index].meanings[0].meaning = value;
                                setData(newData);
                            }}
                            onTermChange={(i, value) => {
                                const newData = [...data];
                                newData[index].name = value;
                                setData(newData);
                            }}
                            onContextChange={(i, values) => {
                                console.log(values);
                                const newData = [...data];
                                newData[index].contexts = values.map((item) => {
                                    return {
                                        context: item
                                    };
                                });
                                setData(newData);
                            }}
                        />
                    );
                })}
            </main>
            <footer className="footer-container">
                <ButtonComponent
                    text="Add"
                    icon={<Add size={24} color="var(--text-color)" />}
                    onClick={() => {
                        setData([
                            ...data,
                            {
                                name: '',
                                meanings: [],
                                contexts: []
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

export default WordLayout;
