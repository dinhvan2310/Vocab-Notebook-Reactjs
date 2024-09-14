import { AddSquare, BookSaved, Image, MinusSquare, People, Trash } from 'iconsax-react';
import ButtonComponent from '../commonComponent/Button/ButtonComponent';
import ColumnComponent from '../commonComponent/Column/ColumnComponent';
import InputComponent from '../commonComponent/Input/InputComponent';
import RowComponent from '../commonComponent/Row/RowComponent';
import SpaceComponent from '../commonComponent/Space/SpaceComponent';
import TitleComponent from '../commonComponent/Title/TitleComponent';
import GridCol from '../Grid/GridCol';
import GridRow from '../Grid/GridRow';
import Upload from '../Upload/Upload';
import './WordCardComponent.scss';
// import { WordEditType } from '../../layouts/wordEditLayout/WordEditLayout';
import { useEffect, useState } from 'react';
import { suggestContext, suggestDefinition, suggestWord } from '../../firebase/suggestAPI';
import useDebounce from '../../hooks/useDebounce';
import { WordType } from '../../types/WordType';
import ImageSearchComponent from '../ImageSearch/ImageSearchComponent';
import ModalComponent from '../Modal/ModalComponent';
import TabsComponent from '../Tabs/TabsComponent';
interface WordCardComponentProps {
    index: number;
    className?: string;

    word: WordType;
    onWordChange: (index: number, word: WordType) => void;

