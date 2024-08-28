import Upload from '../../components/Upload/Upload';
import { uploadImage } from '../../firebase/utils/uploadImage';

function HomeLayout() {
    return (
        <>
            <Upload
                action={async (file) => {
                    if (!file) return;
                    const url = await uploadImage(file);
                    console.log(url);
                }}
                type="picture"
                style={{}}
            />
        </>
    );
}

export default HomeLayout;
