import './SpinComponent.scss';
import LoadingDefault from '../../../assets/animation/loadingAnimation.json';
import Lottie from 'react-lottie';
import React from 'react';

interface SpinComponentProps {
    indicator?: object;
    spinning?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

function SpinComponent(props: SpinComponentProps) {
    const { indicator = LoadingDefault, spinning = true, style, className = '' } = props;
    return (
        <div style={style} className={`spin-container ${className}`}>
            <div className={`spin`}>
                <div className="spin-dot">
                    {
                        <Lottie
                            isStopped={!spinning}
                            options={{
                                loop: true,
                                autoplay: true,
                                animationData: indicator,
                                rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice'
                                }
                            }}
                        />
                    }
                </div>
            </div>
        </div>
    );
}

export default SpinComponent;
