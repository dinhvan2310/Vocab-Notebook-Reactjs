import PageNotFound from '../../assets/animation/pageNotFound.json';
import Lottie from 'react-lottie';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import { useNavigate } from 'react-router-dom';

function NotFoundLayout() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-full overflow-hidden">
            <div className="flex flex-row items-center p-72">
                <div className="w-124 h-124">
                    <Lottie options={{ animationData: PageNotFound }} />
                </div>
                <div className="flex flex-col justify-between">
                    <TitleComponent
                        title="Sorry the page you are looking for 
                    does not exist"
                        fontSize="3.2em"
                        titleStyle={{
                            textWrap: 'wrap'
                        }}
                    />
                    <TextComponent text={'Return to the home page by clicking the button below'} />
                    <ButtonComponent
                        className="mt-24"
                        text="Go to Home"
                        onClick={() => {
                            navigate('/');
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default NotFoundLayout;
