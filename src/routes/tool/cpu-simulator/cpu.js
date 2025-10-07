import { toHex } from "$lib/hexUtility";

export class Cpu {
    constructor(memorySize = 65536) {
        this.memory = new Uint8Array(memorySize);
        this.regs = new Uint8Array(8);
        this.pc = 0x0000;
        this.sp = this.memory.length;
        this.flags = {
            Z: 0,
        };
        this.halted = false;
        this.output = "";
    }

    reset() {
        this.regs.fill(0);
        this.pc = 0x0000;
        this.sp = this.memory.length;
        this.flags = {
            Z: 0,
        };
        this.halted = false;
        this.output = "";
    }

    loadProgram(bytes, addr = 0x0000) {
        this.memory.fill(0);
        this.memory.set(bytes, addr);
        this.pc = addr;
        this.halted = false;
    }

    readWord(addr) {
        return (this.memory[addr] << 8) | this.memory[(addr + 1) & 0xFFFF];
    }

    step() {
        if (this.halted)
            return { status: "halted" };
        const op = this.memory[this.pc];
        switch (op) {
            case 0x00: // NOP
                this.pc += 1;
                break;
            case 0x01: // HALT
                this.halted = true;
                this.pc += 1;
                return { status: "halt" };

            case 0x10: { // MOV
                const r = this.memory[this.pc + 1] & 0x07;
                const imm = this.memory[this.pc + 2];
                this.regs[r] = imm & 0xFF;
                this.pc += 3;
                break;
            }
            case 0x11: { // MOVR
                const rn = this.memory[this.pc + 1] & 0x07;
                const rm = this.memory[this.pc + 2] & 0x07;
                this.regs[rn] = this.regs[rm];
                this.pc += 3;
                break;
            }
            case 0x20: { // LOAD
                const r = this.memory[this.pc + 1] & 0x07;
                const hi = this.memory[this.pc + 2];
                const lo = this.memory[this.pc + 3];
                const addr = (hi << 8) | lo;
                this.regs[r] = this.memory[addr];
                this.pc += 4;
                break;
            }
            case 0x21: { // STORE
                const r = this.memory[this.pc + 1] & 0x07;
                const hi = this.memory[this.pc + 2];
                const lo = this.memory[this.pc + 3];
                const addr = (hi << 8) | lo;
                this.memory[addr] = this.regs[r] & 0xFF;
                this.pc += 4;
                break;
            }
            case 0x30: { // ADD
                const rn = this.memory[this.pc + 1] & 0x07;
                const rm = this.memory[this.pc + 2] & 0x07;
                const res = (this.regs[rn] + this.regs[rm]) & 0xFF;
                this.regs[rn] = res;
                this.flags.Z = (res === 0) ? 1 : 0;
                this.pc += 3;
                break;
            }
            case 0x31: { // ADDI
                const r = this.memory[this.pc + 1] & 0x07;
                const imm = this.memory[this.pc + 2];
                const res = (this.regs[r] + imm) & 0xFF;
                this.regs[r] = res;
                this.flags.Z = (res === 0) ? 1 : 0;
                this.pc += 3;
                break;
            }
            case 0x32: { // SUB
                const rn = this.memory[this.pc + 1] & 0x07;
                const rm = this.memory[this.pc + 2] & 0x07;
                const res = (this.regs[rn] - this.regs[rm]) & 0xFF;
                this.regs[rn] = res;
                this.flags.Z = (res === 0) ? 1 : 0;
                this.pc += 3;
                break;
            }
            case 0x40: { // CMP
                const rn = this.memory[this.pc + 1] & 0x07;
                const rm = this.memory[this.pc + 2] & 0x07;
                const res = (this.regs[rn] - this.regs[rm]) & 0xFF;
                this.flags.Z = (res === 0) ? 1 : 0;
                this.pc += 3;
                break;
            }
            case 0x50: { // JMP
                const hi = this.memory[this.pc + 1];
                const lo = this.memory[this.pc + 2];
                const addr = (hi << 8) | lo;
                this.pc = addr;
                break;
            }
            case 0x51: { // JZ
                const hi = this.memory[this.pc + 1];
                const lo = this.memory[this.pc + 2];
                const addr = (hi << 8) | lo;
                if (this.flags.Z)
                    this.pc = addr;
                else
                    this.pc += 3;
                break;
            }
            case 0x52: { // JNZ
                const hi = this.memory[this.pc + 1];
                const lo = this.memory[this.pc + 2];
                const addr = (hi << 8) | lo;
                if (!this.flags.Z)
                    this.pc = addr;
                else
                    this.pc += 3;
                break;
            }
            case 0x60: { // INC
                const r = this.memory[this.pc + 1] & 0x07;
                this.regs[r] = (this.regs[r] + 1) & 0xFF;
                this.flags.Z = (this.regs[r] === 0) ? 1 : 0;
                this.pc += 2;
                break;
            }
            case 0x61: { // DEC
                const r = this.memory[this.pc + 1] & 0x07;
                this.regs[r] = (this.regs[r] - 1) & 0xFF;
                this.flags.Z = (this.regs[r] === 0) ? 1 : 0;
                this.pc += 2;
                break;
            }
            case 0x70: { // OUT
                const r = this.memory[this.pc + 1] & 0x07;
                this.output += toHex(this.regs[r]);
                this.pc += 2;
                break;
            }
            case 0x80: { // PUSH
                const r = this.memory[this.pc + 1] & 0x07;
                this.sp = (this.sp - 1) & 0xFFFF;
                this.memory[this.sp] = this.regs[r] & 0xFF;
                this.pc += 2;
                break;
            }
            case 0x81: { // POP
                const r = this.memory[this.pc + 1] & 0x07;
                this.regs[r] = this.memory[this.sp];
                this.sp = (this.sp + 1) & 0xFFFF;
                this.pc += 2;
                break;
            }
            default:
                throw new Error(`Unknown opcode 0x${op.toString(16)} at PC=0x${this.pc.toString(16)}`);
        }
        return { status: "ok" };
    }

    run(maxSteps = 100000) {
        let steps = 0;
        while (!this.halted && steps < maxSteps) {
            this.step();
            steps++;
        }
        return {
            halted: this.halted,
            steps,
        };
    }
}
