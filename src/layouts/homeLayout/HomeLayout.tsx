import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import Upload from '../../components/Upload/Upload';
import { uploadImage } from '../../firebase/utils/uploadImage';
import { useMessage } from '../../hooks/useMessage';

function HomeLayout() {
    const message = useMessage();
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

            <ButtonComponent
                text="Show Message Success"
                onClick={() => {
                    message('success', 'This is a success message');
                }}
            />
            <ButtonComponent
                text="Show Message Error"
                onClick={() => {
                    message('error', 'This is a success message error');
                }}
            />
            <ButtonComponent
                text="Show Message Info"
                onClick={() => {
                    message('info', 'This is a success message info');
                }}
            />
            <ButtonComponent
                text="Show Message Warning"
                onClick={() => {
                    message('warning', 'This is a success message warning');
                }}
            />
        </>
    );
}

export default HomeLayout;
