# Duration

A lightweight, fully-typed TypeScript library for working with time durations. Create, manipulate, and format durations with an intuitive, immutable API.

```typescript
import Duration from '@ggviana.eth/duration'

const timer = Duration.fromMinutes(5).and(30, 'seconds')
console.log(timer.toString())  // PT5M30S
console.log(timer)             // Duration { 5m 30s }

const extended = timer.add(Duration.fromSeconds(45))
console.log(extended.toMinutes())  // 6 minutes
```

## Features

- 🔷 **Fully Typed** - Complete TypeScript support with strict mode
- 🎯 **Type-Safe Units** - Prevent runtime errors with compile-time unit validation
- 🔒 **Immutable** - All operations return new instances
- 🌐 **ISO 8601** - Parse and serialize to standard duration format
- 📦 **Dual Format** - Works with ESM and CommonJS
- 🪶 **Zero Dependencies** - Lightweight and self-contained
- ✅ **100% Tested** - Comprehensive test coverage
- 🎨 **Developer Friendly** - Intuitive API with method chaining

## Installation

```bash
npm install @ggviana.eth/duration
```

## Quick Start

```typescript
import Duration from '@ggviana.eth/duration'

// Create durations
const d1 = Duration.fromHours(2)
const d2 = Duration.fromMinutes(30)
const d3 = Duration.of(45, 'seconds')

// Combine durations
const total = d1.add(d2).add(d3)
console.log(total.toString())  // PT2H30M45S

// Parse ISO 8601
const parsed = Duration.parse('P1DT6H30M')
console.log(parsed.toHours())  // 30

// Create from object
const duration = new Duration({
  hours: 1,
  minutes: 30,
  seconds: 45
})
console.log(duration.toSeconds())  // 5445
```

## API Documentation

### Creating Durations

#### Constructor

```typescript
new Duration(milliseconds: number)
new Duration(duration: Duration)
new Duration(object: Partial<DurationLike>)
```

Create a Duration from milliseconds, another Duration (copy), or a duration-like object with optional time components.

```typescript
const d1 = new Duration(5000)  // 5 seconds
const d2 = new Duration(d1)    // Copy
const d3 = new Duration({
  hours: 1,
  minutes: 30,
  seconds: 15
})
```

#### Static Factory Methods

```typescript
Duration.fromMilliseconds(ms: number): Duration
Duration.fromSeconds(seconds: number): Duration
Duration.fromMinutes(minutes: number): Duration
Duration.fromHours(hours: number): Duration
Duration.fromDays(days: number): Duration
Duration.fromWeeks(weeks: number): Duration
```

Create durations from specific time units.

```typescript
const fiveMinutes = Duration.fromMinutes(5)
const oneDay = Duration.fromDays(1)
const twoWeeks = Duration.fromWeeks(2)
```

#### Generic Factory

```typescript
Duration.of(value: number, unit: TimeUnit): Duration
```

Create a duration with any supported time unit. Accepts both singular and plural forms.

```typescript
Duration.of(30, 'second')   // or 'seconds'
Duration.of(5, 'minute')    // or 'minutes'
Duration.of(2, 'hour')      // or 'hours'
Duration.of(1, 'day')       // or 'days'
Duration.of(3, 'week')      // or 'weeks'
```

#### Parsing

```typescript
Duration.parse(isoString: string): Duration
Duration.parseISO8601(isoString: string): Duration
```

Parse an ISO 8601 duration string.

```typescript
Duration.parse('PT1H30M')      // 1 hour 30 minutes
Duration.parse('P1DT2H')       // 1 day 2 hours
Duration.parse('PT30.5S')      // 30.5 seconds
Duration.parse('P7DT3H15M30S') // Complex duration
```

### Arithmetic Operations

#### add()

```typescript
add(other: DurationInput): Duration
```

Add another duration, returning a new Duration.

