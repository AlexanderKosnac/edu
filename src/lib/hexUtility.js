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

export function bytesToHexString(bytes, separator = " ", options = {}) {
    return Array.from(bytes).map(b => toHex(b, 2, options)).join(separator);
}

export function toHex(n, length = 2, options = {}) {
    let hex = n.toString(16).padStart(length, "0");
    if (options.asUpperCase)
        hex = hex.toUpperCase()
    if (options.prepend0x)
        hex = `0x${hex}`;
    return hex;
}