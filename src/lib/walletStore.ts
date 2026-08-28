export type Network = "solana" | "ethereum";

const PREFIX = "walletIndexes";

const hashPhrase = (phrase: string): string => {
    let hash = 0;
    for (let i = 0; i < phrase.length; i++) {
        hash = (hash * 31 + phrase.charCodeAt(i)) >>> 0;
    }
    return hash.toString(16);
};

const storageKey = (network: Network, phrase: string): string =>
    `${PREFIX}:${network}:${hashPhrase(phrase.trim().toLowerCase())}`;

export const getWalletIndexes = (
    network: Network,
    phrase: string
): number[] => {
    try {
        const raw = localStorage.getItem(storageKey(network, phrase));
        if (!raw) return [0];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [0];
        const indexes = parsed
            .map(Number)
            .filter((n: number) => Number.isInteger(n) && n >= 0);
        return indexes.length > 0 ? indexes : [0];
    } catch {
        return [0];
    }
};

export const saveWalletIndexes = (
    network: Network,
    phrase: string,
    indexes: number[]
): void => {
    const unique = [...new Set(indexes.map(Number).filter((n) => Number.isInteger(n) && n >= 0))];
    localStorage.setItem(storageKey(network, phrase), JSON.stringify(unique));
};
