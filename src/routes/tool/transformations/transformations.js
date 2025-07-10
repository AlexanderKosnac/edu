export let transformations = [
    {
        name: "Identity",
        inputs: {
        },
        base: [
            [1, 0],
            [0, 1]
        ],
        getMatrix() {
            return this.base;
        },
        getResult: function() {
            return [
                ["x"],
                ["y"],
            ];
        },
    }, {
        name: "Scaling",
        inputs: {
            s: 1,
            t: 2,
        },
        base: [
            ["s", 0],
            [0, "t"]
        ],
        getMatrix() {
            return [
                [this.inputs.s, 0],
                [0, this.inputs.t]
            ];
        },
        getResult() {
            return [
                [`${this.inputs.s}x`],
                [`${this.inputs.t}y`],
            ];
        },
    },
];