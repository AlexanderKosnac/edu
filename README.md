# [edu](https://alexanderkosnac.github.io/edu)

edu is a growing collection of educational tools, visualizations, calculators, and small utilities. The goal is
transparency of underlying processes and concepts, rather than efficient or production-ready implementations.

Many tools expose intermediate steps, internal state, formulas, and transformations so that algorithms, ideas, and
systems become easier to reason about.

At the same time, the project also includes practical utilities and lightweight service tools, sometimes implemented as
simple wrappers to enable interaction with complex libraries.

The name is derived from the top-level domain [.edu](https://en.wikipedia.org/wiki/.edu),
which was created for organizations with a focus on education.

## Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

If needed, use the environment variables `HTTPS` and `EXPOSE` to make the development server use HTTPS and expose the server to the network.

```
HTTPS=true EXPOSE=true npm run dev
```

## Production

To create a production version:

```bash
npm run build
```
