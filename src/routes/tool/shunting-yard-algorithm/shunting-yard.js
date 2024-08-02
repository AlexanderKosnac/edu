class Operator {
    constructor(precedence, nArguments, isLeftAssociative) {
        this.precedence = precedence;
        this.nArguments = nArguments;
        this.isLeftAssociative = isLeftAssociative;
    }
}

const opMapping = {
    "-": new Operator(4, 2, false),
    "+": new Operator(3, 2, true),
    "*": new Operator(2, 2, true),
    "/": new Operator(1, 2, false),
}

const TokenType = Object.freeze({
    NUM:  { name: "NUM" },
    FUNC: { name: "FUNC" },
    OP:   { name: "OP" },
    UNKN: { name: "UNKN" },
});

class Token {
    constructor(symbol, type) {
        this.symbol = symbol;
        this.type = type;
    }
}

export function getAvailableOperators() {
    return Object.keys(opMapping);
}

export function tokenize(str) {
    const strClean = str.replace(/ /g, '');
    const ops = Object.keys(opMapping);
    return strClean.split(/([\+\-\*\/])/g).filter(t => t !== "").map(t => {
        let type = TokenType.UNKN;
        if (isFinite(parseFloat(t))) type = TokenType.NUM;
        if (ops.includes(t)) type = TokenType.OP;

        return new Token(t, type);
    });
}

export function shuntingYard(tokens, callback) {
    let outputQueue = [];
    let opStack = [];

    while (tokens) {
        let token = tokens.pop();
        callback(token, "action", "rpn", opStack);
    }
}