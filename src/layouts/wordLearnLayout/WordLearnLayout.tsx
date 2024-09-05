import { Aave, Edit2, Notepad, Setting2, Star1, Timer1 } from 'iconsax-react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import NotFoundUser from '../../assets/image/no_avatar.png';
import CardComponent from '../../components/Card/CardComponent';
import Carousel from '../../components/Carousel/Carousel';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import HorizontalRuleComponent from '../../components/commonComponent/HorizontalRule/HorizontalRuleComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import GridCol from '../../components/Grid/GridCol';
import GridRow from '../../components/Grid/GridRow';
import { getWordSet, updateWord } from '../../firebase/wordSetAPI';
import FlashCard from '../../flashCard/FlashCard';
import FolderType from '../../types/FolderType';
import { UserType } from '../../types/UserType';
import { WordSetType } from '../../types/WordSetType';
import { WordType } from '../../types/WordType';
import { timeAgo } from '../../utils/timeAgo';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SelectComponent from '../../components/Select/SelectComponent';

function WordLearnLayout() {
    // meta data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loaderData = useLoaderData() as any;
    const user: UserType = loaderData.user;
    const folder: FolderType = loaderData.folder;
    const { wordsetid } = useParams();

    const navigate = useNavigate();

    const wordSetQuery = useQuery<WordSetType>({
        queryKey: ['wordSet', wordsetid],
        queryFn: async () => {
            return await getWordSet(wordsetid ?? '');
        }
    });

    // state
    // const [autoPlayFlashCard, setAutoPlayFlashCard] = useState(false);
    const [learnedSelected, setLearnedSelected] = useState<'all' | 'starred'>('all');
    const [sortSelected, setSortSelected] = useState<'Amphabet' | 'Created' | 'Learned'>(
        'Amphabet'
    );

    //options UI
    const learnedOptions = [
        {
            label: 'All',
            value: 'all'
        },
        {
            label: 'Starred',
            value: 'starred',
            icon: <Star1 size={16} />
        }
    ];

    const sortOptions = [
        {
            label: 'Amphabet',
            value: 'Amphabet',
            icon: <Aave size={16} />
        },
        {
            label: 'Created',
            value: 'Created',
            icon: <Timer1 size={16} />
        },
        {
            label: 'Learned',
            value: 'Learned',
            icon: <Star1 size={16} />
        }
    ];

    // handlers
    const handleEditWordSet = () => {
        navigate(`/edit-wordset/${wordSetQuery.data?.wordsetId}?inFolder=${folder.folderId}`);
    };

    return (
        <div
            className="flex flex-col
            max-w-[1024px] m-auto
        ">
            <TitleComponent title={wordSetQuery.data?.name} className="mb-8" fontSize="3em" />
            <RowComponent className="relative">
                <Carousel
                    autoPlay={false}
                    screens={wordSetQuery.data?.words.map((word: WordType) => (
                        <FlashCard
                            key={word.name}
                            question={word.name}
                            answer={word.meaning}
                            className="bg-bgLight dark:bg-bgDark"
                        />
                    ))}
                    style={{
                        width: '100%',
                        height: '360px'
                    }}
                />
            </RowComponent>
            <SpaceComponent height={32} />
            <RowComponent justifyContent="space-between" alignItems="flex-start">
                <ColumnComponent alignItems="flex-start">
                    <RowComponent alignItems="center">
                        <img
                            src={user.photoURL || NotFoundUser}
                            alt="avatar"
                            style={{
                                objectFit: 'cover',
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%'
                            }}
                        />
                        <SpaceComponent width={16} />
                        <ColumnComponent alignItems="flex-start">
                            <TextComponent text="Author" fontSize="1.3em" />
                            <TitleComponent title={user.name || 'Unknown user'} fontSize="1.5em" />
                            <TextComponent
                                text={
                                    'Created at ' +
                                    timeAgo(wordSetQuery.data?.createAt.seconds || 0 * 1000)
                                }
                                fontSize="1.3em"
                            />
                        </ColumnComponent>
                    </RowComponent>
                    <SpaceComponent height={16} />
                    <RowComponent>
                        <TextComponent text={'Belong to folder: '} fontSize="1.3em" />
                        <SpaceComponent width={8} />
                        <TitleComponent title={folder.name} fontSize="1.5em" />
                    </RowComponent>
                </ColumnComponent>
                <RowComponent>
                    <ButtonComponent
                        style={{
                            height: '40px',
                            paddingLeft: '16px',
                            paddingRight: '16px'
                        }}
                        text="Share"
                        onClick={() => {}}
                        backgroundColor="var(--bg-color)"
                        backgroundHoverColor="var(--bg-hover-color)"
                        backgroundActiveColor="var(--bg-active-color)"
                        isBorder={true}
                        textColor="var(--secondary-text-color)"
                    />
                    <SpaceComponent width={8} />
                    <ButtonComponent
                        tabindex={-1}
                        icon={<Edit2 size={20} />}
                        onClick={() => {
                            handleEditWordSet();
                        }}
                        backgroundColor="var(--bg-color)"
                        backgroundHoverColor="var(--bg-hover-color)"
                        backgroundActiveColor="var(--bg-active-color)"
                        isBorder={true}
                        borderColor="var(--border-color)"
                        textColor="var(--secondary-text-color)"
                        style={{
                            height: '40px',
                            padding: '0 12px'
                        }}
                    />
                    <SpaceComponent width={8} />
                    <ButtonComponent
                        tabindex={-1}
                        icon={<Setting2 size={20} />}
                        onClick={() => {
                            // setModalSettingOpen(true);
                        }}
                        backgroundColor="var(--bg-color)"
                        backgroundHoverColor="var(--bg-hover-color)"
                        backgroundActiveColor="var(--bg-active-color)"
                        isBorder={true}
                        borderColor="var(--border-color)"
                        textColor="var(--secondary-text-color)"
                        style={{
                            height: '40px',
                            padding: '0 12px'
                        }}
                    />
                </RowComponent>
            </RowComponent>

            <SpaceComponent height={32} />
            <RowComponent>
                <HorizontalRuleComponent
                    type="left"
                    text={`Word in this set (${wordSetQuery.data?.words.length})`}
                    style={{}}
                />
                <SpaceComponent width={16} />
                <RowComponent justifyContent="flex-end">
                    <SelectComponent
                        options={sortOptions}
                        width="140px"
                        value={sortSelected}
                        defaultValue={sortSelected}
                        onChange={(value) => {
                            setSortSelected(value as 'Amphabet' | 'Created' | 'Learned');
                        }}
                    />
                    <SpaceComponent width={8} />
                    <SelectComponent
                        options={learnedOptions}
                        onChange={(value) => {
                            setLearnedSelected(value as 'all' | 'starred');
                        }}
                        width="120px"
                        defaultValue={learnedSelected}
                        value={learnedSelected}
                    />
                </RowComponent>
            </RowComponent>
            <SpaceComponent height={32} />
            <GridRow gutter={[16, 16]}>
                {wordSetQuery.data?.words.map((word: WordType) => (
                    <GridCol
                        key={word.name}
                        span={12}
                        className={`${
                            learnedSelected === 'starred' && !word.learned ? 'hidden' : ''
                        }`}>
                        <CardComponent
                            className="h-full relative
                        "
                            style={{}}>
                            <GridRow>
                                <GridCol span={4}>
                                    <ColumnComponent alignItems="flex-start">
                                        <TitleComponent title={word.name} fontSize="1.6em" />
                                        {word.imageURL && (
                                            <div
                                                className="
                                                pt-4
                                                pr-8
                                            ">
                                                <img
                                                    src={word.imageURL as string}
                                                    alt={word.name}
                                                    className="
                                                rounded-lg 
                                                object-cover
                                                max-h-[240px]
                                                "
                                                />
                                            </div>
                                        )}
                                    </ColumnComponent>
                                </GridCol>
                                <GridCol span={8}>
                                    <ColumnComponent alignItems="flex-start">
                                        <TextComponent text={word.meaning} fontSize="1.6em" />
                                        <SpaceComponent height={12} />
                                        {word.contexts &&
                                            word.contexts.map((context: string) => (
                                                <RowComponent
                                                    alignItems="center"
                                                    key={context}
                                                    className="mb-2">
                                                    <div>
                                                        <Notepad size={12} className="mr-2" />
                                                    </div>
                                                    <TextComponent
                                                        text={context}
                                                        fontSize="1.3em"
                                                    />
                                                </RowComponent>
                                            ))}
                                    </ColumnComponent>
                                </GridCol>
                            </GridRow>
                            <ButtonComponent
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await updateWord(
                                        wordSetQuery.data?.wordsetId ?? '',
                                        word.name,
                                        undefined,
                                        undefined,
                                        undefined,
                                        undefined,
                                        !word.learned
                                    );
                                    wordSetQuery.refetch();
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    padding: '8px'
                                }}
                                backgroundColor="transparent"
                                backgroundHoverColor="var(--bg-hover-color)"
                                backgroundActiveColor="var(--bg-active-color)">
                                <Star1
                                    size={20}
                                    className="
                                "
                                    variant={word.learned ? 'Bold' : 'Linear'}
                                />
                            </ButtonComponent>
                        </CardComponent>
                    </GridCol>
                ))}
            </GridRow>
            <SpaceComponent height={64} />
        </div>
    );
}

export default WordLearnLayout;
