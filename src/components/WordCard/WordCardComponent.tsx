import { AddSquare, MinusSquare, Trash } from 'iconsax-react';
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
import { WordEditType } from '../../layouts/wordEditLayout/WordEditLayout';
interface WordCardComponentProps {
    index: number;
    className?: string;

    word: WordEditType;
    onWordChange: (index: number, word: WordEditType) => void;

    onDelete: (index: number) => void;
}
function WordCardComponent(props: WordCardComponentProps) {
    const { index, className, onDelete, word, onWordChange } = props;

    return (
        <ColumnComponent
            className={`word-card-container ${className ?? ''}
                animate-fadeIn    
            `}
            justifyContent="space-between"
            style={{}}>
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
                        tabindex={-1}
                        icon={<Trash size={20} className="word-card-header-icon-command-delete" />}
                        backgroundColor="transparent"
                        backgroundHoverColor="var(--bg-hover-color)"
                        backgroundActiveColor="var(--bg-active-color)"
                        onClick={() => onDelete(index)}
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
                            value={word.name}
                            onChange={(value) => onWordChange(index, { ...word, name: value })}
                            placeholder="Enter term"
                            label="Term"
                            type="text"
                            borderType="bottom"
                            inputStyle={{
                                fontSize: '1.6em'
                            }}
                            animationType="slideInLeft"
                            errorText={word.titleErrorText}
                        />
                    </GridCol>
                    <GridCol span={6}>
                        <InputComponent
                            style={{}}
                            value={word.meaning}
                            onChange={(value) => onWordChange(index, { ...word, meaning: value })}
                            placeholder="Enter definition"
                            label="Definition"
                            type="textarea"
                            animationType="slideInLeft"
                            borderType="bottom"
                            errorText={word.meaningErrorText}
                        />
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
                            {word.contexts?.map((item, i) => {
                                return (
                                    <RowComponent alignItems="flex-end">
                                        <InputComponent
                                            animationType="slideCenter"
                                            type="textarea"
                                            value={item}
                                            onChange={(value) => {
                                                word.contexts[i] = value;
                                                onWordChange(index, { ...word });
                                            }}
                                            borderType="bottom"
                                            label={'Context ' + (i + 1)}
                                            style={{
                                                marginBottom: 16
                                            }}
                                            errorText={
                                                i === word.contextErrorText?.index
                                                    ? word.contextErrorText?.contextErrorText
                                                    : ''
                                            }
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