```typescript
const d1 = Duration.fromMinutes(30)
const d2 = Duration.fromMinutes(15)
const total = d1.add(d2)  // 45 minutes

// Also accepts numbers (milliseconds) or objects
d1.add(30000)  // Add 30 seconds
d1.add({ minutes: 5, seconds: 30 })
```

#### and()

```typescript
and(value: number, unit: TimeUnit): Duration
```

Fluent API for adding time with a specific unit. Perfect for chaining.

```typescript
const time = Duration.fromHours(1)
  .and(30, 'minutes')
  .and(45, 'seconds')

console.log(time.toString())  // PT1H30M45S
```

#### multiply()

```typescript
multiply(factor: number): Duration
```

Scale a duration by a numeric factor.

```typescript
Duration.fromMinutes(5).multiply(3)    // 15 minutes
Duration.fromHours(1).multiply(0.5)   // 30 minutes
Duration.fromSeconds(10).multiply(0)  // 0
```

#### subtract()

```typescript
subtract(other: DurationInput): Duration
```

Subtract another duration. Result bottoms out at zero (no negative durations).

```typescript
const d1 = Duration.fromMinutes(30)
const d2 = Duration.fromMinutes(10)
const remaining = d1.subtract(d2)  // 20 minutes

// Bottoms out at zero
const d3 = d2.subtract(d1)  // 0 (not negative)
```

#### floorTo() / ceilTo()

```typescript
floorTo(unit: TimeUnit): Duration
ceilTo(unit: TimeUnit): Duration
```

Floor or ceil a duration to the nearest unit boundary.

```typescript
Duration.fromSeconds(90).floorTo('minute')  // 1 minute
Duration.fromSeconds(90).ceilTo('minute')   // 2 minutes
Duration.fromMinutes(61).floorTo('hour')    // 1 hour
Duration.fromMinutes(61).ceilTo('hour')     // 2 hours
```

#### roundTo()

```typescript
roundTo(unit: TimeUnit): Duration
```

Round to the nearest time unit.

```typescript
const d = Duration.fromSeconds(90)
d.roundTo('minute')  // 2 minutes

Duration.fromMinutes(25).roundTo('hour')  // 0 hours
Duration.fromMinutes(35).roundTo('hour')  // 1 hour
```

### Comparison Methods

All comparison methods accept `DurationInput` (Duration, number, ISO 8601 string, or partial DurationLike object).

```typescript
compare(other: DurationInput): number
equals(other: DurationInput): boolean
isLessThan(other: DurationInput): boolean
isGreaterThan(other: DurationInput): boolean
isLessThanOrEqual(other: DurationInput): boolean
isGreaterThanOrEqual(other: DurationInput): boolean
isBetween(min: DurationInput, max: DurationInput): boolean
isZero(): boolean
```

**Examples:**

```typescript
const d1 = Duration.fromMinutes(5)
const d2 = Duration.fromSeconds(300)

// Sort an array of durations
durations.sort((a, b) => a.compare(b))

d1.compare(Duration.fromMinutes(10))  // negative (d1 is shorter)
d1.compare(d2)                        // 0 (equal)

d1.equals(d2)              // true
d1.equals('PT5M')          // true (ISO 8601 string)
d1.isLessThan(d2)          // false
d1.isGreaterThan(1000)     // true (1000ms = 1s)
d1.isGreaterThan('PT1S')   // true (string comparison)
d1.isBetween(Duration.fromMinutes(3), Duration.fromMinutes(8))  // true
d1.isBetween(Duration.fromMinutes(6), Duration.fromMinutes(10)) // false

d1.isZero()                // false

Duration.fromMilliseconds(0).isZero()  // true
```

### Conversion Methods

```typescript
toMilliseconds(): number
toSeconds(options?: { exact?: boolean }): number
toMinutes(options?: { exact?: boolean }): number
toHours(options?: { exact?: boolean }): number
toDays(options?: { exact?: boolean }): number
toWeeks(options?: { exact?: boolean }): number
```

