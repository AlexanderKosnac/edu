function opcode(opcode, size, mnemonic, encoding, description) {
    return {
        opcode: opcode,
        size: size,
        mnemonic: mnemonic,
        encoding: encoding,
        description: description,
    };
}

export const OPCODES = {
    NOP:   opcode(0x00, 1, "NOP",            "00",                   "No-op"),
    HALT:  opcode(0x01, 1, "HALT",           "01",                   "Stop execution"),
    MOV:   opcode(0x10, 3, "MOV Rn, #imm",   "10 R imm",             "R = imm (8-bit)"),
    MOVR:  opcode(0x11, 3, "MOV Rn, Rm",     "11 Rn Rm",             "Rn = Rm"),
    LOAD:  opcode(0x20, 4, "LOAD Rn, addr",  "20 R addr_hi addr_lo", "Rn = MEM[addr]"),
    STORE: opcode(0x21, 4, "STORE Rn, addr", "21 R addr_hi addr_lo", "MEM[addr] = Rn"),
    ADD:   opcode(0x30, 3, "ADD Rn, Rm",     "30 Rn Rm",             "Rn += Rm, set Z flag"),
    ADDI:  opcode(0x31, 3, "ADDI Rn, #imm",  "31 R imm",             "Rn += imm, set Z"),
    SUB:   opcode(0x32, 3, "SUB Rn, Rm",     "32 Rn Rm",             "Rn -= Rm, set Z"),
    CMP:   opcode(0x40, 3, "CMP Rn, Rm",     "40 Rn Rm",             "Compare (sets Z flag)"),
    JMP:   opcode(0x50, 3, "JMP addr",       "50 addr_hi addr_lo",   "PC = addr"),
    JZ:    opcode(0x51, 3, "JZ addr",        "51 addr_hi addr_lo",   "Jump if Z set"),
    JNZ:   opcode(0x52, 3, "JNZ addr",       "52 addr_hi addr_lo",   "Jump if Z clear"),
    INC:   opcode(0x60, 2, "INC Rn",         "60 R",                 "Rn++"),
    DEC:   opcode(0x61, 2, "DEC Rn",         "61 R",                 "Rn--"),
    OUT:   opcode(0x70, 2, "OUT Rn",         "70 R",                 "append register to emulator output"),
    PUSH:  opcode(0x80, 2, "PUSH Rn",        "80 R",                 "push register on stack (SP--, store)"),
    POP:   opcode(0x81, 2, "POP Rn",         "81 R",                 "pop into register (load, SP++)"),
};

