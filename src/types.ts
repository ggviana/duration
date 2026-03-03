// Time unit type for type-safe unit parameters
export type TimeUnit =
  | 'millisecond' | 'milliseconds'
  | 'second' | 'seconds'
  | 'minute' | 'minutes'
  | 'hour' | 'hours'
  | 'day' | 'days'
  | 'week' | 'weeks'

// Duration object representation (complete breakdown of duration parts)
export interface DurationLike {
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export interface DurationFormatOptions {
  style?: 'long' | 'short' | 'narrow' | 'digital'
  localeMatcher?: 'best fit' | 'lookup'
}

export type IntlDurationFormatCtor = new (
  locale?: string | string[],
  options?: DurationFormatOptions
) => { format(duration: Partial<DurationLike>): string }
