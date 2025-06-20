export const cube = `\
v 0.0 0.0 0.0
v 0.0 1.0 0.0
v 1.0 1.0 0.0
v 1.0 0.0 0.0
v 0.0 0.0 1.0
v 0.0 1.0 1.0
v 1.0 1.0 1.0
v 1.0 0.0 1.0
vn 0.0 0.0 -1.0
vn 0.0 0.0 1.0
vn -1.0 0.0 0.0
vn 1.0 0.0 0.0
vn 0.0 1.0 0.0
vn 0.0 -1.0 0.0
f 3//1 7//1 8//1
f 3//1 8//1 4//1
f 1//2 5//2 6//2
f 1//2 6//2 2//2
f 7//5 3//5 2//5
f 7//5 2//5 6//5
f 4//6 8//6 5//6
f 4//6 5//6 1//6
f 8//4 7//4 6//4
f 8//4 6//4 5//4
f 3//3 4//3 1//3
f 3//3 1//3 2//3`;

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
