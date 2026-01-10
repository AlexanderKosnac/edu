function splitCamelCase(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .split(" ");
}

const LOWERCASE_WORDS = new Set(["and", "or", "but", "of", "in", "on", "for", "to", "with", "by", "at", "from"]);

export function camelCaseToTitle(str) {
    const words = splitCamelCase(str);

    return words
        .map((word, index) => {
            const lower = word.toLowerCase();

            if (index !== 0 && LOWERCASE_WORDS.has(lower)) {
                return lower;
            }

            return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join(" ");
}

export function camelCaseToSentence(str) {
    const words = splitCamelCase(str).map(w => w.toLowerCase());

    if (words.length === 0) return "";

    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

    return words.join(" ");
}
