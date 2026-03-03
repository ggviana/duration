import type { TimeUnit, DurationLike, DurationFormatOptions, IntlDurationFormatCtor } from './types'

export type { TimeUnit, DurationLike }

// Duration constructor input type
export type DurationInput = number | string | Duration | Partial<DurationLike>

export default class Duration {
  /* Private field holding milliseconds */
  readonly #milliseconds: number

  static readonly Units = {
    Millisecond: 1,
    Second: 1000,
    Minute: 60000,
    Hour: 3600000,
    Day: 86400000,
    Week: 604800000
  } as const

  /**
   * Construct a Duration from milliseconds, another Duration, or a breakdown object.
   * @param {number|Duration|Object} input - Value to construct from.
   * @param {number} [input.weeks=0] - Number of weeks (if object).
   * @param {number} [input.days=0] - Number of days (if object).
   * @param {number} [input.hours=0] - Number of hours (if object).
   * @param {number} [input.minutes=0] - Number of minutes (if object).
   * @param {number} [input.seconds=0] - Number of seconds (if object).
   * @param {number} [input.milliseconds=0] - Number of milliseconds (if object).
   * @throws {TypeError} If input is not a number, Duration, or valid object.
   */
  constructor (input: DurationInput) {
    if (typeof input === 'number') {
      this.#milliseconds = input
    } else if (input instanceof Duration) {
      this.#milliseconds = input.toMilliseconds()
    } else {
      // Convert object to Duration via toDuration and copy its milliseconds
      const converted = Duration.toDuration(input)
      this.#milliseconds = converted.toMilliseconds()
    }
  }

  /**
   * Normalize and validate a time unit string, returning the unit value.
   * @param {string} unit - Time unit to normalize.
   * @returns {number} Unit value in milliseconds.
   * @throws {TypeError} If unit is invalid.
   */
  static getTimeUnit (unit: TimeUnit): number {
    const normalized = unit.toLowerCase()
    // Remove trailing 's' to handle both singular and plural
    const singular = normalized.replace(/s$/, '').replace(/^./, c => c.toUpperCase())

    if (!Duration.Units[singular as keyof typeof Duration.Units]) {
      throw new TypeError(
        `Invalid unit "${unit}". Use 'milliseconds', 'seconds', 'minutes', 'hours', 'days' or 'weeks'.`
      )
    }

    return Duration.Units[singular as keyof typeof Duration.Units]
  }

  /**
   * Create a Duration from milliseconds.
   * @param {number} ms - Milliseconds.
   * @returns {Duration}
   */
  static fromMilliseconds (ms: number): Duration {
    return new Duration(ms)
  }

  /**
   * Create a Duration from seconds.
   * @param {number} sec - Seconds.
   * @returns {Duration}
   */
  static fromSeconds (sec: number): Duration {
    return new Duration(sec * Duration.Units.Second)
  }

  /**
   * Create a Duration from minutes.
   * @param {number} min - Minutes.
   * @returns {Duration}
   */
  static fromMinutes (min: number): Duration {
    return new Duration(min * Duration.Units.Minute)
  }

  /**
   * Create a Duration from hours.
   * @param {number} hr - Hours.
   * @returns {Duration}
   */
  static fromHours (hr: number): Duration {
    return new Duration(hr * Duration.Units.Hour)
  }

  /**
   * Create a Duration from days.
   * @param {number} days - Days.
   * @returns {Duration}
   */
  static fromDays (days: number): Duration {
    return new Duration(days * Duration.Units.Day)
  }

  /**
   * Create a Duration from weeks.
   * @param {number} weeks - Weeks.
   * @returns {Duration}
   */
  static fromWeeks (weeks: number): Duration {
    return new Duration(weeks * Duration.Units.Week)
  }

  /**
   * Generic factory to create a Duration.
   * @param {number} value - Numeric value of the duration.
   * @param {'millisecond'|'milliseconds'|'second'|'seconds'|'minute'|'minutes'|'hour'|'hours'|'day'|'days'|'week'|'weeks'} unit - Time unit.
   * @returns {Duration}
   * @throws {TypeError} If the unit is invalid.
   * @example
   * const d1 = Duration.of(5, 'minute');
   * const d2 = Duration.of(1, 'day');
   */
  static of (value: number, unit: TimeUnit): Duration {
    const unitValue = Duration.getTimeUnit(unit)
    return new Duration(value * unitValue)
  }

  /**
   * Parse an ISO 8601 duration string.
   * @param {string} isoString - ISO 8601 duration string (e.g., "PT1H30M", "P1DT2H", "PT30S").
   * @returns {Duration}
   * @throws {TypeError} If the string is invalid or not a string.
   * @example
   * Duration.parse('PT1H30M') // 1 hour 30 minutes
   * Duration.parse('P1DT2H') // 1 day 2 hours
   * Duration.parse('PT30.5S') // 30.5 seconds
   */
  static parseISO8601 (isoString: string): Duration {
    if (typeof isoString !== 'string') {
      throw new TypeError('Input must be a string')
    }

    const match = isoString.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/)
    if (!match) {
      throw new TypeError(`Invalid ISO 8601 duration string: "${isoString}"`)
    }

