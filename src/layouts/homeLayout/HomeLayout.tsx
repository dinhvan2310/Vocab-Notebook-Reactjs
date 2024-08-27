import { Minus } from 'iconsax-react';
import GridCol from '../../components/Grid/GridCol';
import GridRow from '../../components/Grid/GridRow';
import Upload from '../../components/Upload/Upload';

function HomeLayout() {
    return (
        <>
            <Upload action={(file) => console.log(file)} type="picture" style={{}} />
            <Upload action={(file) => console.log(file)} type="file" style={{}} />
        </>
    );
}

export default HomeLayout;
