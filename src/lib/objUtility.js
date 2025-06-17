export const cube = `\
v 0.0 0.0 0.0
v 0.0 1.0 0.0
v 1.0 1.0 0.0
v 1.0 0.0 0.0
v 0.0 0.0 1.0
v 0.0 1.0 1.0
v 1.0 1.0 1.0
v 1.0 0.0 1.0

f 3 7 8
f 3 8 4
f 1 5 6
f 1 6 2
f 7 3 2
f 7 2 6
f 4 8 5
f 4 5 1
f 8 7 6
f 8 6 5
f 3 4 1
f 3 1 2`;

export const pyramid = `\
v  1.0  1.0  1.0
v -1.0 -1.0  1.0
v -1.0  1.0 -1.0
v  1.0 -1.0 -1.0
f 1 2 3
f 1 4 2
f 1 3 4
f 2 4 3`;

export function parseObjContent(text) {
    const positions = [];
    const indices = [];

    for (const line of text.trim().split("\n")) {
        const parts = line.trim().split(/\s+/);
        if (parts[0] === "v") {
            positions.push(...parts.slice(1).map(Number));
        } else if (parts[0] === "f") {
            const face = parts.slice(1).map(p => parseInt(p) - 1);
            if (face.length === 3) {
                indices.push(...face);
            } else if (face.length === 4) {
                indices.push(face[0], face[1], face[2]);
                indices.push(face[0], face[2], face[3]);
            }
        }
    }
    return { positions, indices };
}
