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

        program.push({mnemonic, operands, addr: pc, source: raw});
        pc += opcode.size;
    }

    // Pass 2

    return {
        labels: labels,
        program: program,
        pc: pc,
    };
}
