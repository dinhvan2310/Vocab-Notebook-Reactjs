import { useState } from 'react';
import TabsComponent from '../../components/Tabs/TabsComponent';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import { getFolders } from '../../firebase/folderAPI';
import { getWordSet, getWordSets } from '../../firebase/wordSetAPI';

function HomeLayout() {
    const [activeTab, setActiveTab] = useState('recently added');

    return (
        <TabsComponent
            activeKey={activeTab}
            items={[
                {
                    key: 'frequency usage',
                    label: 'Frequency Usage',
                    children: (
                        <div>
                            <ButtonComponent
                                onClick={async () => {
                                    const data3 = await getFolders(
                                        '6e6E7UuYArfdv32s0silzBgmxt32',
                                        0,
                                        10,
                                        'q',
                                        'createAt'
                                    );
                                    const data4 = await getFolders(
                                        '6e6E7UuYArfdv32s0silzBgmxt32',
                                        0,
                                        10,
                                        'q',
                                        'modifiedAt'
                                    );
                                }}
                                text="Get Folders"
                            />

                            <ButtonComponent
                                onClick={async () => {
                                    // const r = await getWordSets('cVLTXpkGwBYnQdTGEuiM');
                                    // const rs = await getWordSets(
                                    //     'cVLTXpkGwBYnQdTGEuiM',
                                    //     0,
                                    //     10,
                                    //     'q',
                                    //     'nameLowercase'
                                    // );
                                    // const data = await getWordSets(
                                    //     'cVLTXpkGwBYnQdTGEuiM',
                                    //     0,
                                    //     10,
                                    //     'q',
                                    //     'createAt'
                                    // );
                                    const data1 = await getWordSets(
                                        'cVLTXpkGwBYnQdTGEuiM',
                                        0,
                                        10,
                                        'q',
                                        'modifiedAt'
                                    );
                                }}
                            />
                        </div>
                    )
                },
                {
                    key: 'rating',
                    label: 'Rating',
                    children: (
                        <div
                            style={{
                                height: 40,
                                width: '100%',
                                backgroundColor: 'blue'
                            }}></div>
                    )
                },
                {
                    key: 'recently added',
                    label: 'Recently Added',
                    children: (
                        <div
                            style={{
                                height: 40,
                                width: '100%',
                                backgroundColor: 'green'
                            }}></div>
                    )
                }
            ]}
            onChange={(key) => {
                setActiveTab(key);
            }}
            fontSize="1.2em"
        />
    );
}

export default HomeLayout;