By default all methods truncate (floor). Pass `{ exact: true }` to get the fractional value.

**Examples:**

```typescript
const d = Duration.fromMinutes(5).and(30, 'seconds')

d.toMilliseconds()  // 330000
d.toSeconds()       // 330
d.toMinutes()       // 5 (truncated)

Duration.fromMilliseconds(1500).toSeconds({ exact: true })  // 1.5
Duration.fromSeconds(90).toMinutes({ exact: true })         // 1.5
Duration.fromMinutes(90).toHours({ exact: true })           // 1.5
Duration.fromHours(36).toDays({ exact: true })              // 1.5
```

#### toObject()

```typescript
toObject(): DurationLike
```

Break down the duration into its component parts.

```typescript
const d = Duration.parse('P1DT2H30M45.5S')
console.log(d.toObject())
// {
//   weeks: 0,
//   days: 1,
//   hours: 2,
//   minutes: 30,
//   seconds: 45,
//   milliseconds: 500
// }
```

#### toJSON()

```typescript
toJSON(): DurationLike
```

Returns the same as `toObject()` for JSON serialization.

```typescript
const d = Duration.fromMinutes(5)
JSON.stringify(d)
// {"weeks":0,"days":0,"hours":0,"minutes":5,"seconds":0,"milliseconds":0}
```

### Serialization

#### toString()

```typescript
toString(): string
```

Convert to ISO 8601 duration format.

```typescript
Duration.fromHours(1).toString()          // PT1H
Duration.fromMinutes(30).toString()       // PT30M
Duration.fromDays(1).and(2, 'hours').toString()  // P1DT2H

// Supports decimal seconds
Duration.fromMilliseconds(1500).toString()  // PT1.5S

// Zero duration
new Duration(0).toString()  // PT0S
```

#### Custom Inspect

Durations have a custom `console.log()` format for better debugging.

```typescript
const d = Duration.fromWeeks(2)
  .and(3, 'days')
  .and(5, 'hours')
  .and(30, 'minutes')

console.log(d)  // Duration { 2w 3d 5h 30m }
```

### Utility Methods

#### ratio()

```typescript
ratio(other: DurationInput): number
```

Return this duration as a fraction of another. Useful for progress bars and animations.

```typescript
Duration.fromMinutes(30).ratio(Duration.fromHours(1))    // 0.5
Duration.fromSeconds(45).ratio(Duration.fromMinutes(1))  // 0.75
Duration.fromMinutes(10).ratio(Duration.fromMinutes(5))  // 2 (over 100%)

// Progress bar example
const progress = elapsed.ratio(total)  // 0.0 – 1.0
```

#### sleep()

```typescript
sleep(): Promise<void>
```

Return a promise that resolves after the duration has elapsed. Great for scripts, retries with backoff, and tests.

```typescript
await Duration.fromSeconds(2).sleep()  // Pause for 2 seconds

// Retry with growing delay
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    return await doWork()
  } catch {
    await Duration.fromSeconds(1).multiply(attempt).sleep()
  }
}
```

#### toAbortSignal()

```typescript
toAbortSignal(): AbortSignal
```

Create an `AbortSignal` that aborts once the duration has elapsed — a readable wrapper around `AbortSignal.timeout()`. The signal aborts with a `TimeoutError`.

```typescript
// Abort a fetch that takes longer than 5 seconds
const response = await fetch(url, {
  signal: Duration.fromSeconds(5).toAbortSignal()
})
```

#### clamp()

```typescript
clamp(min: DurationInput, max: DurationInput): Duration
```

Clamp a duration to a [min, max] range. Returns `min` if below, `max` if above, or `this` if within bounds.

```typescript
Duration.fromSeconds(120).clamp(Duration.fromSeconds(1), Duration.fromMinutes(1))
// Duration.fromMinutes(1) — capped at max

Duration.fromMilliseconds(50).clamp(Duration.fromSeconds(1), Duration.fromMinutes(1))
// Duration.fromSeconds(1) — raised to min

Duration.fromSeconds(30).clamp(Duration.fromSeconds(1), Duration.fromMinutes(1))
// Duration.fromSeconds(30) — unchanged
```

