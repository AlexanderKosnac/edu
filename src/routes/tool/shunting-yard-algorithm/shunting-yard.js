class Operator {
    constructor(precedence, nArguments, isLeftAssociative) {
        this.precedence = precedence;
        this.nArguments = nArguments;
        this.isLeftAssociative = isLeftAssociative;
    }
}

const opMapping = {
    "-": new Operator(2, 2, true),
    "+": new Operator(2, 2, true),
    "*": new Operator(3, 2, true),
    "/": new Operator(3, 2, true),
    "^": new Operator(3, 2, false),
}

const TokenType = Object.freeze({
    NUM:  { name: "NUM" },
    OP:   { name: "OP" },
    PARA: { name: "PARA" },
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
    return strClean.split(/([\+\-\*\/\^\(\)])/g).filter(t => t !== "").map(t => {
        let type = TokenType.UNKN;
        if (isFinite(parseFloat(t))) type = TokenType.NUM;
        if (ops.includes(t)) type = TokenType.OP;
        if (["(", ")"].includes(t)) type = TokenType.PARA;

        return new Token(t, type);
    });
}

export function shuntingYard(tokensRef, callback) {
    let tokens = [...tokensRef].reverse();

    let outputQueue = [];
    let opStack = [];

    while (tokens.length) {
        let token = tokens.pop();

        if (token.type == TokenType.NUM) {
            outputQueue.push(token);
            callback(token, `Push token to output.`, outputQueue, opStack);
        }
        else if (token.type == TokenType.OP) {
            while (
                opStack.at(-1) &&
                opStack.at(-1).symbol != "(" && (
                    opMapping[opStack.at(-1).symbol].precedence > opMapping[token.symbol].precedence || (
                        opMapping[opStack.at(-1).symbol].precedence == opMapping[token.symbol].precedence &&
                        opMapping[token.symbol].isLeftAssociative
                    )
                )
            ) {
                const op = opStack.pop();
                outputQueue.push(op);
                callback(op, `Move token from stack to output (precedence violated).`, outputQueue, opStack);
            }
            opStack.push(token);
            callback(token, `Push token to stack.`, outputQueue, opStack);
        }
        else if (token.symbol == "(") {
            opStack.push(token);
            callback(token, `Push token to stack.`, outputQueue, opStack);
        }
        else if (token.symbol == ")") {
            while (opStack.at(-1) && opStack.at(-1).symbol != "(") {
                if (opStack.length === 0) throw new Error("Mismatched parenthesis.");
                outputQueue.push(opStack.pop());
            }
            if (opStack.at(-1) && opStack.at(-1).symbol != "(") throw new Error("Expected left parenthesis.");
            opStack.pop();
        }
    }

    while (opStack.length) {
        if (opStack.at(-1) && opStack.at(-1).symbol == "(") throw new Error("Mismatched parenthesis.");
        const op = opStack.pop();
        outputQueue.push(op);
        callback(op, `Flush stack to output.`, outputQueue, opStack);
    }
}