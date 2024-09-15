import { useQuery } from '@tanstack/react-query';
import NotFoundUser from '../../assets/image/no_avatar.png';
import CardComponent from '../../components/Card/CardComponent';
import ColumnComponent from '../../components/commonComponent/Column/ColumnComponent';
import RowComponent from '../../components/commonComponent/Row/RowComponent';
import TextComponent from '../../components/commonComponent/Text/TextComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import { getRencentlyWordSet } from '../../firebase/userAPI';

import { ArrowLeft2, ArrowRight2, Star } from 'iconsax-react';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import {
    getPopularWordSets,
    onSnapshotWordSets,
    updateWordSetStarCount
} from '../../firebase/wordSetAPI';
import { useAuth } from '../../hooks/useAuth';
import { UserType } from '../../types/UserType';
import { WordSetType } from '../../types/WordSetType';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import { useEffect } from 'react';
import { Unsubscribe } from 'firebase/auth';

function HomeLayout() {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const { lg } = useResponsive();

    const recentWordSetsQuery = useQuery({
        queryKey: ['recentWordSets'],
        queryFn: async () => {
            const response = (await getRencentlyWordSet()) as Array<{
                wordSetList: WordSetType;
                userList: UserType;
            }>;
            return response;
        },
        refetchOnWindowFocus: false
    });

    // snapshot
    useEffect(() => {
        let unsubscribe: Unsubscribe;
        if (currentUser) {
            unsubscribe = onSnapshotWordSets(undefined, () => {
                console.log('wordset updated');
                popularWordSetsQuery.refetch();
                recentWordSetsQuery.refetch();
            });
        }
        return () => {
            unsubscribe?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const popularWordSetsQuery = useQuery({
        queryKey: ['popularWordSets'],
        queryFn: async () => {
            const response = (await getPopularWordSets()) as Array<{
                wordSetList: WordSetType;
                userList: UserType;
            }>;
            return response;
        },
        refetchOnWindowFocus: false
    });

    return (
        <ColumnComponent
            justifyContent="flex-start"
            className="
            w-full h-full 
            max-w-[1280px] m-auto 
            px-4
        ">
            <RowComponent justifyContent="flex-start" className="w-full">
                <TitleComponent
                    title="RECENT WORD SETS"
                    fontSize="2em"
                    fontWeight={600}
                    className="ml-4"
                />
            </RowComponent>
            <div className="relative w-full">
                <div
                    id="recentWordSets"
                    className="
                flex flex-row justify-start overflow-x-auto 
                w-full no-scrollbar scroll-smooth
            ">
                    {recentWordSetsQuery.isLoading && (
                        <div
                            className="w-full py-2 h-full px-1 flex-nowrap 
                        flex-row flex
                    ">
                            {Array.from({ length: 5 }).map(() => (
                                <div key={'loading'} className="mr-4">
                                    <CardComponent
                                        className="animate-pulse"
                                        style={{
                                            minWidth: '400px',
                                            height: '100%'
                                        }}
                                        haveFloatingButton={false}
                                        key={'loading'}
                                        hoverable={true}
                                        onClick={() => {}}>
                                        <div
                                            className="
                            h-full
                            w-full
                            flex flex-col
                            justify-between
                        ">
                                            <RowComponent
                                                alignItems="center"
                                                justifyContent="space-between"
                                                className="mb-2 h-full w-full">
                                                <RowComponent
                                                    justifyContent="space-between"
                                                    className="w-full">
                                                    <div className="flex">
                                                        <TitleComponent
                                                            title={'loading...'}
                                                            fontSize="2em"
                                                            fontWeight={600}
                                                            className="mr-3"
                                                        />

                                                        <div
                                                            className={`
                                            rounded-full
                                        bg-primary
                                        px-2
                                        py-[1px]
                                        flex items-center
                                        border-[1px] border-primary
                                        `}>
                                                            <TextComponent
                                                                text={'public'}
                                                                fontSize="1.2em"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="
                            bg-primary
                            rounded-full
                            p-2
                            "
                                                        style={{}}>
                                                        <div className="relative">
                                                            <ButtonComponent
                                                                style={{
                                                                    height: '24px',
                                                                    paddingLeft: '8px',
                                                                    paddingRight: '8px',
                                                                    marginRight: '-8px',
                                                                    borderRadius: '50%'
                                                                }}
                                                                icon={
                                                                    <Star
                                                                        size={24}
                                                                        variant="Bold"
                                                                        className="text-textLight dark:text-textDark
                                                                hover:text-textLight-hover
                                                                "
                                                                    />
                                                                }
                                                                onClick={() => {}}
                                                                backgroundColor="transparent"
                                                                backgroundHoverColor="transparent"
                                                                backgroundActiveColor="transparent"
                                                                textColor="var(--secondary-text-color)"
                                                            />
                                                            <div>
                                                                <TextComponent
                                                                    text={`${Math.floor(
                                                                        Math.random() * 50
                                                                    )}`}
                                                                    className="absolute top-0 -right-2"
                                                                    textColor="var(--text-color)"
                                                                    fontSize="1.2em"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </RowComponent>
                                            </RowComponent>
                                            <RowComponent alignItems="flex-end">
                                                <ColumnComponent
                                                    justifyContent="space-between"
                                                    alignItems="flex-start"
                                                    className="w-full">
                                                    <TitleComponent
                                                        title={`${Math.floor(
                                                            Math.random() * 50
                                                        )} words`}
                                                        fontSize="1.2em"
                                                    />
                                                    <TextComponent
                                                        text={new Date().toDateString()}
                                                        fontSize="1.2em"
                                                    />
                                                </ColumnComponent>
                                            </RowComponent>
                                            <RowComponent
                                                alignItems="center"
                                                justifyContent="flex-end"
                                                className="mt-0">
                                                <ColumnComponent
                                                    alignItems="flex-end"
                                                    justifyContent="center">
                                                    <TitleComponent
                                                        title={'Unknown user'}
                                                        fontSize="1.2em"
                                                    />
                                                    <SpaceComponent height={0} />
                                                    <TextComponent text={'...'} fontSize="1.1em" />
                                                </ColumnComponent>
                                                <SpaceComponent width={16} />
                                                <img
                                                    src={NotFoundUser}
                                                    alt="avatar"
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%'
                                                    }}
                                                />
                                            </RowComponent>
                                        </div>
                                    </CardComponent>
                                </div>
                            ))}
                        </div>
                    )}
                    {recentWordSetsQuery.isSuccess && (
                        <div
                            className="w-full py-2 h-full px-1 flex-nowrap 
                        flex-row flex 
                    ">
                            {recentWordSetsQuery.data?.map((item) => (
                                <div key={item.wordSetList.wordsetId} className="mr-3">
                                    <CardComponent
                                        className=""
                                        style={{
                                            minWidth: '400px',
                                            height: '100%'
                                        }}
                                        haveFloatingButton={false}
                                        key={item.wordSetList.wordsetId}
                                        hoverable={true}
                                        onClick={() => {
                                            if (typeof item.wordSetList.folderRef === 'string')
                                                return;
                                            navigate(
                                                `/user/${item.userList.userId}/folders/${item.wordSetList.folderRef.id}/wordset/${item.wordSetList.wordsetId}`
                                            );
                                        }}>
                                        <div
                                            className="
                            h-full
                            w-full
                            flex flex-col
                            justify-between
                        ">
                                            <RowComponent
                                                alignItems="center"
                                                justifyContent="space-between"
                                                className="mb-2 h-full w-full">
                                                <RowComponent
                                                    justifyContent="space-between"
                                                    className="w-full">
                                                    <div className="flex">
                                                        <TitleComponent
                                                            title={item.wordSetList.name ?? ''}
                                                            fontSize="2em"
                                                            fontWeight={600}
                                                            className="mr-3"
                                                        />

                                                        <div
                                                            className={`
                                            rounded-full
                                        bg-primary
                                        px-2
                                        py-[1px]
                                        flex items-center
                                        border-[1px] border-primary
                                        `}>
                                                            <TextComponent
                                                                text={item.wordSetList.visibility}
                                                                fontSize="1.2em"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="
                            bg-primary
                            rounded-full
                            p-2
                            "
                                                        style={{}}>
                                                        <div className="relative">
                                                            <ButtonComponent
                                                                style={{
                                                                    height: '24px',
                                                                    paddingLeft: '8px',
                                                                    paddingRight: '8px',
                                                                    marginRight: '-8px',
                                                                    borderRadius: '50%'
                                                                }}
                                                                icon={
                                                                    item.wordSetList.star?.find(
                                                                        (i) =>
                                                                            i.id ===
                                                                            currentUser?.uid
                                                                    ) ? (
                                                                        <Star
                                                                            size={24}
                                                                            variant="Bold"
                                                                            className="text-textLight dark:text-textDark
                                                                hover:text-textLight-hover
                                                                "
                                                                        />
                                                                    ) : (
                                                                        <Star
                                                                            size={24}
                                                                            className="text-textLight dark:text-textDark
                                                                hover:text-textLight-hover
                                                                "
                                                                        />
                                                                    )
                                                                }
                                                                onClick={(e: React.MouseEvent) => {
                                                                    e.stopPropagation();
                                                                    updateWordSetStarCount(
                                                                        item.wordSetList
                                                                            .wordsetId ?? ''
                                                                    );
                                                                    // setStaredWordSet(!staredWordSet);
                                                                    // setStarCount(
                                                                    //     staredWordSet
                                                                    //         ? starCount - 1
                                                                    //         : starCount + 1
                                                                    // );
                                                                }}
                                                                backgroundColor="transparent"
                                                                backgroundHoverColor="transparent"
                                                                backgroundActiveColor="transparent"
                                                                textColor="var(--secondary-text-color)"
                                                            />
                                                            <div>
                                                                <TextComponent
                                                                    text={
                                                                        item.wordSetList.star
                                                                            ?.length
                                                                    }
                                                                    className="absolute top-0 -right-2"
                                                                    textColor="var(--text-color)"
                                                                    fontSize="1.2em"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </RowComponent>
                                            </RowComponent>
                                            <RowComponent alignItems="flex-end">
                                                <ColumnComponent
                                                    justifyContent="space-between"
                                                    alignItems="flex-start"
                                                    className="w-full">
                                                    <TitleComponent
                                                        title={`${item.wordSetList.words?.length} words`}
                                                        fontSize="1.2em"
                                                    />
                                                    <TextComponent
                                                        text={item.wordSetList.createAt
                                                            ?.toDate()
                                                            .toDateString()}
                                                        fontSize="1.2em"
                                                    />
                                                </ColumnComponent>
                                            </RowComponent>
                                            <RowComponent
                                                alignItems="center"
                                                justifyContent="flex-end"
                                                className="mt-0">
                                                <ColumnComponent
                                                    alignItems="flex-end"
                                                    justifyContent="center">
                                                    <TitleComponent
                                                        title={item.userList.name || 'Unknown user'}
                                                        fontSize="1.2em"
                                                    />
                                                    <SpaceComponent height={0} />
                                                    <TextComponent
                                                        text={item.userList.email || '...'}
                                                        fontSize="1.1em"
                                                    />
                                                </ColumnComponent>
                                                <SpaceComponent width={16} />
                                                <img
                                                    src={item.userList.photoURL || NotFoundUser}
                                                    alt="avatar"
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={(e: React.MouseEvent) => {
                                                        e.stopPropagation();

                                                        navigate(
                                                            `/user/${item.userList.userId}/folders`
                                                        );
                                                    }}
                                                />
                                            </RowComponent>
                                        </div>
                                    </CardComponent>
                                </div>
                            ))}
                            {lg && (
                                <>
                                    <ButtonComponent
                                        backgroundColor="transparent"
                                        backgroundHoverColor="var(--bg-hover-color)"
                                        backgroundActiveColor="var(--bg-active-color)"
                                        style={{
                                            padding: '4px',
                                            borderRadius: '50%'
                                        }}
                                        onClick={() => {
                                            const element =
                                                document.getElementById('recentWordSets');
                                            if (element) {
                                                element.scrollLeft -= 400;
                                            }
                                        }}
                                        className="absolute -left-14 cursor-pointer top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                                        <ArrowRight2
                                            size={36}
                                            className="
                                text-textLight dark:text-textDark
                                transform rotate-180
                            "
                                        />
                                    </ButtonComponent>
                                    <ButtonComponent
                                        backgroundColor="transparent"
                                        backgroundHoverColor="var(--bg-hover-color)"
                                        backgroundActiveColor="var(--bg-active-color)"
                                        style={{
                                            padding: '4px',
                                            borderRadius: '50%'
                                        }}
                                        onClick={() => {
                                            const element =
                                                document.getElementById('recentWordSets');
                                            if (element) {
                                                element.scrollLeft += 400;
                                            }
                                        }}
                                        className="absolute -right-14 cursor-pointer top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                                        <ArrowLeft2
                                            size={36}
                                            className="
                                text-textLight dark:text-textDark
                                transform rotate-180
                            "
                                        />
                                    </ButtonComponent>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* // ------------------------------------------------------------------- */}

            <RowComponent justifyContent="flex-start" className="w-full mt-8">
                <TitleComponent
                    title="POPULAR WORD SETS"
                    fontSize="2em"
                    fontWeight={600}
                    className="ml-4"
                />
            </RowComponent>
            <div className="relative w-full">
                <div
                    id="popularWordSets"
                    className="
                flex flex-row justify-start overflow-x-auto 
                w-full no-scrollbar scroll-smooth
            ">
                    {popularWordSetsQuery.isLoading && (
                        <div
                            className="w-full py-2 h-full px-1 flex-nowrap 
                        flex-row flex
                    ">
                            {Array.from({ length: 5 }).map(() => (
                                <div className="mr-4">
                                    <CardComponent
                                        className="animate-pulse"
                                        style={{
                                            minWidth: '400px',
                                            height: '100%'
                                        }}
                                        haveFloatingButton={false}
                                        hoverable={true}
                                        onClick={() => {}}>
                                        <div
                                            className="
                            h-full
                            w-full
                            flex flex-col
                            justify-between
                        ">
                                            <RowComponent
                                                alignItems="center"
                                                justifyContent="space-between"
                                                className="mb-2 h-full w-full">
                                                <RowComponent
                                                    justifyContent="space-between"
                                                    className="w-full">
                                                    <div className="flex">
                                                        <TitleComponent
                                                            title={'loading...'}
                                                            fontSize="2em"
                                                            fontWeight={600}
                                                            className="mr-3"
                                                        />

                                                        <div
                                                            className={`
                                            rounded-full
                                        bg-primary
                                        px-2
                                        py-[1px]
                                        flex items-center
                                        border-[1px] border-primary
                                        `}>
                                                            <TextComponent
                                                                text={'public'}
                                                                fontSize="1.2em"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="
                            bg-primary
                            rounded-full
                            p-2
                            "
                                                        style={{}}>
                                                        <div className="relative">
                                                            <ButtonComponent
                                                                style={{
                                                                    height: '24px',
                                                                    paddingLeft: '8px',
                                                                    paddingRight: '8px',
                                                                    marginRight: '-8px',
                                                                    borderRadius: '50%'
                                                                }}
                                                                icon={
                                                                    <Star
                                                                        size={24}
                                                                        variant="Bold"
                                                                        className="text-textLight dark:text-textDark
                                                                hover:text-textLight-hover
                                                                "
                                                                    />
                                                                }
                                                                onClick={() => {}}
                                                                backgroundColor="transparent"
                                                                backgroundHoverColor="transparent"
                                                                backgroundActiveColor="transparent"
                                                                textColor="var(--secondary-text-color)"
                                                            />
                                                            <div>
                                                                <TextComponent
                                                                    text={`${Math.floor(
                                                                        Math.random() * 50
                                                                    )}`}
                                                                    className="absolute top-0 -right-2"
                                                                    textColor="var(--text-color)"
                                                                    fontSize="1.2em"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </RowComponent>
                                            </RowComponent>
                                            <RowComponent alignItems="flex-end">
                                                <ColumnComponent
                                                    justifyContent="space-between"
                                                    alignItems="flex-start"
                                                    className="w-full">
                                                    <TitleComponent
                                                        title={`${Math.floor(
                                                            Math.random() * 50
                                                        )} words`}
                                                        fontSize="1.2em"
                                                    />
                                                    <TextComponent
                                                        text={new Date().toDateString()}
                                                        fontSize="1.2em"
                                                    />
                                                </ColumnComponent>
                                            </RowComponent>
                                            <RowComponent
                                                alignItems="center"
                                                justifyContent="flex-end"
                                                className="mt-0">
                                                <ColumnComponent
                                                    alignItems="flex-end"
                                                    justifyContent="center">
                                                    <TitleComponent
                                                        title={'Unknown user'}
                                                        fontSize="1.2em"
                                                    />
                                                    <SpaceComponent height={0} />
                                                    <TextComponent text={'...'} fontSize="1.1em" />
                                                </ColumnComponent>
                                                <SpaceComponent width={16} />
                                                <img
                                                    src={NotFoundUser}
                                                    alt="avatar"
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%'
                                                    }}
                                                />
                                            </RowComponent>
                                        </div>
                                    </CardComponent>
                                </div>
                            ))}
                        </div>
                    )}
                    {popularWordSetsQuery.isSuccess && (
                        <div
                            className="w-full py-2 h-full px-1 flex-nowrap 
                        flex-row flex 
                    ">
                            {popularWordSetsQuery.data?.map((item) => (
                                <div key={item.wordSetList.wordsetId} className="mr-3">
                                    <CardComponent
                                        className=""
                                        style={{
                                            minWidth: '400px',
                                            height: '100%'
                                        }}
                                        haveFloatingButton={false}
                                        key={item.wordSetList.wordsetId}
                                        hoverable={true}
                                        onClick={() => {
                                            if (typeof item.wordSetList.folderRef === 'string')
                                                return;
                                            navigate(
                                                `/user/${item.userList.userId}/folders/${item.wordSetList.folderRef.id}/wordset/${item.wordSetList.wordsetId}`
                                            );
                                        }}>
                                        <div
                                            className="
                            h-full
                            w-full
                            flex flex-col
                            justify-between
                        ">
                                            <RowComponent
                                                alignItems="center"
                                                justifyContent="space-between"
                                                className="mb-2 h-full w-full">
                                                <RowComponent
                                                    justifyContent="space-between"
                                                    className="w-full">
                                                    <div className="flex">
                                                        <TitleComponent
                                                            title={item.wordSetList.name ?? ''}
                                                            fontSize="2em"
                                                            fontWeight={600}
                                                            className="mr-3"
                                                        />

                                                        <div
                                                            className={`
                                            rounded-full
                                        bg-primary
                                        px-2
                                        py-[1px]
                                        flex items-center
                                        border-[1px] border-primary
                                        `}>
                                                            <TextComponent
                                                                text={item.wordSetList.visibility}
                                                                fontSize="1.2em"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="
                            bg-primary
                            rounded-full
                            p-2
                            "
                                                        style={{}}>
                                                        <div className="relative">
                                                            <ButtonComponent
                                                                style={{
                                                                    height: '24px',
                                                                    paddingLeft: '8px',
                                                                    paddingRight: '8px',
                                                                    marginRight: '-8px',
                                                                    borderRadius: '50%'
                                                                }}
                                                                icon={
                                                                    item.wordSetList.star?.find(
                                                                        (i) =>
                                                                            i.id ===
                                                                            currentUser?.uid
                                                                    ) ? (
                                                                        <Star
                                                                            size={24}
                                                                            variant="Bold"
                                                                            className="text-textLight dark:text-textDark
                                                                hover:text-textLight-hover
                                                                "
                                                                        />
                                                                    ) : (
                                                                        <Star
                                                                            size={24}
                                                                            className="text-textLight dark:text-textDark
                                                                hover:text-textLight-hover
                                                                "
                                                                        />
                                                                    )
                                                                }
                                                                onClick={(e: React.MouseEvent) => {
                                                                    e.stopPropagation();
                                                                    updateWordSetStarCount(
                                                                        item.wordSetList
                                                                            .wordsetId ?? ''
                                                                    );
                                                                    // setStaredWordSet(!staredWordSet);
                                                                    // setStarCount(
                                                                    //     staredWordSet
                                                                    //         ? starCount - 1
                                                                    //         : starCount + 1
                                                                    // );
                                                                }}
                                                                backgroundColor="transparent"
                                                                backgroundHoverColor="transparent"
                                                                backgroundActiveColor="transparent"
                                                                textColor="var(--secondary-text-color)"
                                                            />
                                                            <div>
                                                                <TextComponent
                                                                    text={
                                                                        item.wordSetList.star
                                                                            ?.length
                                                                    }
                                                                    className="absolute top-0 -right-2"
                                                                    textColor="var(--text-color)"
                                                                    fontSize="1.2em"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </RowComponent>
                                            </RowComponent>
                                            <RowComponent alignItems="flex-end">
                                                <ColumnComponent
                                                    justifyContent="space-between"
                                                    alignItems="flex-start"
                                                    className="w-full">
                                                    <TitleComponent
                                                        title={`${item.wordSetList.words?.length} words`}
                                                        fontSize="1.2em"
                                                    />
                                                    <TextComponent
                                                        text={item.wordSetList.createAt
                                                            ?.toDate()
                                                            .toDateString()}
                                                        fontSize="1.2em"
                                                    />
                                                </ColumnComponent>
                                            </RowComponent>
                                            <RowComponent
                                                alignItems="center"
                                                justifyContent="flex-end"
                                                className="mt-0">
                                                <ColumnComponent
                                                    alignItems="flex-end"
                                                    justifyContent="center">
                                                    <TitleComponent
                                                        title={item.userList.name || 'Unknown user'}
                                                        fontSize="1.2em"
                                                    />
                                                    <SpaceComponent height={0} />
                                                    <TextComponent
                                                        text={item.userList.email || '...'}
                                                        fontSize="1.1em"
                                                    />
                                                </ColumnComponent>
                                                <SpaceComponent width={16} />
                                                <img
                                                    src={item.userList.photoURL || NotFoundUser}
                                                    alt="avatar"
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%'
                                                    }}
                                                    onClick={(e: React.MouseEvent) => {
                                                        e.stopPropagation();

                                                        navigate(
                                                            `/user/${item.userList.userId}/folders`
                                                        );
                                                    }}
                                                />
                                            </RowComponent>
                                        </div>
                                    </CardComponent>
                                </div>
                            ))}
                            {lg && (
                                <>
                                    <ButtonComponent
                                        backgroundColor="transparent"
                                        backgroundHoverColor="var(--bg-hover-color)"
                                        backgroundActiveColor="var(--bg-active-color)"
                                        style={{
                                            padding: '4px',
                                            borderRadius: '50%'
                                        }}
                                        onClick={() => {
                                            const element =
                                                document.getElementById('popularWordSets');
                                            if (element) {
                                                element.scrollLeft -= 400;
                                            }
                                        }}
                                        className="absolute -left-14 cursor-pointer top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                                        <ArrowRight2
                                            size={36}
                                            className="
                                text-textLight dark:text-textDark
                                transform rotate-180
                            "
                                        />
                                    </ButtonComponent>
                                    <ButtonComponent
                                        backgroundColor="transparent"
                                        backgroundHoverColor="var(--bg-hover-color)"
                                        backgroundActiveColor="var(--bg-active-color)"
                                        style={{
                                            padding: '4px',
                                            borderRadius: '50%'
                                        }}
                                        onClick={() => {
                                            const element =
                                                document.getElementById('popularWordSets');
                                            if (element) {
                                                element.scrollLeft += 400;
                                            }
                                        }}
                                        className="absolute -right-14 cursor-pointer top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                                        <ArrowLeft2
                                            size={36}
                                            className="
                                text-textLight dark:text-textDark
                                transform rotate-180
                            "
                                        />
                                    </ButtonComponent>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ColumnComponent>
    );
}

export default HomeLayout;
