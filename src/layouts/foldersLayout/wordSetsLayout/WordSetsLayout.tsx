import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './WordSetsLayout.scss';
import { useResponsive } from '../../../hooks/useResponsive';

function WordSetsLayout() {
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { isTabletOrMobile } = useResponsive();

    console.log(username, location, navigate, isTabletOrMobile);

    return <div>WordSetsLayout</div>;
}

export default WordSetsLayout;
