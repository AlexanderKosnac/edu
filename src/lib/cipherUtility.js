export function charIsIgnored(c) {
    const n = c.charCodeAt(0);
    return !(n >= 0x41 && n <= 0x5A); // Only A-Z
}

export function letterAsInteger(l) {
    return l.charCodeAt(0) - 0x41;
}

export function integerAsLetter(i) {
    return String.fromCharCode((i % 26 + 26) % 26 + 0x41);
}

export function encodeLetter(c, shift) {
    if (charIsIgnored(c))
        return c;
    const x = letterAsInteger(c);
    const y = (x + (shift % 26) + 26) % 26;
    return integerAsLetter(y);
}

export function decodeLetter(c, shift) {
    if (charIsIgnored(c))
        return c;
    const x = letterAsInteger(c);
    const y = (x - (shift % 26) + 26) % 26;
    return integerAsLetter(y);
}

export function encodePlaintext(plaintext, shift) {
    let ciphertext = "";
    for (const c of plaintext.toUpperCase()) {
        ciphertext += encodeLetter(c, shift);
    }
    return ciphertext;
}

export function decodeCiphertext(ciphertext, shift) {
    let plaintext = "";
    for (const c of ciphertext.toUpperCase()) {
        plaintext += decodeLetter(c, shift);
    }
    return plaintext;
}