#### Duration.min()

```typescript
Duration.min(a: DurationInput, b: DurationInput): Duration
```

Return the smaller of two durations.

```typescript
const min = Duration.min(
  Duration.fromMinutes(5),
  Duration.fromMinutes(10)
)
console.log(min.toMinutes())  // 5
```

#### Duration.max()

```typescript
Duration.max(a: DurationInput, b: DurationInput): Duration
```

Return the larger of two durations.

```typescript
const max = Duration.max(
  Duration.fromMinutes(5),
  Duration.fromMinutes(10)
)
console.log(max.toMinutes())  // 10
```

#### Duration.sum()

```typescript
Duration.sum(durations: DurationInput[]): Duration
```

Sum an array of durations into one.

```typescript
const laps = [Duration.fromSeconds(62), Duration.fromSeconds(58), Duration.fromSeconds(61)]
Duration.sum(laps).toSeconds()  // 181

Duration.sum([])  // Duration of 0
```

#### Duration.isDuration()

```typescript
Duration.isDuration(obj: unknown): obj is Duration | Partial<DurationLike> | string
```

Type guard to check if a value is a Duration, duration-like object, or valid ISO 8601 duration string.

```typescript
Duration.isDuration(Duration.fromMinutes(5))  // true
Duration.isDuration({ hours: 1, minutes: 30 })  // true
Duration.isDuration('PT1H30M')  // true
Duration.isDuration('P1D')  // true
Duration.isDuration({ invalid: 'object' })  // false
Duration.isDuration('invalid string')  // false
Duration.isDuration(null)  // false
```

## TypeScript Support

Duration is written in TypeScript and includes full type definitions.

### Type Exports

```typescript
import Duration, {
  type DurationLike,
  type TimeUnit,
  type DurationInput,
  type ConversionOptions
} from '@ggviana.eth/duration'
```

### Type Definitions

```typescript
// Supported time units (singular and plural)
type TimeUnit =
  | 'millisecond' | 'milliseconds'
  | 'second' | 'seconds'
  | 'minute' | 'minutes'
  | 'hour' | 'hours'
  | 'day' | 'days'
  | 'week' | 'weeks'

// Duration object with all time components
// Used for toObject()/toJSON() and as Partial<DurationLike> for construction
interface DurationLike {
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

// Accepted input types for Duration methods
type DurationInput = number | string | Duration | Partial<DurationLike>

// Options for unit conversion methods (toSeconds, toMinutes, etc.)
type ConversionOptions = { exact?: boolean }
```

### Type Safety Examples

```typescript
// Type-safe unit parameter
const d1 = Duration.of(5, 'minutes')  // ✓
const d2 = Duration.of(5, 'years')    // ✗ TypeScript error

// Type-safe object construction
const d3: Partial<DurationLike> = {
  hours: 1,
  minutes: 30,
  invalid: 'field'  // ✗ TypeScript error
}

// Type guard usage
function processDuration(input: unknown) {
  if (Duration.isDuration(input)) {
    // input is now typed as Duration | Partial<DurationLike>
    const duration = Duration.toDuration(input)
    console.log(duration.toMinutes())
  }
}
```

## Practical Examples

### Timer / Countdown

```typescript
const countdown = Duration.fromMinutes(5)
let remaining = countdown

const interval = setInterval(() => {
  remaining = remaining.subtract(Duration.fromSeconds(1))

  console.log(remaining)  // Duration { 4m 59s }, { 4m 58s }, ...

  if (remaining.isZero()) {
    console.log('Time is up!')
    clearInterval(interval)
  }
}, 1000)
```

### Calculate Time Difference

