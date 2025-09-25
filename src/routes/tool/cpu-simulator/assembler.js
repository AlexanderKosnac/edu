function opcode(opcode, mnemonic, encoding, description) {
    return {
        opcode: opcode,
        mnemonic: mnemonic,
        encoding: encoding,
        description: description,
    };
}

export const OPCODES = {
    NOP:   opcode(0x00, "NOP",            "00",                   "No-op"),
    HALT:  opcode(0x01, "HALT",           "01",                   "Stop execution"),
    MOVI:  opcode(0x10, "MOV Rn, #imm",   "10 R imm",             "R = imm (8-bit)"),
    MOVR:  opcode(0x11, "MOV Rn, Rm",     "11 Rn Rm",             "Rn = Rm"),
    LOAD:  opcode(0x20, "LOAD Rn, addr",  "20 R addr_hi addr_lo", "Rn = MEM[addr]"),
    STORE: opcode(0x21, "STORE Rn, addr", "21 R addr_hi addr_lo", "MEM[addr] = Rn"),
    ADD:   opcode(0x30, "ADD Rn, Rm",     "30 Rn Rm",             "Rn += Rm, set Z flag"),
    ADDI:  opcode(0x31, "ADDI Rn, #imm",  "31 R imm",             "Rn += imm, set Z"),
    SUB:   opcode(0x32, "SUB Rn, Rm",     "32 Rn Rm",             "Rn -= Rm, set Z"),
    CMP:   opcode(0x40, "CMP Rn, Rm",     "40 Rn Rm",             "Compare (sets Z flag)"),
    JMP:   opcode(0x50, "JMP addr",       "50 addr_hi addr_lo",   "PC = addr"),
    JZ:    opcode(0x51, "JZ addr",        "51 addr_hi addr_lo",   "Jump if Z set"),
    JNZ:   opcode(0x52, "JNZ addr",       "52 addr_hi addr_lo",   "Jump if Z clear"),
    INC:   opcode(0x60, "INC Rn",         "60 R",                 "Rn++"),
    DEC:   opcode(0x61, "DEC Rn",         "61 R",                 "Rn--"),
    OUT:   opcode(0x70, "OUT Rn",         "70 R",                 "append register to emulator output"),
    PUSH:  opcode(0x80, "PUSH Rn",        "80 R",                 "push register on stack (SP--, store)"),
    POP:   opcode(0x81, "POP Rn",         "81 R",                 "pop into register (load, SP++)"),
};











