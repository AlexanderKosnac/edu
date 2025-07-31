export function hexStringToByteArray(hexString) {
    if (hexString.length % 2 !== 0) {
        throw new Error("Invalid hex string: length must be even.");
    }

    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }

    return byteArray;
}
