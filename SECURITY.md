# Security Policy

## Supported Versions

This is an application, not a library with multiple maintained release
lines. Only the latest code on the `main` branch is supported; please make
sure you can reproduce an issue there before reporting it.

## Reporting a Vulnerability

Please **do not** open a public issue for security vulnerabilities.

Instead, use GitHub's private vulnerability reporting:

1. Go to the [Security tab](https://github.com/k07g/career-sheet/security)
   of this repository.
2. Click **"Report a vulnerability"** to open a private advisory.

This lets us discuss and fix the issue before it's publicly disclosed.

When reporting, please include:

- A description of the vulnerability and its potential impact
- Steps to reproduce, or a proof of concept if possible
- The affected commit/branch

This is a personal project maintained on a best-effort basis, so there's no
guaranteed response time, but reports will be acknowledged as soon as
possible and a fix will be prioritized for confirmed issues.

## Scope

This project is currently a client-side Next.js application: all entered
data is stored locally in the browser (`localStorage`) and nothing is sent
to a backend. Reports about the app itself, its build/CI pipeline, or its
dependencies are all welcome.
