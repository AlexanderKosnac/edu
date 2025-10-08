; Continuously fill the stack
        MOV R0, #0
loop:   PUSH R0
        INC R0
        JMP loop
