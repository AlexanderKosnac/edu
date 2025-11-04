export let hexHttpRequest = `50 4f 53 54 20 2f 73 75 62 6d 69 74 20 48 54 54 50 2f 31 2e 31 0d 0a 48 6f 73 74 3a 20 65 78 61 6d 70 6c 65 2e 63 6f 6d 0d 0a 55 73 65 72 2d 41 67 65 6e 74 3a 20 63 75 72 6c 2f 37 2e 36 35 2e 30 0d 0a 43 6f 6e 74 65 6e 74 2d 54 79 70 65 3a 20 61 70 70 6c 69 63 61 74 69 6f 6e 2f 78 2d 77 77 77 2d 66 6f 72 6d 2d 75 72 6c 65 6e 63 6f 64 65 64 0d 0a 43 6f 6e 74 65 6e 74 2d 4c 65 6e 67 74 68 3a 20 31 33 0d 0a 0d 0a 66 69 65 6c 64 31 3d 74 65 73 74 26 66 69 65 6c 64 32 3d 31 32 33`;

export const ByteType = Object.freeze({
    INT8: "int8",
    UINT8: "uint8",
    INT16_LE: "int16",
    INT16_BE: "int16 (big-endian)",
    UINT16_LE: "uint16",
    UINT16_BE: "uint16 (big-endian)",
    INT32_LE: "int32",
    INT32_BE: "int32 (big-endian)",
    UINT32_LE: "uint32",
    UINT32_BE: "uint32 (big-endian)",
    INT64_LE: "int64",
    INT64_BE: "int64 (big-endian)",
    UINT64_LE: "uint64",
    UINT64_BE: "uint64 (big-endian)",
    FLOAT32_LE: "float32",
    FLOAT32_BE: "float32 (big-endian)",
    FLOAT64_LE: "float64",
    FLOAT64_BE: "float64 (big-endian)",
    ASCII: "ASCII",
});
