# Voxora

Voxora is a customized voice AI platform for building conversational agents with a visual workflow editor, telephony, browser voice calls, and chat.

## Project structure

- `api/` — FastAPI backend, authentication, workflows, telephony, background tasks, and database access.
- `ui/` — Next.js frontend, agent editor, account settings, recordings, and embeddable widget.
- `docs/` — Mintlify documentation and API reference.
- `scripts/` — development, setup, migration, and deployment helpers.
- `deploy/` and `nginx/` — deployment templates and Helm configuration.
- `sdk/` and `examples/` — Python/TypeScript SDKs and usage examples.
- `pipecat/` — voice pipeline framework maintained as a Git submodule.
- `evals/` — evaluation helpers.
- `test-site/` — local widget demonstration.

## Development

Follow [contributor setup](docs/contribution/setup.mdx) for dependencies and services. Backend settings live in `api/.env`; frontend settings live in `ui/.env`. Tests must use the separate settings in `api/.env.test`.

The default product branding is:

```dotenv
BRAND_NAME=Voxora
WIDGET_BRAND_SLUG=voxora
```

New website embeds load `/embed/voxora-widget.js` and expose `window.VoxoraWidget`. Existing widget global names remain aliases for compatibility.

## Compatibility and deployment

Existing provider identifiers, database fields, API-key prefixes, webhook headers, published SDK package names, authentication cookies, and deployment resource names remain stable. The published upstream SDKs still use `dograh-sdk`, `dograh_sdk`, `DograhClient`, and `@dograh/sdk`.

Links to upstream source, container images, and hosted services still refer to their real locations. These resources belong to the original project; downloading its released images or setup bundles installs the upstream product. Deploy this fork's own built artifacts to run Voxora. This fork does not yet declare a public website, cloud service, package registry, or container registry of its own.

The current working tree has local deployment files removed, including the production Docker Compose file and backend/frontend Dockerfiles. Those files must be restored or replaced before building a production deployment through that path.

The [changelog](CHANGELOG.md) records upstream release history. Documentation screenshots and videos may show the original interface.

## Attribution and license

Voxora is derived from [Dograh](https://github.com/dograh-hq/dograh), originally developed by Zansat Technologies Private Limited.

The original copyright notice, BSD 2-Clause license terms, and disclaimer are retained in [LICENSE](LICENSE).
