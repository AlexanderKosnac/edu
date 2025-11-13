export function charIsIgnored(c) {
    const n = c.charCodeAt(0);
    const isLetter = (n >= 0x41 && n <= 0x5A) || (n >= 0x61 && n <= 0x7A);
    return !isLetter;
}

export function letterAsInteger(l) {
    return l.charCodeAt(0) + 0x41;
}

export function integerAsLetter(i) {
    return String.fromCharCode((i % 26) + 0x41);
}

export function encodePlaintext(plaintext, shift) {
    let ciphertext = "";
    for (const c of plaintext.toUpperCase()) {
        ciphertext += charIsIgnored(c) ? c : integerAsLetter(letterAsInteger(c) + shift);
    }
    return ciphertext;
}

export function decodeCiphertext(ciphertext, shift) {
    let plaintext = "";
    for (const c of ciphertext.toUpperCase()) {
        plaintext += charIsIgnored(c) ? c : integerAsLetter(letterAsInteger(c) - shift);
    }
    return plaintext;
}
