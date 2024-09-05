import { Next, Previous } from 'iconsax-react';
import { ReactNode, useState } from 'react';
import ButtonComponent from '../commonComponent/Button/ButtonComponent';
import TextComponent from '../commonComponent/Text/TextComponent';
import EmptyComponent from '../Empty/EmptyComponent';

interface CarouselProps {
    screens?: ReactNode[];
    interval?: number;
    autoPlay?: boolean;
    showArrows?: boolean;

    onSlideChange?: (index: number) => void;

    className?: string;
    style?: React.CSSProperties;
}

function Carousel(props: CarouselProps) {
    // props
    const {
        screens,
        interval = 5000,
        autoPlay = true,
        onSlideChange,
        className = '',
        style,
        showArrows = true
    } = props;

    // state
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!screens || screens.length === 0) return <EmptyComponent />;

    // handlers
    const handleSlideChange = (index: number) => {
        setCurrentSlide(index);
        onSlideChange && onSlideChange(index);
    };

    const handlePrevClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const nextSlide = currentSlide === 0 ? screens.length - 1 : currentSlide - 1;
        handleSlideChange(nextSlide);
    };

    const handleNextClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const nextSlide = currentSlide === screens.length - 1 ? 0 : currentSlide + 1;
        handleSlideChange(nextSlide);
    };

    // auto play
    if (autoPlay) {
        setTimeout(() => {
            const nextSlide = currentSlide === screens.length - 1 ? 0 : currentSlide + 1;
            handleSlideChange(nextSlide);
        }, interval);
    }

    return (
        <div
            className={`${className}
            relative overflow-hidden
            transition-all duration-300 ease-in-out
        `}
            style={style}>
            {screens[currentSlide]}
            {showArrows && (
                <>
                    <ButtonComponent
                        onClick={handlePrevClick}
                        style={{
                            padding: '0.5rem',
                            position: 'absolute',
                            left: 16,
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                        backgroundColor="transparent"
                        backgroundHoverColor="var(--bg-hover-color)"
                        backgroundActiveColor="var(--bg-active-color)">
                        <Previous size={24} className="" />
                    </ButtonComponent>
                    <ButtonComponent
                        onClick={handleNextClick}
                        style={{
                            padding: '0.5rem',
                            position: 'absolute',
                            right: 16,
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                        backgroundColor="transparent"
                        backgroundHoverColor="var(--bg-hover-color)"
                        backgroundActiveColor="var(--bg-active-color)">
                        <Next size={24} />
                    </ButtonComponent>
                </>
            )}
            <TextComponent
                text={`${currentSlide + 1}/${screens.length}`}
                className="absolute bottom-4 left-4"
            />
        </div>
    );
}

export default Carousel;