# [edu](https://alexanderkosnac.github.io/edu)

Collection of programs with a focus on transparency and understanding of the
underlying material.
The name is derived from top-level domain [.edu](https://en.wikipedia.org/wiki/.edu)
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
