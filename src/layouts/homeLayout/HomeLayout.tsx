import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import { getFolders } from '../../firebase/folderAPI';

function HomeLayout() {
    return (
        <div>
            <ButtonComponent
                onClick={async () => {
                    const rs = await getFolders(
                        '6e6E7UuYArfdv32s0silzBgmxt32',
                        0,
                        10,
                        '',
                        'modifiedAt'
                    );
                    console.log(rs);
                }}
                text="Click Me"
            />
        </div>
    );
}

export default HomeLayout;
