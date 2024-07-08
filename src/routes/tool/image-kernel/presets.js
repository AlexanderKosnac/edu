export let presets = [
    {
        label: "Identity",
        matrix: [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0],
        ]
    },
    {
        label: "Edge detection 1",
        matrix: [
            [ 0, -1,  0],
            [-1,  4, -1],
            [ 0, -1,  0],
        ]
    },
    {
        label: "Edge detection 2",
        matrix: [
            [-1, -1, -1],
            [-1,  8, -1],
            [-1, -1, -1],
        ]
    },
    {
        label: "Box blur",
        factor: 1/9,
        factorDisplay: "1/9",
        matrix: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ]
    },
    {
        label: "Gaussian blur (3x3)",
        factor: 1/16,
        factorDisplay: "1/16",
        matrix: [
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1],
        ]
    },
    {
        label: "Gaussian blur (5x5)",
        factor: 1/256,
        factorDisplay: "1/256",
        matrix: [
            [1,  4,  6,  4, 1],
            [4, 16, 24, 16, 4],
            [6, 24, 36, 24, 6],
            [4, 16, 24, 16, 4],
            [1,  4,  6,  4, 1],
        ]
    },
    {
        label: "Sobel X",
        matrix: [
            [ 1,  2,  1],
            [ 0,  0,  0],
            [-1, -2, -1],
        ]
    },
    {
        label: "Sobel Y",
        matrix: [
            [1, 0, -1],
            [2, 0, -2],
            [1, 0, -1],
        ]
    },
];