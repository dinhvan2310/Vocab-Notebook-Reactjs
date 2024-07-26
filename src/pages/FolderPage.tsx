import { useLoaderData } from 'react-router-dom';
import FolderCardComponent from '../components/FolderCardComponent';
import { User } from 'firebase/auth';

function FolderPage() {
    const { user } = useLoaderData() as { user: User };
    return (
        <>
            <FolderCardComponent
                numberOfItems={12}
                title="My Folder"
                userImageUrl={user.photoURL ?? ''}
                onClick={() => console.log('Folder clicked')}
            />
            <FolderCardComponent
                numberOfItems={12}
                title="My Folder"
                onClick={() => console.log('Folder clicked')}
                userImageUrl={user.photoURL ?? ''}
            />
        </>
    );
}

export default FolderPage;
