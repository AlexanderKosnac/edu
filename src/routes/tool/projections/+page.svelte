<script>
    import { field } from "$lib/Matrix/matrix";
    import Projection from "./Projection.svelte";
</script>

<svelte:head>
    <title>Projections</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Projections</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>Orthographic Projection</h2>
        <Projection displayMatrix={[
            [field("2/(r-l)"), field(0),         field(0),         field("-(r+l)/(r-l)")],
            [field(0),         field("2/(t-b)"), field(0),         field("-(t+b)/(t-b)")],
            [field(0),         field(0),         field("2/(n-f)"), field("-(n+f)/(n-f)")],
            [field(0),         field(0),         field(0),         field(1)],        
        ]} discreteMatrix={(r, l, t, b, n, f) => [
            [field(2/(r-l)), field(0),       field(0),        field(-(r+l)/(r-l))],
            [field(0),       field(2/(t-b)), field(0),        field(-(t+b)/(t-b))],
            [field(0),       field(0),       field(-2/(f-n)), field(-(f+n)/(f-n))],
            [field(0),       field(0),       field(0),        field(1)],        
        ]}/>

        <h2>Perspective Projection</h2>
        <Projection displayMatrix={[
            [field("2n/(r-l)"), field(0),          field("(r+l)/(r-l)"),  field(0)],
            [field(0),          field("2n/(t-b)"), field("(t+b)/(t-b)"),  field(0)],
            [field(0),          field(0),          field("-(f+n)/(f-n)"), field("-2fn/(f-n)")],
            [field(0),          field(0),          field(-1),             field(0)],        
        ]} discreteMatrix={(r, l, t, b, n, f) => [
            [field(2*n/(r-l)), field(0),         field((r+l)/(r-l)),        field(0)],
            [field(0),         field(2*n/(t-b)), field((t+b)/(t-b)),        field(0)],
            [field(0),         field(0),         field(-(f+n)/(f-n)), field(-2*f*n/(f-n))],
            [field(0),         field(0),         field(-1),        field(0)],        
        ]}/>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://www.songho.ca/opengl/gl_projectionmatrix.html" target="_blank">Article on OpenGL Projectionmatrices</a></li>
            <li><a href="http://learnwebgl.brown37.net/08_projections/projections_perspective.html" target="_blank">Article on perspective projection</a></li>
        </ul>
    </div>
</div>

<style>
</style>