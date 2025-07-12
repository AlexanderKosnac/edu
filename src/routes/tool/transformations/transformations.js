export let transformations = [
    {
        name: "Identity",
        inputs: {
        },
        base: [
            [1, 0],
            [0, 1],
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
            [0, "t"],
        ],
        getMatrix() {
            return [
                [this.inputs.s, 0],
                [0, this.inputs.t],
            ];
        },
        getResult() {
            return [
                [`${this.inputs.s}x`],
                [`${this.inputs.t}y`],
            ];
        },
    }, {
        name: "Shear X",
        inputs: {
            s: 0.1,
        },
        base: [
            [1, "s"],
            [0, 1],
        ],
        getMatrix() {
            return [
                [1, 0],
                [this.inputs.s, 1],
            ];
        },
        getResult: function() {
            return [
                [`x+${this.inputs.s}*y`],
                ["y"],
            ];
        },
    }, {
        name: "Shear Y",
        inputs: {
            s: 0.1,
        },
        base: [
            [1, 0],
            ["s", 1],
        ],
        getMatrix() {
            return [
                [1, this.inputs.s],
                [0, 1],
            ];
        },
        getResult: function() {
            return [
                ["x"],
                [`${this.inputs.s}*x+y`],
            ];
        },
    }, {
        name: "Rotation",
        inputs: {
            t: 1,
        },
        base: [
            [`cos(t)`, `-sin(t)`],
            [`sin(t)`, `cos(t)`],
        ],
        getMatrix() {
            const sin = Math.sin(this.inputs.t); 
            const cos = Math.cos(this.inputs.t);
            return [
                [cos, -sin],
                [sin,  cos],
            ];
        },
        getResult: function() {
            return [
                [`cos(${this.inputs.t})*x - sin(${this.inputs.t})*y`],
                [`sin(${this.inputs.t})*x + cos(${this.inputs.t})*y`],
            ];
        },
    }, {
        name: "Mirroring X",
        inputs: {
        },
        base: [
            [-1, 0],
            [0, 1],
        ],
        getMatrix() {
            return this.base;
        },
        getResult: function() {
            return [
                ["-x"],
                ["y"],
            ];
        },
    }, {
        name: "Mirroring Y",
        inputs: {
        },
        base: [
            [1, 0],
            [0, -1],
        ],
        getMatrix() {
            return this.base;
        },
        getResult: function() {
            return [
                ["x"],
                ["-y"],
            ];
        },
    }, {
        name: "Translation",
        isAffine: true,
        inputs: {
            dx: 1,
            dy: 1,
        },
        base: [
            [1, 0, "dx"],
            [0, 1, "dy"],
            [0, 0, 1],
        ],
        getMatrix() {
            return [
                [1, 0, this.inputs.dx],
                [0, 1, this.inputs.dy],
                [0, 0, 1],
            ];
        },
        getResult: function() {
            return [
                [`x+${this.inputs.dx}`],
                [`y+${this.inputs.dy}`],
                [1],
            ];
        },
    },
];