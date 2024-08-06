class Operator {
    constructor(precedence, nArguments, isLeftAssociative, solver) {
        this.precedence = precedence;
        this.nArguments = nArguments;
        this.isLeftAssociative = isLeftAssociative;
        this.solver = solver;
    }
}

const opMapping = {
    "-": new Operator(2, 2, true, (a, b) => a-b ),
    "+": new Operator(2, 2, true, (a, b) => a+b ),
    "*": new Operator(3, 2, true, (a, b) => a*b ),
    "/": new Operator(3, 2, true, (a, b) => a/b ),
    "^": new Operator(3, 2, false, (a, b) => a**b ),
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

export function shuntingYard(tokensRef, callbackRpn, callbackSolve) {
    let tokens = [...tokensRef].reverse();

    let outputQueue = [];
    let opStack = [];

    while (tokens.length) {
        let token = tokens.pop();

        if (token.type == TokenType.NUM) {
            outputQueue.push(token);
            callbackRpn(token, `Push token to output.`, outputQueue, opStack);
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
                callbackRpn(op, `Move token from stack to output (precedence violated).`, outputQueue, opStack);
            }
            opStack.push(token);
            callbackRpn(token, `Push token to stack.`, outputQueue, opStack);
        }
        else if (token.symbol == "(") {
            opStack.push(token);
            callbackRpn(token, `Push token to stack.`, outputQueue, opStack);
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
        callbackRpn(op, `Flush stack to output.`, outputQueue, opStack);
    }

    let nums = [];
    while (outputQueue.length) {
        let token = outputQueue.shift();
        switch (token.type) {
            case TokenType.NUM:
                nums.push(parseFloat(token.symbol));
                callbackSolve(token, `Store number '${token.symbol}'`, outputQueue, nums);
                break;
            case TokenType.OP:
                const op = opMapping[token.symbol];
                const args = Array(op.nArguments).fill().map(_ => nums.pop()).reverse();
                const res = op.solver(...args);
                nums.push(res);
                callbackSolve(token, `Do ${token.symbol} with arguments [${args.join(", ")}] = ${res}`, outputQueue, nums);
                break;
        }
    }
    return nums[0];
}