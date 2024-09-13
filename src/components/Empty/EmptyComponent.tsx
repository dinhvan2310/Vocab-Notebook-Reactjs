import EmptySVG from '../../assets/image/empty.svg';
import TextComponent from '../commonComponent/Text/TextComponent';
interface EmptyProps {
    text?: string;
    className?: string;
    style?: React.CSSProperties;
}

function EmptyComponent(props: EmptyProps) {
    const { text, className = '', style } = props;
    return (
        <div
            className={`${className}
            flex flex-col items-center justify-center
        `}
            style={style}>
            <img src={EmptySVG} alt="empty" />
            <TextComponent
                className="empty-text mt-2"
                text={text ?? ''}
                style={{
                    display: 'inline'
                }}
            />
        </div>
    );
}

export default EmptyComponent;