```typescript
const start = Date.now()
// ... some operation ...
const end = Date.now()

const elapsed = new Duration(end - start)
console.log(`Operation took ${elapsed.toSeconds()} seconds`)
```

### Work Session Tracker

```typescript
const workSession = Duration.fromHours(8)
  .subtract(Duration.fromMinutes(30))  // Lunch break
  .subtract(Duration.fromMinutes(15))  // Coffee break

const breaks = Duration.fromMinutes(45)
const actualWork = workSession.subtract(breaks)

console.log(`Actual work time: ${actualWork.toHours()} hours`)
```

### Video Duration Formatting

```typescript
function formatVideoDuration(ms: number): string {
  const d = new Duration(ms)
  const parts = d.toObject()

  if (parts.hours > 0) {
    return `${parts.hours}:${pad(parts.minutes)}:${pad(parts.seconds)}`
  }
  return `${parts.minutes}:${pad(parts.seconds)}`
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

console.log(formatVideoDuration(125000))  // "2:05"
console.log(formatVideoDuration(3725000)) // "1:02:05"
```

### SLA / Deadline Calculations

```typescript
const slaResponse = Duration.fromHours(4)
const slaResolution = Duration.fromDays(1)

const incidentReceived = new Date('2024-01-01T09:00:00Z')
const responseDeadline = new Date(
  incidentReceived.getTime() + slaResponse.toMilliseconds()
)
const resolutionDeadline = new Date(
  incidentReceived.getTime() + slaResolution.toMilliseconds()
)

console.log(`Must respond by: ${responseDeadline}`)
console.log(`Must resolve by: ${resolutionDeadline}`)
```

### Rate Limiting

```typescript
const rateLimitWindow = Duration.fromMinutes(1)
const maxRequests = 100

class RateLimiter {
  private requests: number[] = []

  canMakeRequest(): boolean {
    const now = Date.now()
    const windowStart = now - rateLimitWindow.toMilliseconds()

    // Remove old requests
    this.requests = this.requests.filter(t => t > windowStart)

    return this.requests.length < maxRequests
  }

  recordRequest(): void {
    this.requests.push(Date.now())
  }
}
```

## Constants

Duration provides constants for all time units:

```typescript
Duration.Units.Millisecond  // 1
Duration.Units.Second       // 1000
Duration.Units.Minute       // 60000
Duration.Units.Hour         // 3600000
Duration.Units.Day          // 86400000
Duration.Units.Week         // 604800000
```

## Immutability

All Duration operations return new instances. The original is never modified.

```typescript
const original = Duration.fromMinutes(10)
const doubled = original.add(original)
const halved = original.subtract(Duration.fromMinutes(5))

console.log(original.toMinutes())  // 10 (unchanged)
console.log(doubled.toMinutes())   // 20
console.log(halved.toMinutes())    // 5
```

## Development

### Setup

```bash
npm install
```

### Available Scripts

- `npm run build` - Build ESM/CJS bundles with type declarations
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix linting errors automatically
- `npm run type-check` - Run TypeScript type checking

### Testing

Tests are written with Vitest and achieve 100% code coverage.

```bash
npm test
npm run test:coverage
```

### Building

The build produces both ESM and CommonJS outputs with TypeScript declarations:

```bash
npm run build
```

Output files:
- `dist/index.js` - ESM module
- `dist/index.cjs` - CommonJS module
- `dist/index.d.ts` - TypeScript declarations (ESM)
- `dist/index.d.cts` - TypeScript declarations (CJS)

## Browser Support

Duration works in all modern browsers and Node.js environments that support:
- ES2022
- Private class fields (`#field`)

**Minimum versions:**
- Node.js 20+
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

## License

MIT

## Contributing

Contributions are welcome! Please ensure:
- Tests pass (`npm test`)
- Linting passes (`npm run lint`)
- Type checking passes (`npm run type-check`)
- Add tests for new features
- Update documentation as needed

---

Made with ❤️ by the Duration team
