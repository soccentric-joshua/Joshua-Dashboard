# Joshua-Dashboard Build and Deployment

## Purpose and scope

Joshua-Dashboard is the web UI in `webui/`. Its package manifest identifies a Next.js 16 application with React 19, TypeScript, Tailwind, Recharts, ESLint, and Vitest. The root Makefile wraps local npm workflows and the Docker Makefile under `docker/`.

## 1. Prerequisites

- GNU Make, Node.js/npm compatible with the checked-in Next.js and React versions.
- Network access to install packages, or a usable npm cache. `package-lock.json` is checked in and should be honored by CI or reproducible installs.
- Docker for container build/run targets.

## 2. Setup

Run `make install` from the repository root. It executes `npm install` in `webui/`. For a clean reproducible install, use `cd webui && npm ci` directly when appropriate; that command is not a root Make target.

## 3. Build and compile

- `make build` - run `npm run build` in `webui/` and create the Next.js production bundle.
- `make dev` - start Next.js development mode with hot reload.
- `make docker-build` - delegate to `make -C docker build IMAGE=$(IMAGE) TAG=$(TAG)`.

The local Next.js output is `webui/.next`. Docker image defaults are `IMAGE=joshua-dashboard` and `TAG=latest`; override them, for example, with `make docker-build IMAGE=joshua-dashboard TAG=dev`.

## 4. Test and lint

- `make test` - run `npm test`, which maps to `vitest run`.
- `make lint` - run `npm run lint`, which maps to ESLint.
- `cd webui && npm run type-check` - run the manifest's TypeScript no-emit check; no root Make target currently wraps it.
- `cd webui && npm run test:watch` - optional interactive Vitest watch mode.

These commands are local/static checks and do not verify deployed browser behavior or backend connectivity.

## 5. Packaging and artifacts

`make build` produces the Next.js `.next` build directory. `make docker-build` produces the configured Docker image. The Docker image and its runtime contract are defined by `docker/`; no npm package or archive target is defined in the root Makefile.

## 6. Deployment, install, and run

- `make dev` starts the development server through Next.js.
- `make docker-run` delegates to `make -C docker run IMAGE=$(IMAGE) TAG=$(TAG) PORT=$(PORT)` and runs the production container detached.
- `make docker-logs` tails logs for the selected image/container.
- `make docker-shell` opens a shell in the running container.
- `make docker-stop` stops and removes the selected container.

The default `PORT` is `3010`; override it as needed. Docker is a local/container deployment path; no cloud credentials or remote host deployment target is present in this Makefile. Verify the browser URL and any API/backend configuration manually after startup.

## 7. Cleanup

- `make clean` removes `webui/.next`.
- `make docker-clean` delegates to the Docker Makefile to remove the image using `IMAGE`, `TAG`.
- `make docker-stop` removes a running container before image cleanup.

## 8. Hardware, cloud, and manual verification caveats

This leaf has no hardware-specific build or deployment. Unit tests and lint run without a device, but a production check must exercise the built UI in a browser, including its configured API/OIDC endpoints. Docker availability and image registry access may be required by the container workflow; no cloud deployment is automated here.
