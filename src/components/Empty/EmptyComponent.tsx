import EmptySVG from '../../assets/image/empty.svg';
import TextComponent from '../commonComponent/Text/TextComponent';
import './EmptyComponent.scss';
interface EmptyProps {
    text?: string;
    className?: string;
    style?: React.CSSProperties;
}

function EmptyComponent(props: EmptyProps) {
    const { text, className = '', style } = props;
    return (
        <div className={`empty-container ${className}`} style={style}>
            <img src={EmptySVG} alt="empty" />
            <TextComponent className="empty-text mt-2" text={text ?? ''} />
        </div>
    );
}

export default EmptyComponent;
