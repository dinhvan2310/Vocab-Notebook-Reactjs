import { Add, Setting2 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

function WordLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isTabletOrMobile, isMobile } = useResponsive();

    const [title, setTitle] = useState('');

    console.log(location.state);

    const [term, setTerm] = useState(['', '', '', '', '']);
    const [definition, setDefinition] = useState(['', '', '', '', '']);

    const [data, setData] = useState<WordType[]>([
        {
            name: '',
            meanings: [],
            contexts: []
        },
        {
            name: '',
            meanings: [],
            contexts: []
        },
        {
            name: '',
            meanings: [],
            contexts: []
        },
        {
            name: '',
            meanings: [],
            contexts: []
        },
        {
            name: '',
            meanings: [],
            contexts: []
        }
    ]);

    console.log(term, definition);

    useEffect(() => {
        const newData = term.map((item, index) => {
            return {
                name: item,
                meanings: [
                    {
                        meaning: definition[index]
                    }
                ],
                contexts: []
            };
        });

        setData(newData);
    }, [term, definition]);

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
                            fontSize="2.2em"
                            fontWeight={800}
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
                                color: 'var(--text-color)',
                                maxWidth: '600px'
                            }}
                            borderType="bottom"
                            label="TITLE"
                            value={title}
                            onChange={(value) => setTitle(value)}
                            animationType="slideInLeft"
                        />
                        <RowComponent
                            style={{
                                marginLeft: '12px'
                            }}>
                            <ButtonComponent
                                icon={<Add size={20} />}
                                text="Import"
                                onClick={() => navigate('/')}
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
                                text="Create"
                                onClick={() => navigate('/')}
                                backgroundColor="var(--bg-color)"
                                backgroundHoverColor="var(--bg-hover-color)"
                                backgroundActiveColor="var(--bg-active-color)"
                                isBorder={true}
                                borderColor="var(--border-color)"
                                disabled={true}
                                textColor="var(--secondary-text-color)"
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
                {data.map((item, index) => {
                    return (
                        <WordCardComponent
                            onDelete={(i) => {
                                const newTerm = [...term];
                                const newDefinition = [...definition];

                                newTerm.splice(i, 1);
                                newDefinition.splice(i, 1);

                                setTerm(newTerm);
                                setDefinition(newDefinition);
                            }}
                            className="word-card"
                            index={index}
                            term={term[index]}
                            definition={definition[index]}
                            onDefinitionChange={(i, value) => {
                                const newDefinition = [...definition];
                                newDefinition[i] = value;
                                setDefinition(newDefinition);
                            }}
                            onTermChange={(i, value) => {
                                const newTerm = [...term];
                                newTerm[i] = value;
                                setTerm(newTerm);
                            }}
                        />
                    );
                })}
            </main>
            <footer className="footer-container">
                <ButtonComponent
                    text="Add new word"
                    icon={<Add size={20} color="var(--primary-color)" />}
                    onClick={() => {
                        const newTerm = [...term, ''];
                        const newDefinition = [...definition, ''];
                        setTerm(newTerm);
                        setDefinition(newDefinition);
                    }}
                    backgroundColor="var(--bg-color)"
                    backgroundHoverColor="var(--bg-hover-color)"
                    backgroundActiveColor="var(--bg-active-color)"
                    isBorder={true}
                    borderColor="var(--primary-color)"
                    textColor="var(--primary-color)"
                    style={{
                        height: '86px',
                        padding: '0 12px',
                        width: '100%'
                    }}
                />
            </footer>
        </div>
    );
}

export default WordLayout;
