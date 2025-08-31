export function levenshteinDistance(a, b) {
    const m = a.length;
    const n = b.length;

    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1, // deletion
                dp[i][j - 1] + 1, // insertion
                dp[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return dp[m][n];
}

export function jaroDistance(s1, s2) {
    if (s1 === s2)
        return 1.0;

    const [len1, len2] = [s1.length, s2.length];
    if (len1 === 0 || len2 === 0)
        return 0.0;

    const window = Math.floor(Math.max(len1, len2) / 2) - 1;

    let s1Matches = new Array(len1).fill(false);
    let s2Matches = new Array(len2).fill(false);

    let m = 0;
    for (let i = 0; i < len1; i++) {
        const start = Math.max(0, i - window);
        const end = Math.min(i + window + 1, len2);

        for (let j = start; j < end; j++) {
            if (s2Matches[j] || s1[i] !== s2[j])
                continue;
            s1Matches[i] = true;
            s2Matches[j] = true;
            m++;
            break;
        }
    }

    if (m === 0)
        return 0.0;

    let t = 0;
    let k = 0;
    for (let i = 0; i < len1; i++) {
        if (!s1Matches[i]) continue;
        while (!s2Matches[k]) k++;
        if (s1[i] !== s2[k]) t++;
        k++;
    }

    t = t / 2;

    return (m / len1 + m / len2 + (m - t) / m) / 3.0;
}
