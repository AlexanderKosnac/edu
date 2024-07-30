const POINT_2D = [
    [fieldStatic("x")],
    [fieldStatic("y")],
];

const POINT_2D_AFFINE = [
    [fieldStatic("x")],
    [fieldStatic("y")],
    [fieldStatic("1")],
];

function fieldStatic(value, fnEval) {
    return {
        value: value,
        editable: false,
        displayPrefix: undefined,
        displaySuffix: undefined,
        fnEval: fnEval,
    }
}
function field(value, editable, displayPrefix, displaySuffix, fnEval) {
    return {
        value: value,
        editable: editable,
        displayPrefix: displayPrefix,
        displaySuffix: displaySuffix,
        fnEval: fnEval ?? val,
    }
}

function val() {
    return parseFloat(this.value);
}

function asCos() {
    return Math.cos(parseFloat(this.value));
}

function asSin() {
    return Math.sin(parseFloat(this.value));
}

function asNegSin() {
    return -Math.sin(parseFloat(this.value));
}

export let transformations = [
    {
        name: "Identity",
        point: POINT_2D,
        inputs: [
            [
                field(1, false),
                field(0, false),
            ], [
                field(0, false),
                field(1, false),
            ]
        ],
        getResult: function() {
            return [
                [fieldStatic("x")],
                [fieldStatic("y")],
            ];
        },
    }, {
        name: "Scaling",
        point: POINT_2D,
        inputs: [
            [
                field("s", true),
                field(0, false),
            ], [
                field(0, false),
                field("t", true),
            ]
        ],
        getResult: function() {
            return [
                [fieldStatic(`${this.inputs[0][0].value}*x`)],
                [fieldStatic(`${this.inputs[1][1].value}*y`)],
            ];
        },
    }, {
        name: "Shear X",
        point: POINT_2D,
        inputs: [
            [
                field(1, false),
                field("s", true),
            ], [
                field(0, false),
                field(1, false),
            ]
        ],
        getResult: function() {
            return [
                [fieldStatic(`x+${this.inputs[0][1].value}*y`)],
                [fieldStatic("y")],
            ];
        },
    }, {
        name: "Shear Y",
        point: POINT_2D,
        inputs: [
            [
                field(1, false),
                field(0, false),
            ], [
                field("s", true),
                field(1, false),
            ]
        ],
        getResult: function() {
            return [
                [fieldStatic("x")],
                [fieldStatic(`${this.inputs[0][1].value}*x+y`)],
            ];
        },
    }, {
        name: "Rotation",
        point: POINT_2D,
        inputs: [
            [
                field("t", true, "cos(", ")", asCos),
                field("t", true, "-sin(", ")", asNegSin),
            ], [
                field("t", true, "sin(", ")", asSin),
                field("t", true, "cos(", ")", asCos),
            ]
        ],
        getResult: function() {
            return [
                [fieldStatic(`cos(${this.inputs[0][0].value})*x - sin(${this.inputs[0][1].value})*y`)],
                [fieldStatic(`sin(${this.inputs[1][0].value})*x + cos(${this.inputs[1][1].value})*y`)],
            ];
        },
    }, {
        name: "Mirroring X",
        point: POINT_2D,
        inputs: [
            [
                field(-1, false),
                field(0, false),
            ], [
                field(0, false),
                field(1, false),
            ]
        ],
        getResult: function() {
            return [
                [fieldStatic("-x")],
                [fieldStatic("y")],
            ];
        },
    }, {
        name: "Mirroring Y",
        point: POINT_2D,
        inputs: [
            [
                field(1, false),
                field(0, false),
            ], [
                field(0, false),
                field(-1, false),
            ]
        ],
        getResult: function() {
            return [
                [fieldStatic("-x")],
                [fieldStatic("y")],
            ];
        },
    }, {
        name: "Translation",
        point: POINT_2D_AFFINE,
        isAffine: true,
        inputs: [
            [
                field(1, false),
                field(0, false),
                field("dx", true),
            ], [
                field(0, false),
                field(1, false),
                field("dy", true),
            ], [
                field(0, false),
                field(0, false),
                field(1, false),
            ]
        ],
        getResult: function() {
            return [
                [fieldStatic(`x+${this.inputs[0][2].value}`)],
                [fieldStatic(`x+${this.inputs[1][2].value}`)],
                [fieldStatic("1")],
            ];
        },
    },
];