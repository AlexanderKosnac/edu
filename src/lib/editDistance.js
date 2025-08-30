export function jaroDistance(s1, s2) {
    if (!s1.length && !s2.length)
        return 1;
    if (!s1.length || !s2.length)
        return 0;

    const [len1, len2] = [s1.length, s2.length];
    const win = Math.floor(Math.max(len1, len2) / 2) - 1;
    const m1 = [], m2 = [];
    const s2used = Array(len2).fill(false);

    for (let i = 0; i < len1; i++) {
        const wstart = Math.max(0, i - win);
        const wend = Math.min(len2, i + win + 1);
        for (let j = wstart; j < wend; j++) {
            if (!s2used[j] && s1[i] === s2[j]) {
                m1.push(s1[i]);
                m2.push(s2[j]);
                s2used[j] = true;
                break;
            }
        }
    }
    const m = m1.length;
    if (m === 0)
        return 0;

    let t = 0;
    for (let k = 0; k < m; k++) if (m1[k] !== m2[k]) t++;
    t = Math.floor(t / 2);

    return (m / len1 + m / len2 + (m - t) / m) / 3;
}
