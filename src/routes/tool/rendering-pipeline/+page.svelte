<script>
</script>

<svelte:head>
    <title>Rendering Pipeline</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Rendering Pipeline</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        An implementation of a basic computer graphics rendering pipeline can be found in the following repository.
        <a href="https://github.com/AlexanderKosnac/renderer" target="_blank">github.com/AlexanderKosnac/renderer</a>
    </div>
</div>

<div class="row">
    <div class="col">
        <h1>Writeup</h1>
        In this short writeup I outline the key steps and processes to achieve 3D graphics.

        <h2>Define Objects</h2>
        <p>
            Objects are constructed from triangles that are defined by three ordered vertices.
            Triangles have a fixed front and back side which is determined by the direction of the normal of the plane created by the two legs of the triangle.
            Whether the front or back is in positive normal direction, does not matter.
            Neither does the order (clock-wise or counter-clock-wise) in which the vertices are defined.
            Both simply have to be applied consistently throughout the object definitions.
        </p>
        <p>
            Object definitions can easily become very large and effectively unmanageable for humans, requiring special modelling software to create the files.
            A basic file format to define objects are <a href="https://en.wikipedia.org/wiki/Wavefront_.obj_file">Wavefront .obj file</a>.
            In the geometric information along with texture related information can be stored.
            For basic rendering, only <tt>v</tt> (vertex) and <tt>f</tt> (face) entries are relevant.
            Each vertex is defined by four points: x, y, z, [w] (w being optional).
            Each face is defined by n vertices: f v1 v1 ... vn.
            Faces will be triangles for the purpose of this write-up.
            The vertices indices start from 1.
            <pre>
                v  0.5  0.5  0.5
                f 1 2 3
            </pre>
        </p>

    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Graphics_pipeline" target="_blank">Graphics pipeline</a></li>
        </ul>
    </div>
</div>

<style>
</style>