    onDelete: () => void;
}
function WordCardComponent(props: WordCardComponentProps) {
    const { index, className, onDelete, word, onWordChange } = props;

    // state ------------------------------------------------------------

    const [name, setName] = useState<string>(word.name);
    const [meaning, setMeaning] = useState<string>(word.meaning);
    const [contexts, setContexts] = useState<string[]>(word.contexts ?? []);

    useEffect(() => {
        setName(word.name);
        setMeaning(word.meaning);
        setContexts(word.contexts ?? []);
    }, [word]);

    const nameDebounce = useDebounce(name, 500);
    const meaningDebounce = useDebounce(meaning, 500);
    const contextDebounce = useDebounce(contexts, 500);

    const [showTabDefinitionSuggest, setShowTabDefinitionSuggest] = useState(false);
    const [definitionSuggestType, setDefinitionSuggestType] = useState<'community' | 'dictionary'>(
        'community'
    );

    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        onWordChange(index, {
            ...word,
            name: nameDebounce,
            meaning: meaningDebounce,
            contexts: contextDebounce
        });
    }, [nameDebounce, meaningDebounce, contextDebounce]);

    return (
        <ColumnComponent
            className={`word-card-container ${className ?? ''}
                animate-fadeIn    
            `}
            justifyContent="space-between"
            style={{
                width: '100%'
            }}>
            {/* // Modal  */}
            <ModalComponent
                bodyStyle={{
                    overflowY: 'auto',
                    height: 'calc(100% - 42px)'
                }}
                open={showImageModal}
                isCloseIcon={true}
                title="Search image"
                onCancel={() => setShowImageModal(false)}
                animationType="zoomIn"
                className="
                    h-[calc(100vh-158px)] ml-2 mr-2
                    md:ml-4 md:mr-4
                    lg:ml-24 lg:mr-24
                    xl:ml-64 xl:mr-64
                "
                style={{
                    width: '100%'
                }}
                closeOnOverlayClick={true}
                isFooter={false}
                onConfirm={() => {}}>
                <ImageSearchComponent
                    onChoose={(url) => {
                        onWordChange(index, { ...word, imageURL: url });
                        setShowImageModal(false);
                    }}
                    searchInitial={name}
                />
            </ModalComponent>

            <RowComponent
                className="word-card-header"
                justifyContent="space-between"
                style={{
                    width: '100%'
                }}>
                <TitleComponent
                    title={(index + 1).toString()}
                    color="var(--secondary-text-color)"
                    className="word-card-header-index"
                />
                <RowComponent>
                    <ButtonComponent
                        tooltip="Search image"
                        tabindex={-1}
                        disabled={name.trim() === '' ? true : false}
                        icon={<Image size={20} className="" />}
                        backgroundColor="transparent"
                        backgroundHoverColor="var(--bg-hover-color)"
                        backgroundActiveColor="var(--bg-active-color)"
                        onClick={() => {
                            setShowImageModal(true);
                        }}
                        textColor="var(--text-color)"
                        text="Search image"
                        style={{
                            height: '40px',
                            padding: '0 12px',
                            color: 'var(--text-color)'
                        }}
                    />
                    <ButtonComponent
                        className="group"
                        tooltip="Delete word"
                        tabindex={-1}
                        icon={
                            <Trash
                                size={20}
                                className="
                            group-hover:text-red
                        "
                            />
                        }
                        backgroundColor="transparent"
                        backgroundHoverColor="var(--bg-hover-color)"
                        backgroundActiveColor="var(--bg-active-color)"
                        onClick={() => onDelete()}
                        style={{
                            height: '40px',
                            padding: '0 12px',
                            color: 'var(--text-color)'
                        }}
                    />
                </RowComponent>
            </RowComponent>
            <SpaceComponent height={24} />

            <div className="word-card-content">
                <GridRow gutter={64}>
                    <GridCol span={6}>
                        <InputComponent
                            style={{
                                marginRight: 64
                            }}
                            value={name}
                            onChange={async (value) => {
                                setName(value);
                            }}
                            placeholder="Enter term"
                            label="Term"
                            type="text"
                            borderType="bottom"
                            inputStyle={{
                                fontSize: '1.6em'
                            }}
                            animationType="slideInLeft"
                            // errorText={word.titleErrorText}
                            suggest={true}
                            suggestData={async (value) => {
                                return await suggestWord(value);
                            }}
                        />
                    </GridCol>
                    <GridCol
                        span={6}
                        style={{
                            position: 'relative',
                            width: '100%'
                        }}>
                        <InputComponent
                            onFocused={() => {
                                setShowTabDefinitionSuggest(true);
                            }}
                            style={{}}
                            value={meaning.replace(/\\n/g, '\n')}
                            onChange={(value) => {
                                setMeaning(value);
                                setShowTabDefinitionSuggest(false);
                            }}
                            placeholder="Enter definition"
                            label="Definition"
                            type="textarea"
                            animationType="slideInLeft"
                            borderType="bottom"
                            // errorText={word.meaningErrorText}
                            suggest={true}
                            suggestData={async (text) => {
                                const rs = await suggestDefinition(
                                    name,
                                    text,
                                    definitionSuggestType
                                );
                                return rs;
                            }}
                        />
                        {showTabDefinitionSuggest && (
                            <TabsComponent
                                type="vertical"
                                verticalTabWidth="124px"
                                fontSize="1.2em"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: -36,
                                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '4px'
                                }}
                                items={[
                                    {
                                        label: 'Dictionary',
                                        key: 'dictionary',
                                        icon: <BookSaved size={20} />,
                                        tooltip: 'Suggest from dictionary'
                                    },
                                    {
                                        label: 'Community',
                                        key: 'community',
                                        icon: <People size={20} />,
                                        tooltip: 'Suggest from community'
                                    }
                                ]}
                                activeKey={definitionSuggestType}
                                onChange={(key) => {
                                    setDefinitionSuggestType(key as 'community' | 'dictionary');
                                }}
                            />
                        )}
                    </GridCol>
                </GridRow>
                <SpaceComponent height={16} />
            </div>
            <SpaceComponent height={24} />
            <div
                className="word-card-footer"
                style={{
                    width: '100%',
                    padding: '0 24px 24px 24px'
                }}>
                <div className="flex flex-row w-full">
                    <div className="flex flex-col w-full">
                        <div className="w-full">
                            {contexts.map((item, i) => {
                                return (
                                    <RowComponent alignItems="flex-end">
                                        <InputComponent
                                            animationType="slideCenter"
                                            type="textarea"
                                            value={item}
                                            onChange={(value) => {
                                                contexts[i] = value;
                                                setContexts([...contexts]);
                                            }}
                                            borderType="bottom"
                                            label={'Context ' + (i + 1)}
                                            style={{
                                                marginBottom: 16
                                            }}
                                            // errorText={
                                            //     i === word.contextErrorText?.index
                                            //         ? word.contextErrorText?.contextErrorText
                                            //         : ''
                                            // }
                                            suggest={item.trim() === '' ? true : false}
                                            suggestData={async (text) => {
                                                return await suggestContext(
                                                    name,
                                                    text,
                                                    contexts,
                                                    6
                                                );
                                            }}
                                        />
                                        <SpaceComponent width={16} />
                                        <ButtonComponent
                                            className="word-card-footer-delete
                                                text-textLight dark:text-textDark
                                                hover:text-red
                                            "
                                            tabindex={-1}
                                            icon={<MinusSquare size={20} />}
                                            backgroundColor="transparent"
                                            backgroundHoverColor="var(--bg-hover-color)"
                                            backgroundActiveColor="var(--bg-active-color)"
                                            onClick={() => {
                                                word.contexts?.splice(i, 1);
                                                onWordChange(index, { ...word });
                                            }}
                                            style={{
                                                height: '40px',
                                                padding: '0 12px',
                                                marginBottom: 16
                                            }}
                                        />
                                    </RowComponent>
                                );
                            })}
                        </div>
                        <div className="flex flex-row justify-end">
                            <ButtonComponent
                                icon={<AddSquare size={20} />}
                                backgroundColor="transparent"
                                backgroundHoverColor="var(--bg-hover-color)"
                                backgroundActiveColor="var(--bg-active-color)"
                                onClick={() => {
                                    word.contexts?.push('');
                                    onWordChange(index, { ...word });
                                }}
                                style={{
                                    height: '40px',
                                    padding: '0 12px',
                                    color: 'var(--secondary-text-color)'
                                }}
                            />
                        </div>
                    </div>
                    <div className="ml-6">
                        <Upload
                            className="w-full h-full max-h-[200px] min-h-[150px]  max-w-[200px]
                                min-w-[120px]
                                lg:min-w-[180px]    
                            "
                            defaultImage={word.imageURL}
                            type="picture"
                            action={async (file) => {
                                onWordChange(index, { ...word, imageURL: file });
                            }}
                            onRemove={() => {
                                onWordChange(index, { ...word, imageURL: '' });
                            }}
                        />
                    </div>
                </div>
            </div>
        </ColumnComponent>
    );
}

export default WordCardComponent;

// Upload
{
    /* <div className="flex justify-end">
    <Upload
        className="w-full h-full max-h-[200px] min-h-[150px] min-w-[150px] max-w-[200px]
                                    md:min-w-[60px]
                                "
        type="picture"
        action={(file) => {
            console.log(file);
        }}
    />
</div>; */
}

// Add
{
    /* <ButtonComponent
    icon={<AddSquare size={20} />}
    backgroundColor="transparent"
    backgroundHoverColor="var(--bg-hover-color)"
    backgroundActiveColor="var(--bg-active-color)"
    onClick={() => {
        context?.push('');
        onContextChange?.(index, context ?? []);
    }}
    style={{
        height: '40px',
        padding: '0 12px',
        color: 'var(--secondary-text-color)'
    }}
/>; */
}

// context
