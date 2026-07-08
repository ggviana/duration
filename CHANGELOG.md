# duration

## 0.1.12

### Patch Changes

- Human-readable duration string parsing: new `Duration.parseHuman()` understands strings like `'1h 30m'`, `'90 seconds'`, `'1.5 days'`, `'1 hour and 30 minutes'`, and bare numbers as milliseconds. `Duration.parse()` now accepts both ISO 8601 and human-readable strings, and human strings work anywhere a `DurationInput` is expected
- Timer helpers: `duration.sleep()` returns a promise that resolves after the duration, with optional cancellation via `sleep({ signal })` (rejects with the abort reason and clears the pending timer); `duration.toAbortSignal()` wraps `AbortSignal.timeout()` for use with `fetch()` and other abortable APIs
- `Duration.ZERO`: shared immutable zero-length instance, useful as a default value or reduce seed
- `divide(divisor)`: inverse of `multiply()`, throws `RangeError` on division by zero
- New exported type: `SleepOptions`

## 0.1.0

### Initial Release

- TypeScript library boilerplate
- Build configuration with tsup (ESM/CJS)
- Testing with Vitest
- Linting with ESLint and neostandard
- Pre-commit hooks with husky and lint-staged
- CI/CD with GitHub Actions
- Versioning with changesets
