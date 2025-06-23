import { mat4 } from "gl-matrix";

export function drawScene(gl, programInfo, objects, buffers, cubeRotation) {
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    objects.forEach(function(object) {
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 1.0, [0, 0, 1]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.3, [1, 0, 0]);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

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

        const vertexCount = 36;
        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
    });
}

function setPositionAttribute(gl, buffers, programInfo) {
    const elements = 3;
    const normalize = false;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, elements, gl.FLOAT, normalize, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setColorAttribute(gl, buffers, programInfo) {
    const elements = 4;
    const normalize = false;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, elements, gl.FLOAT, normalize, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
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
