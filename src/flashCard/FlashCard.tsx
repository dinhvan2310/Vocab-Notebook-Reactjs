import { useState } from 'react';
import TitleComponent from '../components/commonComponent/Title/TitleComponent';
import { VolumeHigh } from 'iconsax-react';
import ButtonComponent from '../components/commonComponent/Button/ButtonComponent';
import TextComponent from '../components/commonComponent/Text/TextComponent';

interface FlashCardProps {
    question: string;
    answer: string;

    style?: React.CSSProperties;
    className?: string;
}

function FlashCard(props: FlashCardProps) {
    // props
    const { question, answer, style, className = '' } = props;

    // state
    const [showAnswer, setShowAnswer] = useState(false);

    // handlers
    const handleToggleAnswer = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowAnswer((prev) => !prev);
    };

    return (
        <div
            className={`${className}
            relative w-full h-full flex items-center justify-center
            rounded-xl cursor-pointer 
        `}
            style={style}>
            <ButtonComponent
                onClick={(e) => {
                    e.preventDefault();

                    const synth = window.speechSynthesis;
                    const utterThis = new SpeechSynthesisUtterance(question);
                    synth.speak(utterThis);
                }}
                style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                    padding: '8px'
                }}
                backgroundColor="transparent"
                backgroundHoverColor="var(--bg-hover-color)"
                backgroundActiveColor="var(--bg-active-color)">
                <VolumeHigh size={20} className="" />
            </ButtonComponent>
            <div
                className="absolute w-full h-full 
                flex items-center justify-center
                px-24
                "
                onClick={handleToggleAnswer}>
                <TitleComponent
                    title={showAnswer ? answer : question}
                    fontSize={showAnswer ? '2em' : '2.8em'}
                    className="text-center"
                    titleStyle={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-line'
                    }}
                    containerStyle={{}}
                />
            </div>
            <TextComponent
                text={showAnswer ? 'Tap to show word' : 'Tap to show meaning'}
                className="absolute bottom-4 right-4"
            />
        </div>
    );
}

export default FlashCard;
