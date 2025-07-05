import { mat4 } from "gl-matrix";

import { flattenObjToBuffers } from "$lib/objUtility";

export function drawScene(gl, programInfo, objects, projectionMatrix, viewMatrix) {
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    objects.forEach(function(object) {
        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, viewMatrix, object.getModelMatrix());

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        const buffers = initBuffers(gl, object);

        setPositionAttribute(gl, buffers, programInfo);
        setTextureAttribute(gl, buffers, programInfo);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        setNormalAttribute(gl, buffers, programInfo);

        gl.useProgram(programInfo.program);

        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, object.texture);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        gl.drawElements(gl.TRIANGLES, object.mesh.faces.length * 3, gl.UNSIGNED_SHORT, 0);
    });
}

function setPositionAttribute(gl, buffers, programInfo) {
    const elements = 3;
    const normalize = false;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, elements, gl.FLOAT, normalize, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setTextureAttribute(gl, buffers, programInfo) {
    const elements = 2;
    const normalize = false;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, elements, gl.FLOAT, normalize, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

function setNormalAttribute(gl, buffers, programInfo) {
    const elements = 3;
    const normalize = false;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, elements, gl.FLOAT, normalize, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

function initBuffers(gl, object) {
    const { positions, normals, texcoords, indices } = flattenObjToBuffers(object.mesh);
    return {
        position: initPositionBuffer(gl, positions),
        normal: initNormalBuffer(gl, normals),
        textureCoord: initTextureBuffer(gl, texcoords),
        indices: initIndexBuffer(gl, indices),
    };
}

function initPositionBuffer(gl, positions) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
}

function initNormalBuffer(gl, vertexNormals) {
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    return normalBuffer;
}

function initTextureBuffer(gl, textureCoordinates) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
    return textureCoordBuffer;
}

function initIndexBuffer(gl, indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    return indexBuffer;
}
