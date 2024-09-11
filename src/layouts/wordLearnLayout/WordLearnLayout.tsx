import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Aave,
    Copy,
    Edit2,
    Import,
    Notepad,
    Setting2,
    Star1,
    Timer1,
    VolumeHigh
} from 'iconsax-react';
import { useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import NotFoundUser from '../../assets/image/no_avatar.png';
import CardComponent from '../../components/Card/CardComponent';
import Carousel from '../../components/Carousel/Carousel';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import HorizontalRuleComponent from '../../components/commonComponent/HorizontalRule/HorizontalRuleComponent';
import InputComponent from '../../components/commonComponent/Input/InputComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import GridCol from '../../components/Grid/GridCol';
import GridRow from '../../components/Grid/GridRow';
import ModalComponent from '../../components/Modal/ModalComponent';
import SelectComponent from '../../components/Select/SelectComponent';
import Upload from '../../components/Upload/Upload';
import { getWordSet, updateWordSet } from '../../firebase/wordSetAPI';
import FlashCard from '../../flashCard/FlashCard';
import { useMessage } from '../../hooks/useMessage';
import FolderType from '../../types/FolderType';
import { UserType } from '../../types/UserType';
import { WordSetType } from '../../types/WordSetType';
import { WordType } from '../../types/WordType';
import { timeAgo } from '../../utils/timeAgo';
import LinkComponent from '../../components/Link/LinkComponent';
import { getWords, updateWord } from '../../firebase/wordAPI';

function WordLearnLayout() {
    // meta data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loaderData = useLoaderData() as any;
    const user: UserType = loaderData.user;
    const folder: FolderType = loaderData.folder;
    const { wordsetid } = useParams();
    const message = useMessage();
    const navigate = useNavigate();

    // state
    // const [autoPlayFlashCard, setAutoPlayFlashCard] = useState(false);
    const [modalExportOpen, setModalExportOpen] = useState(false);
    const [modalSettingOpen, setModalSettingOpen] = useState(false);
    const [learnedSelected, setLearnedSelected] = useState<'all' | 'starred'>('all');
    const [sortSelected, setSortSelected] = useState<'Amphabet' | 'Created' | 'Learned'>('Created');

    const wordSetQuery = useQuery<{
        WordSet: WordSetType;
        words: WordType[];
    }>({
        queryKey: ['wordSet', wordsetid, sortSelected],
        queryFn: async () => {
            const wordSet = await getWordSet(wordsetid ?? '');
            const words = await getWords(wordsetid ?? '');
            if (words.some((word) => word.createdAt === undefined)) throw new Error('Error');

            if (sortSelected === 'Amphabet') {
                return {
                    WordSet: wordSet,
                    words: words.sort((a, b) => a.name.localeCompare(b.name))
                };
            }
            if (sortSelected === 'Created') {
                return {
                    WordSet: wordSet,
                    words: words.sort(
                        (a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)
                    )
                };
            } else {
                return {
                    WordSet: wordSet,
                    words: words.sort((a) => (a.learned ? -1 : 1))
                };
            }
        }
    });

    const updateWordSetMutation = useMutation({
        mutationFn: async () => {
            // save setting to database
            await updateWordSet(
                wordSetQuery.data?.WordSet.wordsetId ?? '',
                wordSetQuery.data?.WordSet.name ?? '',
                visibility,
                editableBy,
                editableByPublicPass,
                imageCover ?? '',
                undefined
            );
            wordSetQuery.refetch();
        },
        mutationKey: ['updateWordSet']
    });

    const [imageCover, setImageCover] = useState<File | null | string>(
        wordSetQuery.data?.WordSet.imageUrl ? wordSetQuery.data.WordSet.imageUrl : null
    );

    const [editableBy, setEditableBy] = useState<'owner' | 'everyone'>(
        wordSetQuery.data?.WordSet.editableBy ?? 'owner'
    );
    const [editableByPublicPass, setEditableByPublicPass] = useState<string>(
        wordSetQuery.data?.WordSet.editablePassword ?? ''
    );
    const [visibility, setVisibility] = useState<'public' | 'private'>(
        wordSetQuery.data?.WordSet.visibility ?? 'public'
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
        navigate(
            `/edit-wordset/${wordSetQuery.data?.WordSet.wordsetId}?inFolder=${folder.folderId}`
        );
    };

    return (
        <div
            className="flex flex-col
            max-w-[1024px] m-auto
        ">
            {/* modal */}
            <ModalComponent
                open={modalExportOpen}
                // disableButtonConfirm={editableBy === 'everyone' && editableByPublicPass === ''}
                animationType="zoomIn"
                width="760px"
                isCloseIcon={true}
                // buttonComfirmLoading={updateWordSetMutation.isPending}
                closeOnOverlayClick={true}
                onCancel={() => {
                    setModalExportOpen(false);
                }}
                onConfirm={async () => {
                    // save setting on state
                    // await updateWordSetMutation.mutateAsync();
                    setModalExportOpen(false);

                    // create file in browser
                    const fileName = 'data';
                    const json = JSON.stringify(
                        wordSetQuery.data?.words.map((word) => {
                            return {
                                name: word.name,
                                meaning: word.meaning,
                                contexts: word.contexts,
                                imageURL: word.imageURL
                            };
                        }),
                        null,
                        2
                    );
                    const blob = new Blob([json], { type: 'application/json' });
                    const href = URL.createObjectURL(blob);

                    // create "a" HTLM element with href to file
                    const link = document.createElement('a');
                    link.href = href;
                    link.download = fileName + '.json';
                    document.body.appendChild(link);
                    link.click();

                    // clean up "a" element & remove ObjectURL
                    document.body.removeChild(link);
                    URL.revokeObjectURL(href);

                    message('success', 'Exported successfully');
                }}
                title="Export"
                buttonConfirmText="Export to JSON"
                isFooter={true}>
                <ColumnComponent
                    alignItems="flex-start"
                    className="w-full 
                ">
                    <div className="w-full">
                        <div
                            className={`
                            w-full max-h-56 overflow-x-auto
                            scrollbar dark:scrollbarDark
                                px-2 py-2
                                border border-borderLight dark:border-borderDark
                                rounded-md

                        `}>
                            <InputComponent
                                type="textarea"
                                value={JSON.stringify(
                                    wordSetQuery.data?.words.map((word) => {
                                        return {
                                            name: word.name,
                                            meaning: word.meaning,
                                            contexts: word.contexts,
                                            imageURL: word.imageURL
                                        };
                                    })
                                )}
                                fontSize="1.2em"
                                style={{
                                    borderRadius: '0px'
                                }}
                                borderType="none"
                                placeholder='Paste your data here. Example: [{"name":"hello","meaning":"xin chào","contexts":[""],"imageURL":"","audioURL":""}]'
                                animationType="slideCenter"
                                onChange={function (): void {}}
                                inputStyle={{}}
                                readonly={true}
                            />
                        </div>
                        <TextComponent
                            text="Export data depend on your current sort and filter, please make sure you have the right data before exporting"
                            className="mt-2 text-red"
                            fontSize="1.2em"
                            textColor="var(--red-color)"
                        />
                    </div>
                    <TextComponent text="Copy text" className="mt-4 mb-2" fontSize="1.2em" />
                    <ButtonComponent
                        tabindex={-1}
                        icon={<Copy size={20} />}
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(wordSetQuery.data?.words));
                            message('success', 'Copied to clipboard');
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
                </ColumnComponent>
            </ModalComponent>
            <ModalComponent
                open={modalSettingOpen}
                disableButtonConfirm={editableBy === 'everyone' && editableByPublicPass === ''}
                animationType="zoomIn"
                width="760px"
                isCloseIcon={true}
                buttonComfirmLoading={updateWordSetMutation.isPending}
                closeOnOverlayClick={true}
                onCancel={() => {
                    setModalSettingOpen(false);
                    // reset state
                    if (!wordSetQuery.data) {
                        setImageCover(null);
                        setVisibility('public');
                        setEditableBy('owner');
                        setEditableByPublicPass('');
                    } else {
                        setImageCover(wordSetQuery.data.WordSet.imageUrl ?? null);
                        setVisibility(wordSetQuery.data.WordSet.visibility);
                        setEditableBy(wordSetQuery.data.WordSet.editableBy);
                        setEditableByPublicPass(wordSetQuery.data.WordSet.editablePassword ?? '');
                    }
                }}
                onConfirm={async () => {
                    // save setting on state
                    await updateWordSetMutation.mutateAsync();
                    setModalSettingOpen(false);
                }}
                title="Settings"
                buttonConfirmText="Save"
                isFooter={true}>
                <ColumnComponent className="w-full px-4">
                    <Upload
                        defaultImage={imageCover ?? undefined}
                        type="picture"
                        name="Upload a cover image"
                        action={(file) => {
                            setImageCover(file || null);
                        }}
                        onRemove={() => {
                            setImageCover(null);
                        }}
                        className="w-full mb-8 h-[200px]"
                    />
                    <RowComponent justifyContent="space-between" className="w-full mb-8">
                        <ColumnComponent className="w-full" alignItems="flex-start">
                            <TitleComponent title="Visible to" className="mb-2" />
                            <SelectComponent
                                style={{
                                    borderRadius: '0px'
                                }}
                                width="100%"
                                options={[
                                    {
                                        label: 'Everyone',
                                        value: 'public'
                                    },
                                    {
                                        label: 'Only me',
                                        value: 'private'
                                    }
                                ]}
                                optionStyle={{
                                    borderRadius: '0px'
                                }}
                                onChange={(value) => {
                                    setVisibility(value as 'public' | 'private');
                                }}
                                value={visibility}
                            />
                            <TextComponent
                                fontSize="1.2em"
                                className="mt-2"
                                text={
                                    visibility === 'public'
                                        ? 'Anyone can view'
                                        : 'Only you can view'
                                }
                            />
                        </ColumnComponent>
                        <SpaceComponent width={48} />
                        <ColumnComponent className="w-full" alignItems="flex-start">
                            <TitleComponent title="Editable by" className="mb-2" />
                            <SelectComponent
                                style={{
                                    borderRadius: '0px'
                                }}
                                width="100%"
                                options={[
                                    {
                                        label: 'Only me',
                                        value: 'owner'
                                    },
                                    {
                                        label: 'Everyone with password',
                                        value: 'everyone'
                                    }
                                ]}
                                optionStyle={{
                                    borderRadius: '0px'
                                }}
                                onChange={(value) => {
                                    setEditableBy(value as 'everyone' | 'owner');
                                }}
                                value={editableBy}
                            />
                            <TextComponent
                                fontSize="1.2em"
                                className="mt-2"
                                text={
                                    editableBy === 'everyone'
                                        ? 'Anyone can edit with password'
                                        : 'Only you can edit'
                                }
                            />
                        </ColumnComponent>
                    </RowComponent>
                    {editableBy === 'everyone' && (
                        <InputComponent
                            placeholder="Enter a password"
                            type="password"
                            style={{
                                borderRadius: '0px'
                            }}
                            borderType="bottom"
                            label={'Password'}
                            value={editableByPublicPass}
                            onChange={(value) => {
                                setEditableByPublicPass(value);
                            }}
                            animationType="slideInLeft"
                        />
                    )}
                </ColumnComponent>
            </ModalComponent>
            <TitleComponent
                title={wordSetQuery.data?.WordSet.name}
                className="mb-8"
                fontSize="3em"
            />
            <RowComponent className="relative">
                <Carousel
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
                                    timeAgo(wordSetQuery.data?.WordSet.createAt.seconds || 0 * 1000)
                                }
                                fontSize="1.3em"
                            />
                        </ColumnComponent>
                    </RowComponent>
                    <SpaceComponent height={16} />
                    <RowComponent>
                        <TextComponent text={'Belong to folder: '} fontSize="1.3em" />
                        <SpaceComponent width={8} />
                        <LinkComponent
                            onClick={() => {
                                navigate(`/user/${user.userId}/folders/${folder.folderId}`);
                            }}>
                            <TitleComponent title={folder.name} fontSize="1.5em" />
                        </LinkComponent>
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
                        style={{
                            height: '40px',
                            paddingLeft: '16px',
                            paddingRight: '16px'
                        }}
                        tooltip="Export"
                        icon={<Import size={20} />}
                        onClick={() => {
                            setModalExportOpen(true);
                        }}
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
                        tooltip="Edit word set"
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
                            setModalSettingOpen(true);
                        }}
                        tooltip="Setting"
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
                            className="h-full relative min-h-[124px]
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
                                    <ColumnComponent alignItems="flex-start" className="pr-8">
                                        <TextComponent
                                            text={word.meaning.replace(/\\n/g, '\n')}
                                            fontSize="1.6em"
                                            style={{
                                                whiteSpace: 'pre-wrap'
                                            }}
                                        />
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
                            <ColumnComponent
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16
                                }}>
                                <ButtonComponent
                                    onClick={async (e) => {
                                        e.preventDefault();

                                        const synth = window.speechSynthesis;
                                        console.log(synth.getVoices());
                                        const utterThis = new SpeechSynthesisUtterance(word.name);
                                        synth.speak(utterThis);
                                    }}
                                    style={{
                                        padding: '8px'
                                    }}
                                    backgroundColor="transparent"
                                    backgroundHoverColor="var(--bg-hover-color)"
                                    backgroundActiveColor="var(--bg-active-color)">
                                    <VolumeHigh
                                        size={20}
                                        className="
                                    "
                                    />
                                </ButtonComponent>
                                <ButtonComponent
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        await updateWord(
                                            word.wordId ?? '',
                                            undefined,
                                            undefined,
                                            undefined,
                                            undefined,
                                            !word.learned
                                        );
                                        wordSetQuery.refetch();
                                    }}
                                    style={{
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
                            </ColumnComponent>
                        </CardComponent>
                    </GridCol>
                ))}
            </GridRow>
            <SpaceComponent height={48} />
            <RowComponent>
                <ButtonComponent
                    style={{
                        paddingLeft: '26px',
                        paddingRight: '26px',
                        paddingBottom: '10px',
                        paddingTop: '10px',
                        width: 'fit-content',
                        fontSize: '1.4em',
                        fontWeight: '500'
                    }}
                    text="Add or edit word"
                    onClick={() => {
                        handleEditWordSet();
                    }}
                    backgroundColor="var(--bg-color)"
                    backgroundHoverColor="var(--bg-hover-color)"
                    backgroundActiveColor="var(--bg-active-color)"
                    isBorder={true}
                    icon={<Edit2 size={20} />}
                    textColor="var(--secondary-text-color)"
                />
            </RowComponent>
            <SpaceComponent height={64} />
        </div>
    );
}

export default WordLearnLayout;
