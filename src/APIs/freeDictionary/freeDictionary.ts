export const getWordDefinition = async (word: string) => {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    if (data.message) {
        return null;
    }
    return data;
}