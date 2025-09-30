export class Cpu {
    constructor(memorySize = 65536) {
        this.memory = new Uint8Array(memorySize);
        this.regs = new Uint8Array(8);
        this.pc = 0x0000;
        this.sp = 0xFFFE;
        this.flags = {
            Z: 0,
        };
        this.halted = false;
        this.output = "";
    }

    reset() {
        this.regs.fill(0);
        this.pc = 0x0000;
        this.sp = 0xFFFE;
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
