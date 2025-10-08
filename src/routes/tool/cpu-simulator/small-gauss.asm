; Sum the numbers from N down to 1 and OUT the result
        MOV R0, #10  ; N
        MOV R1, #0   ; sum
loop:   JZ done
        ADD R1, R0
        DEC R0
        JMP loop
done:   OUT R1
        HALT