    const days = parseInt(match[1] || '0', 10)
    const hours = parseInt(match[2] || '0', 10)
    const minutes = parseInt(match[3] || '0', 10)
    const totalSeconds = parseFloat(match[4] || '0')
    const seconds = Math.floor(totalSeconds)
    const milliseconds = Math.round((totalSeconds - seconds) * Duration.Units.Second)

    const ms =
      days * Duration.Units.Day +
      hours * Duration.Units.Hour +
      minutes * Duration.Units.Minute +
      seconds * Duration.Units.Second +
      milliseconds

    return new Duration(ms)
  }

  /**
   * Alias for parseISO8601.
   * @param {string} isoString - ISO 8601 duration string.
   * @returns {Duration}
   */
  static parse (isoString: string): Duration {
    return Duration.parseISO8601(isoString)
  }

  /**
   * Create a Duration representing the absolute difference between two dates.
   * @param {Date} a - First date.
   * @param {Date} b - Second date.
   * @returns {Duration}
   */
  static between (a: Date, b: Date): Duration {
    return new Duration(Math.abs(b.getTime() - a.getTime()))
  }

  /**
   * Return the smaller of two durations.
   * @param {Duration|Object|number} a
   * @param {Duration|Object|number} b
   * @returns {Duration}
   */
  static min (a: DurationInput, b: DurationInput): Duration {
    const aDur = Duration.toDuration(a)
    const bDur = Duration.toDuration(b)
    return aDur.toMilliseconds() <= bDur.toMilliseconds() ? aDur : bDur
  }

  /**
   * Return the larger of two durations.
   * @param {Duration|Object|number} a
   * @param {Duration|Object|number} b
   * @returns {Duration}
   */
  static max (a: DurationInput, b: DurationInput): Duration {
    const aDur = Duration.toDuration(a)
    const bDur = Duration.toDuration(b)
    return aDur.toMilliseconds() >= bDur.toMilliseconds() ? aDur : bDur
  }

  /**
   * Determine if an object is a Duration, duration-like, or parseable duration string.
   * @param {*} obj - Object to test.
   * @returns {boolean} True if instance of Duration, has valid duration parts, or is a valid ISO 8601 duration string.
   */
  static isDuration (obj: unknown): obj is Duration | Partial<DurationLike> | string {
    if (obj instanceof Duration) return true

    // Check if it's a parseable duration string
    if (typeof obj === 'string') {
      try {
        Duration.parseISO8601(obj)
        return true
      } catch {
        return false
      }
    }

    if (!obj || typeof obj !== 'object') return false
    const keys = ['weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds']
    // Check if at least one key exists and all present keys are numbers
    const objRecord = obj as Record<string, unknown>
    const hasAtLeastOneKey = keys.some(k => k in objRecord)
    const allPresentKeysAreNumbers = keys.every(k =>
      !(k in objRecord) || typeof objRecord[k] === 'number'
    )
    return hasAtLeastOneKey && allPresentKeysAreNumbers
  }

  /**
   * Normalize any valid input to a Duration instance.
   * @param {Duration|Object|number|string} value - A Duration, an DurationLike object, milliseconds, or ISO 8601 string.
   * @returns {Duration}
   * @throws {TypeError} If `value` cannot be parsed into a Duration.
   * @private
   */
  static toDuration (value: DurationInput): Duration {
    if (value instanceof Duration) {
      return value
    } else if (typeof value === 'number') {
      return new Duration(value)
    } else if (typeof value === 'string') {
      return Duration.parseISO8601(value)
    } else if (Duration.isDuration(value)) {
      const {
        weeks = 0,
        days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0,
        milliseconds = 0
      } = value
      const ms =
        weeks * Duration.Units.Week +
        days * Duration.Units.Day +
        hours * Duration.Units.Hour +
        minutes * Duration.Units.Minute +
        seconds * Duration.Units.Second +
        milliseconds
      return new Duration(ms)
    }

    throw new TypeError('Invalid constructor argument. Provide a number, another Duration, an ISO 8601 duration string, or an object with weeks, days, hours, minutes, seconds, and/or milliseconds.')
  }

  /**
   * Add another duration.
   * @param {Duration|Object|number} other - A Duration, an DurationLike object, or raw milliseconds.
   * @returns {Duration} New Duration representing the sum.
   */
  add (other: DurationInput): Duration {
    const ms = this.toMilliseconds() + Duration.toDuration(other).toMilliseconds()
    return new Duration(ms)
  }

  /**
   * Add a duration by specifying value and unit.
   * Convenience method combining of() and add().
   * @param {number} value - Numeric value to add.
   * @param {'millisecond'|'milliseconds'|'second'|'seconds'|'minute'|'minutes'|'hour'|'hours'|'day'|'days'|'week'|'weeks'} unit - Time unit.
   * @returns {Duration} New Duration with the added time.
   * @throws {TypeError} If the unit is invalid.
   * @example
   * Duration.fromMinutes(5).and(30, 'seconds') // 5 minutes 30 seconds
   * Duration.fromHours(1).and(30, 'minutes').and(15, 'seconds') // 1h 30m 15s
   */
  and (value: number, unit: TimeUnit): Duration {
    return this.add(Duration.of(value, unit))
  }

  /**
   * Subtract another duration, bottoming out at zero.
   * @param {Duration|Object|number} other - A Duration, an DurationLike object, or raw milliseconds.
   * @returns {Duration} New Duration representing the non-negative difference.
   */
  subtract (other: DurationInput): Duration {
    const diff = this.toMilliseconds() - Duration.toDuration(other).toMilliseconds()
    return new Duration(diff > 0 ? diff : 0)
  }

  /**
   * Round this duration to the nearest unit.
   * @param {'millisecond'|'milliseconds'|'second'|'seconds'|'minute'|'minutes'|'hour'|'hours'|'day'|'days'|'week'|'weeks'} unit - Time unit to round to.
   * @returns {Duration} New Duration rounded to the specified unit.
   * @throws {TypeError} If the unit is invalid.
   * @example
   * Duration.fromSeconds(90).roundTo('minute') // 2 minutes
   * Duration.fromMinutes(25).roundTo('hour') // 0 hours
   * Duration.fromMinutes(35).roundTo('hour') // 1 hour
   */
  roundTo (unit: TimeUnit): Duration {
    const divisor = Duration.getTimeUnit(unit)
    return new Duration(Math.round(this.#milliseconds / divisor) * divisor)
  }

  /**
   * Check equality with another duration.
   * @param {Duration|Object|number} other - A Duration, an DurationLike object, or raw milliseconds.
   * @returns {boolean} True if equal.
   */
  equals (other: DurationInput): boolean {
    return this.#compare(other) === 0
  }

  /**
   * Check if this duration is less than another.
   * @param {Duration|Object|number} other - A Duration, an DurationLike object, or raw milliseconds.
   * @returns {boolean} True if less than.
   */
  isLessThan (other: DurationInput): boolean {
    return this.#compare(other) < 0
  }

  /**
   * Check if this duration is greater than another.
   * @param {Duration|Object|number} other - A Duration, an DurationLike object, or raw milliseconds.
   * @returns {boolean} True if greater than.
   */
  isGreaterThan (other: DurationInput): boolean {
    return this.#compare(other) > 0
  }

  /**
   * Check if this duration is less than or equal to another.
   * @param {Duration|Object|number} other - A Duration, an DurationLike object, or raw milliseconds.
   * @returns {boolean} True if less than or equal.
   */
  isLessThanOrEqual (other: DurationInput): boolean {
    return this.#compare(other) <= 0
  }

  /**
   * Check if this duration is greater than or equal to another.
   * @param {Duration|Object|number} other - A Duration, an DurationLike object, or raw milliseconds.
   * @returns {boolean} True if greater than or equal.
   */
  isGreaterThanOrEqual (other: DurationInput): boolean {
    return this.#compare(other) >= 0
  }

  /**
   * Check if this duration is zero.
   * @returns {boolean} True if duration is zero.
   */
  isZero (): boolean {
    return this.#milliseconds === 0
  }

  /**
   * Convert the instance to total milliseconds.
   * @returns {number}
   */
  toMilliseconds (): number {
    return this.#milliseconds
  }

  /**
   * Convert the instance to total seconds.
   * @returns {number}
   */
  toSeconds (): number {
    return Math.floor(this.#milliseconds / Duration.Units.Second)
  }

  /**
   * Convert the instance to total minutes.
   * @returns {number}
   */
  toMinutes (): number {
    return Math.floor(this.#milliseconds / Duration.Units.Minute)
  }

  /**
   * Convert the instance to total hours.
   * @returns {number}
   */
  toHours (): number {
    return Math.floor(this.#milliseconds / Duration.Units.Hour)
  }

  /**
   * Convert the instance to total days.
   * @returns {number}
   */
  toDays (): number {
    return Math.floor(this.#milliseconds / Duration.Units.Day)
  }

  /**
   * Convert the instance to total weeks.
   * @returns {number}
   */
  toWeeks (): number {
    return Math.floor(this.#milliseconds / Duration.Units.Week)
  }

  /**
   * Break down duration into components.
   * @returns {{weeks: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number}}
   */
  toObject (): DurationLike {
    let rem = this.#milliseconds
    const weeks = Math.floor(rem / Duration.Units.Week)
    rem -= weeks * Duration.Units.Week
    const days = Math.floor(rem / Duration.Units.Day)
    rem -= days * Duration.Units.Day
    const hours = Math.floor(rem / Duration.Units.Hour)
    rem -= hours * Duration.Units.Hour
    const minutes = Math.floor(rem / Duration.Units.Minute)
    rem -= minutes * Duration.Units.Minute
    const seconds = Math.floor(rem / Duration.Units.Second)
    rem -= seconds * Duration.Units.Second
    return { weeks, days, hours, minutes, seconds, milliseconds: rem }
  }

  /**
   * Return JSON representation of duration.
   * @returns {{weeks: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number}}
   */
  toJSON (): DurationLike {
    return this.toObject()
  }

  /**
   * Return ISO 8601 duration string.
   * @returns {string}
   */
  toString (): string {
    const { weeks, days, hours, milliseconds, minutes, seconds } = this.toObject()

    // Handle zero duration specially
    if (weeks === 0 && days === 0 && hours === 0 && minutes === 0 && seconds === 0 && milliseconds === 0) {
      return 'PT0S'
    }

    // Convert weeks to days for ISO 8601 (standard practice)
    const totalDays = weeks * 7 + days

    let str = 'P'
    if (totalDays) str += `${totalDays}D`
    if (hours || minutes || seconds || milliseconds) str += 'T'
    if (hours) str += `${hours}H`
    if (minutes) str += `${minutes}M`
    if (seconds || milliseconds) {
      const sec = seconds + milliseconds / 1000
      str += `${sec}S`
    }
    return str
  }

  toLocaleString (locale?: string | string[], options?: DurationFormatOptions): string {
    const obj = this.toObject()
    const Ctor = (Intl as { DurationFormat?: IntlDurationFormatCtor }).DurationFormat
    if (typeof Ctor === 'function') {
      return new Ctor(locale, options).format(obj)
    }
    // English-only fallback
    const parts: string[] = []
    const add = (value: number, singular: string, plural: string) => {
      if (value === 0) return
      parts.push(`${value} ${value === 1 ? singular : plural}`)
    }
    add(obj.weeks, 'week', 'weeks')
    add(obj.days, 'day', 'days')
    add(obj.hours, 'hour', 'hours')
    add(obj.minutes, 'minute', 'minutes')
    add(obj.seconds, 'second', 'seconds')
    add(obj.milliseconds, 'millisecond', 'milliseconds')
    return parts.length > 0 ? parts.join(', ') : '0 seconds'
  }

  /**
   * Returns a human-readable string for console output.
   * Works in both Node.js and browsers.
   * @returns e.g. "Duration { 2w 3d 5h 30m }"
   */
  toConsole (): string {
    const { weeks, days, hours, minutes, seconds, milliseconds } = this.toObject()

    const parts: string[] = []

    if (weeks > 0) parts.push(`${weeks}w`)
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (seconds > 0 || milliseconds > 0) {
      const totalSeconds = seconds + milliseconds / 1000
      parts.push(`${totalSeconds}s`)
    }

    const duration = parts.length > 0 ? parts.join(' ') : '0s'
    return `Duration { ${duration} }`
  }

  /**
   * Compare this duration with another.
   * @param {Duration|Object|number} other - A Duration, an DurationLike object, or raw milliseconds.
   * @returns {number} Negative if less, 0 if equal, positive if greater.
   * @private
   */
  #compare (other: DurationInput): number {
    return this.toMilliseconds() - Duration.toDuration(other).toMilliseconds()
  }

  /**
   * Returns the primitive value of the duration in milliseconds.
   * Enables implicit numeric coercion (e.g., duration + 5000, +duration).
   * @returns {number}
   */
  valueOf (): number {
    return this.#milliseconds
  }

  /**
   * Controls primitive coercion based on the hint.
   * - 'string': returns ISO 8601 string (e.g., "PT2S")
   * - 'number' / 'default': returns total milliseconds
   * @param {'number'|'string'|'default'} hint - The coercion hint.
   * @returns {number|string}
   */
  [Symbol.toPrimitive] (hint: string): number | string {
    if (hint === 'string') return this.toString()
    return this.#milliseconds
  }

  /** Node.js console.log() hook — delegates to toConsole(). */
  [Symbol.for('nodejs.util.inspect.custom')] (): string {
    return this.toConsole()
  }

  * [Symbol.iterator] (): Generator<number> {
    const { weeks, days, hours, minutes, seconds, milliseconds } = this.toObject()
    yield weeks
    yield days
    yield hours
    yield minutes
    yield seconds
    yield milliseconds
  }
}
