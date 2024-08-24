import { Trash } from 'iconsax-react';
import ButtonComponent from '../commonComponent/Button/ButtonComponent';
import ColumnComponent from '../commonComponent/Column/ColumnComponent';
import InputComponent from '../commonComponent/Input/InputComponent';
import RowComponent from '../commonComponent/Row/RowComponent';
import SpaceComponent from '../commonComponent/Space/SpaceComponent';
import TitleComponent from '../commonComponent/Title/TitleComponent';
import './WordCardComponent.scss';
interface WordCardComponentProps {
    index: number;
    term: string;
    definition: string;
    className?: string;

    onTermChange: (index: number, term: string) => void;
    onDefinitionChange: (index: number, definition: string) => void;
    onDelete: (index: number) => void;
}
function WordCardComponent(props: WordCardComponentProps) {
    const { index, term, definition, onTermChange, onDefinitionChange, className, onDelete } =
        props;

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
                    title={index.toString()}
                    color="var(--secondary-text-color)"
                    className="word-card-header-index"
                />
                <RowComponent>
                    <ButtonComponent
                        icon={<Trash size={20} className="word-card-header-icon-command" />}
                        backgroundColor="transparent"
                        onClick={() => onDelete(index)}
                        backgroundHoverColor="transparent"
                        backgroundActiveColor="transparent"
                        style={{
                            height: '40px',
                            padding: '0 12px',
                            color: 'var(--secondary-text-color)'
                        }}
                    />
                </RowComponent>
            </RowComponent>
            <SpaceComponent height={20} />

            <RowComponent
                className="word-card-content"
                alignItems="flex-start"
                style={{
                    width: '100%'
                }}>
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
                        fontSize: '1.6em',
                        color: 'var(--text-color)'
                    }}
                    animationType="slideCenter"
                />
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
            </RowComponent>
            <SpaceComponent height={48} />
        </ColumnComponent>
    );
}

export default WordCardComponent;