// Parse token, including numbers, registers, and labels.
function parseToken(token, labels = {}) {
    if (typeof token !== "string")
        return token;
    token = token.replace(/^#/, "");
    if (/^0x[0-9a-f]+$/i.test(token))
        return parseInt(token, 16) & 0xFFFF;
    if (/^0b[01]+$/i.test(token))
        return parseInt(token.slice(2), 2) & 0xFFFF;
    if (/^\d+$/.test(token))
        return parseInt(token, 10) & 0xFFFF;
    if (token in labels)
        return labels[token] & 0xFFFF;
    throw new Error(`Unknown token: ${token}`);
}

export function assemble(src, origin = 0x0000) {
    const lines = src.split("\n");
    const labels = {};
    const program = [];
    let pc = origin;

    // Pass 1
    for (let raw of lines) {
        const commentless = raw.replace(/;.*$/, "").trim();
        if (!commentless)
            continue;

        let line = commentless;
        const labelMatch = line.match(/^([A-Za-z_][\w_]*):/);
        if (labelMatch) {
            const name = labelMatch[1];
            labels[name] = pc;
            line = line.slice(labelMatch[0].length).trim();
            if (!line)
                continue;
        }

        const parts = line.replace(/,\s*/g, " , ").split(/\s+/).filter(Boolean);
        const mnemonic = parts[0];
        const operands = parts.slice(1).filter(p => p !== ",");

        const opcode = OPCODES[mnemonic]
        if (opcode === undefined)
            throw new Error(`Mnemonic ${mnemonic} is not a known opcode.`);

        program.push({mnemonic, operands, addr: pc, source: raw});
        pc += opcode.size;
    }

    // Pass 2
    const out = [];
    const pushByte = (b) => out.push(b & 0xFF);
    const pushWord = (w) => {
        pushByte((w >> 8) & 0xFF);
        pushByte(w & 0xFF);
    }

    for (const inst of program) {
        const m = inst.mnemonic.toUpperCase();
        const ops = inst.operands;
        switch (m) {
            case "NOP":
                pushByte(OPCODES.NOP.opcode);
                break;
            case "HALT":
                pushByte(OPCODES.HALT.opcode);
                break;
            case "MOV": {
                const dst = ops[0].toUpperCase();
                const src = ops[1];
                const rdst = parseInt(dst.slice(1));
                if (/^R\d+$/i.test(src)) {
                    pushByte(OPCODES.MOVR.opcode);
                    pushByte(rdst);
                    pushByte(parseInt(src.slice(1)));
                } else {
                    const imm = parseToken(src, labels) & 0xFF;
                    pushByte(OPCODES.MOV.opcode);
                    pushByte(rdst);
                    pushByte(imm);
                }
                break;
            }
            case "LOAD": {
                const r = parseInt(ops[0].slice(1));
                const addr = parseToken(ops[1], labels) & 0xFFFF;
                pushByte(OPCODES.LOAD.opcode);
                pushByte(r);
                pushWord(addr);
                break;
            }
            case "STORE": {
                const r = parseInt(ops[0].slice(1));
                const addr = parseToken(ops[1], labels) & 0xFFFF;
                pushByte(OPCODES.STORE.opcode);
                pushByte(r);
                pushWord(addr);
                break;
            }
            case "ADD": {
                const a = parseInt(ops[0].slice(1));
                const b = parseInt(ops[1].slice(1));
                pushByte(OPCODES.ADD.opcode);
                pushByte(a);
                pushByte(b); break;
            }
            case "ADDI": {
                const a = parseInt(ops[0].slice(1));
                const imm = parseToken(ops[1], labels) & 0xFF;
                pushByte(OPCODES.ADDI.opcode);
                pushByte(a);
                pushByte(imm);
                break;
            }
            case "SUB": {
                const a = parseInt(ops[0].slice(1));
                const b = parseInt(ops[1].slice(1));
                pushByte(OPCODES.SUB.opcode);
                pushByte(a);
                pushByte(b);
                break;
            }
            case "CMP": {
                const a = parseInt(ops[0].slice(1));
                const b = parseInt(ops[1].slice(1));
                pushByte(OPCODES.CMP.opcode);
                pushByte(a);
                pushByte(b);
                break;
            }
            case "JMP":
            case "JZ":
            case "JNZ": {
                const opcode = m === "JMP" ? OPCODES.JMP : (m === "JZ" ? OPCODES.JZ : OPCODES.JNZ);
                const addr = parseToken(ops[0], labels) & 0xFFFF;
                pushByte(opcode.opcode);
                pushWord(addr);
                break;
            }
            case "INC": {
                const r = parseInt(ops[0].slice(1));
                pushByte(OPCODES.INC.opcode);
                pushByte(r);
                break;
            }
            case "DEC": {
                const r = parseInt(ops[0].slice(1));
                pushByte(OPCODES.DEC.opcode);
                pushByte(r);
                break;
            }
            case "OUT": {
                const r = parseInt(ops[0].slice(1));
                pushByte(OPCODES.OUT.opcode);
                pushByte(r);
                break;
            }
            case "PUSH": {
                const r = parseInt(ops[0].slice(1));
                pushByte(OPCODES.PUSH.opcode);
                pushByte(r);
                break;
            }
            case "POP": {
                const r = parseInt(ops[0].slice(1));
                pushByte(OPCODES.POP.opcode);
                pushByte(r);
                break;
            }
            default:
                throw new Error(`Unhandled mnemonic ${m} (source: ${inst.source})`);
        }
    }

    return {
        bytes: new Uint8Array(out),
        labels,
        program,
        pc,
    };
}
