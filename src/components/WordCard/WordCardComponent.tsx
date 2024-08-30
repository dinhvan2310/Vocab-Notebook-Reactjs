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
interface WordCardComponentProps {
    index: number;
    className?: string;

    term: string;
    definition: string;
    context?: string[];
    onTermChange: (index: number, term: string) => void;
    onDefinitionChange: (index: number, definition: string) => void;
    onContextChange?: (index: number, context: string[]) => void;
    onDelete: (index: number) => void;
}
function WordCardComponent(props: WordCardComponentProps) {
    const {
        index,
        term,
        definition,
        onTermChange,
        onDefinitionChange,
        className,
        onDelete,
        context,
        onContextChange
    } = props;

    return (
        <ColumnComponent
            className={`word-card-container ${className ?? ''}`}
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
                            color: 'var(--secondary-text-color)'
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
                            value={term}
                            onChange={(value) => onTermChange(index, value)}
                            placeholder="Enter term"
                            label="Term"
                            type="text"
                            borderType="bottom"
                            inputStyle={{
                                fontSize: '1.6em'
                            }}
                            animationType="slideCenter"
                        />
                    </GridCol>
                    <GridCol span={6}>
                        <InputComponent
                            style={{}}
                            value={definition}
                            onChange={(value) => onDefinitionChange(index, value)}
                            placeholder="Enter definition"
                            label="Definition"
                            type="textarea"
                            animationType="slideCenter"
                            borderType="bottom"
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
                <GridRow gutter={24}>
                    <GridCol span={10}>
                        {context?.map((item, i) => {
                            return (
                                <RowComponent alignItems="flex-end">
                                    <InputComponent
                                        type="textarea"
                                        value={item}
                                        onChange={(value) => {
                                            const newContext = [...context];
                                            newContext[i] = value;
                                            onContextChange?.(index, newContext);
                                        }}
                                        borderType="bottom"
                                        label={'Context ' + (i + 1)}
                                        style={{
                                            marginBottom: 16
                                        }}
                                    />
                                    <SpaceComponent width={16} />
                                    <ButtonComponent
                                        className="word-card-footer-delete"
                                        tabindex={-1}
                                        icon={<MinusSquare size={20} />}
                                        backgroundColor="transparent"
                                        backgroundHoverColor="var(--bg-hover-color)"
                                        backgroundActiveColor="var(--bg-active-color)"
                                        onClick={() => {
                                            const newContext = [...context];
                                            newContext.splice(i, 1);
                                            onContextChange?.(index, newContext);
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

                        <RowComponent justifyContent="flex-end">
                            <ButtonComponent
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
                            />
                        </RowComponent>
                    </GridCol>
                    <GridCol span={2}>
                        <Upload
                            className="w-full h-full max-h-[200px] min-h-[150px]"
                            type="picture"
                            action={(file) => {
                                console.log(file);
                            }}
                        />
                    </GridCol>
                </GridRow>
                <SpaceComponent height={16} />
            </div>
        </ColumnComponent>
    );
}

export default WordCardComponent;
