export function hexStringToByteArray(hexString) {
    if (hexString.length % 2 !== 0) {
        hexString += "0";
    }

    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }

    return byteArray;
}

export function bytesToHexString(bytes) {
    return Array.from(bytes).map(b => toHex(b)).join(" ");
}

export function toHex(n, length = 2) {
    return n.toString(16).toUpperCase().padStart(length, "0");
}