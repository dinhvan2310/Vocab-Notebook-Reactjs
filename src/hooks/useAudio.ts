export const useAudio = (url: string) => {
    const audio = new Audio(url);
    const play = () => {
        audio.play();
    };
    return { play };
}