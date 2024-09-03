import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import InputComponent from '../../components/commonComponent/Input/InputComponent';
import GridCol from '../../components/Grid/GridCol';
import GridRow from '../../components/Grid/GridRow';
import {
    addWordSet,
    getWordSet,
    getWordSets,
    removeWordSet,
    updateWordSet
} from '../../firebase/wordSetAPI';
import { useMessage } from '../../hooks/useMessage';
import { getFolders } from '../../firebase/folderAPI';

function HomeLayout() {
    const message = useMessage();

    const [folderId, setFolderId] = useState<string>('');
    const [wordSetId, setWordSetId] = useState<string>('');

    return (
        <div className="flex flex-col">
            <InputComponent
                onChange={(value) => setFolderId(value)}
                value={folderId}
                type="text"
                borderType="all"
                label="Folder ID"
            />
            <InputComponent
                onChange={(value) => setWordSetId(value)}
                value={wordSetId}
                type="text"
                borderType="all"
                label="WordSet ID"
            />
            <GridRow gutter={[16, 16]} className="w-full">
                <GridCol span={2}>
                    <ButtonComponent
                        text="addWordSet"
                        onClick={async () => {
                            await getFolders(
                                '6e6E7UuYArfdv32s0silzBgmxt32',
                                0,
                                10,
                                '12',
                                'nameLowercase'
                            );
                        }}
                    />
                </GridCol>
                <GridCol span={2}>
                    <ButtonComponent
                        text="updateWordSet"
                        onClick={async () => {
                            const wordSet = await getWordSet(wordSetId);
                            const rs = await updateWordSet(
                                wordSetId,
                                wordSet.name + ' updated',
                                wordSet.visibility,
                                wordSet.imageUrl,
                                wordSet.words
                            );

                            console.log(rs);
                        }}
                    />
                </GridCol>
                <GridCol span={2}>
                    <ButtonComponent
                        text="Delete WordSet"
                        onClick={async () => {
                            await removeWordSet(wordSetId);
                            setWordSetId('');
                        }}
                    />
                </GridCol>
                <GridCol span={2}>
                    <ButtonComponent
                        text="Get WordSet"
                        onClick={async () => {
                            const rs = await getWordSet(wordSetId);
                            console.log(rs);
                        }}
                    />
                </GridCol>
                <GridCol span={2}>
                    <ButtonComponent
                        onClick={async () => {
                            const rs = await getWordSets(folderId, 0, 10, '', 'nameLowercase');
                            console.log(rs);
                        }}
                        text="Get All WordSet"
                    />
                </GridCol>
            </GridRow>
        </div>
    );
}

export default HomeLayout;
