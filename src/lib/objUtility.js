export const cube = `\
v 0.0 0.0 0.0
v 0.0 1.0 0.0
v 1.0 1.0 0.0
v 1.0 0.0 0.0
v 0.0 0.0 1.0
v 0.0 1.0 1.0
v 1.0 1.0 1.0
v 1.0 0.0 1.0
vt 0.0 0.0
vt 0.0 1.0
vt 1.0 1.0
vt 1.0 0.0
vn 0.0 0.0 -1.0
vn 0.0 0.0 1.0
vn -1.0 0.0 0.0
vn 1.0 0.0 0.0
vn 0.0 1.0 0.0
vn 0.0 -1.0 0.0
f 1/1/1 2/2/1 3/3/1
f 1/1/1 3/3/1 4/4/1
f 8/1/2 7/2/2 6/3/2
f 8/1/2 6/3/2 5/4/2
f 5/1/3 6/2/3 2/3/3
f 5/1/3 2/3/3 1/4/3
f 4/1/4 3/2/4 7/3/4
f 4/1/4 7/3/4 8/4/4
f 2/1/5 6/2/5 7/3/5
f 2/1/5 7/3/5 3/4/5
f 5/1/6 1/2/6 4/3/6
f 5/1/6 4/3/6 8/4/6`;

export const tetrahedron = `\
v  1.0  1.0  1.0
v -1.0 -1.0  1.0
v -1.0  1.0 -1.0
v  1.0 -1.0 -1.0
vt 0.0 0.0
vt 1.0 0.0
vt 0.5 1.0
vn  0.0  0.577  0.816
vn  0.816 -0.577  0.0
vn  0.0  0.577 -0.816
vn -0.816 -0.577  0.0
f 1/1/1 2/2/1 3/3/1
f 1/1/2 4/2/2 2/3/2
f 1/1/3 3/2/3 4/3/3
f 2/1/4 4/2/4 3/3/4`;

export const unitCubeCentered = `\
v -0.5 -0.5 -0.5
v -0.5  0.5 -0.5
v  0.5  0.5 -0.5
v  0.5 -0.5 -0.5
v -0.5 -0.5  0.5
v -0.5  0.5  0.5
v  0.5  0.5  0.5
v  0.5 -0.5  0.5
vn 0.0 0.0 -1.0
vn 0.0 0.0 1.0
vn -1.0 0.0 0.0
vn 1.0 0.0 0.0
vn 0.0 1.0 0.0
vn 0.0 -1.0 0.0
f 1//1 2//1 3//1
f 1//1 3//1 4//1
f 8//2 7//2 6//2
f 8//2 6//2 5//2
f 5//3 6//3 2//3
f 5//3 2//3 1//3
f 4//4 3//4 7//4
f 4//4 7//4 8//4
f 2//5 6//5 7//5
f 2//5 7//5 3//5
f 5//6 1//6 4//6
f 5//6 4//6 8//6`;

export function parseObjContent(text) {
    const vertices = [];
    const texcoords = [];
    const normals = [];
    const parameterSpaceVertices = [];

    const faces = [];
    const lines = [];
    const points = [];

    let currentObject = null;
    let currentGroup = null;
    let currentMaterial = null;
    let currentSmoothingGroup = null;

    let objects = [];

    for (const line of text.trim().split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#"))
            continue;

        const parts = trimmed.split(/\s+/);
        const keyword = parts[0];
        const data = parts.slice(1);

        switch (keyword) {
            case "v":
                vertices.push(data.map(Number));
                break;
            case "vt":
                texcoords.push(data.map(Number));
                break;
            case "vn":
                normals.push(data.map(Number));
                break;
            case "vp":
                parameterSpaceVertices.push(data.map(Number));
                break;
            case "f":
                // Possible formats: v, v/vt, v//vn, v/vt/vn
                const face = data.map(part => {
                    const [v, vt, vn] = part.split("/").map(s => s ? parseInt(s) - 1 : undefined);
                    return { v, vt, vn };
                });
                faces.push({
                    vertices: face,
                    object: currentObject,
                    group: currentGroup,
                    material: currentMaterial,
                    smoothingGroup: currentSmoothingGroup
                });
                break;
            case "l":
                lines.push(data.map(p => {
                    const [v, vt] = p.split("/").map(s => s ? parseInt(s) - 1 : undefined);
                    return { v, vt };
                }));
                break;
            case "p":
                points.push(data.map(p => parseInt(p) - 1));
                break;
            case "o":
                currentObject = data.join(" ");
                break;
            case "g":
                currentGroup = data.join(" ");
                break;
            case "usemtl":
                currentMaterial = data.join(" ");
                break;
            case "mtllib":
                if (!objects.mtllibs) objects.mtllibs = [];
                    objects.mtllibs.push(data.join(" "));
                break;
            case "s":
                currentSmoothingGroup = data[0] === "off" ? null : data[0];
                break;
            default:
                break;
        }
    }

    return {
        vertices,
        texcoords,
        normals,
        parameterSpaceVertices,
        faces,
        lines,
        points,
        metadata: {
            objects: objects.map(o => o.name),
            materials: objects.mtllibs || [],
        }
    };
}

export function flattenObjToBuffers(parsed) {
    const {
        vertices,
        texcoords,
        normals,
        faces,
    } = parsed;

    const positionBuffer = [];
    const normalBuffer = [];
    const texcoordBuffer = [];
    const indexBuffer = [];

    const uniqueVertexMap = new Map();

    let nextIndex = 0;
    for (const face of faces) {
        const vertexIndices = [];

        for (const vert of face.vertices) {
            const key = makeKey(vert.v, vert.vt, vert.vn);

            if (uniqueVertexMap.has(key)) {
                vertexIndices.push(uniqueVertexMap.get(key));
            } else {
                positionBuffer.push(...vertices[vert.v]);

                if (vert.vt !== undefined && texcoords[vert.vt]) {
                    texcoordBuffer.push(...texcoords[vert.vt].slice(0, 2));
                } else {
                    texcoordBuffer.push(0, 0);
                }

                if (vert.vn !== undefined && normals[vert.vn]) {
                    normalBuffer.push(...normals[vert.vn]);
                } else {
                    normalBuffer.push(0, 0, 0);
                }

                uniqueVertexMap.set(key, nextIndex);
                vertexIndices.push(nextIndex);
                nextIndex++;
            }
        }

        // Triangulation for quad or polygon faces
        for (let i = 1; i < vertexIndices.length - 1; i++) {
            indexBuffer.push(vertexIndices[0], vertexIndices[i], vertexIndices[i + 1]);
        }
    }

    return {
        positions: new Float32Array(positionBuffer),
        normals: new Float32Array(normalBuffer),
        texcoords: new Float32Array(texcoordBuffer),
        indices: (nextIndex < 65536)
            ? new Uint16Array(indexBuffer)
            : new Uint32Array(indexBuffer),
    };
}

function makeKey(v, vt, vn) {
    return `${v}/${vt !== undefined ? vt : ''}/${vn !== undefined ? vn : ''}`;
}
