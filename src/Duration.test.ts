import { describe, it, expect } from 'vitest'
import Duration, { type DurationLike } from './index'

describe('Duration', () => {
  describe('Constructor', () => {
    it('should create Duration from number (milliseconds)', () => {
      const d = new Duration(5000)
      expect(d.toMilliseconds()).toBe(5000)
    })

    it('should create Duration from another Duration (copy)', () => {
      const d1 = Duration.fromMinutes(5)
      const d2 = new Duration(d1)
      expect(d2.toMilliseconds()).toBe(d1.toMilliseconds())
      expect(d2).not.toBe(d1) // Should be a different instance
    })

    it('should create Duration from DurationLike object', () => {
      const d = new Duration({ hours: 1, minutes: 30, seconds: 45 })
      expect(d.toMilliseconds()).toBe(5445000)
    })

    it('should create Duration from DurationLike with all fields', () => {
      const d = new Duration({
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4,
        milliseconds: 500
      })
      const expected =
        1 * 86400000 + // 1 day
        2 * 3600000 +  // 2 hours
        3 * 60000 +    // 3 minutes
        4 * 1000 +     // 4 seconds
        500            // 500 ms
      expect(d.toMilliseconds()).toBe(expected)
    })

    it('should throw TypeError for invalid input', () => {
      expect(() => new Duration('invalid' as any)).toThrow(TypeError)
      expect(() => new Duration(null as any)).toThrow(TypeError)
      expect(() => new Duration(undefined as any)).toThrow(TypeError)
    })
  })

  describe('Static Factory Methods', () => {
    it('should create Duration from milliseconds', () => {
      const d = Duration.fromMilliseconds(1500)
      expect(d.toMilliseconds()).toBe(1500)
    })

    it('should create Duration from seconds', () => {
      const d = Duration.fromSeconds(30)
      expect(d.toMilliseconds()).toBe(30000)
    })

    it('should create Duration from minutes', () => {
      const d = Duration.fromMinutes(5)
      expect(d.toMilliseconds()).toBe(300000)
    })

    it('should create Duration from hours', () => {
      const d = Duration.fromHours(2)
      expect(d.toMilliseconds()).toBe(7200000)
    })

    it('should create Duration from days', () => {
      const d = Duration.fromDays(1)
      expect(d.toMilliseconds()).toBe(86400000)
    })

    it('should create Duration from weeks', () => {
      const d = Duration.fromWeeks(1)
      expect(d.toMilliseconds()).toBe(604800000)
    })

    it('should create Duration using of() with singular units', () => {
      expect(Duration.of(5, 'second').toMilliseconds()).toBe(5000)
      expect(Duration.of(3, 'minute').toMilliseconds()).toBe(180000)
      expect(Duration.of(2, 'hour').toMilliseconds()).toBe(7200000)
      expect(Duration.of(1, 'day').toMilliseconds()).toBe(86400000)
      expect(Duration.of(1, 'week').toMilliseconds()).toBe(604800000)
    })

    it('should create Duration using of() with plural units', () => {
      expect(Duration.of(5, 'seconds').toMilliseconds()).toBe(5000)
      expect(Duration.of(3, 'minutes').toMilliseconds()).toBe(180000)
      expect(Duration.of(2, 'hours').toMilliseconds()).toBe(7200000)
      expect(Duration.of(1, 'days').toMilliseconds()).toBe(86400000)
      expect(Duration.of(1, 'weeks').toMilliseconds()).toBe(604800000)
    })

    it('should throw TypeError for invalid unit in of()', () => {
      expect(() => Duration.of(5, 'invalid' as any)).toThrow(TypeError)
      expect(() => Duration.of(5, 'invalid' as any)).toThrow(/Invalid unit/)
    })
  })

  describe('Static Utility Methods', () => {
    describe('getTimeUnit()', () => {
      it('should return correct unit values for singular forms', () => {
        expect(Duration.getTimeUnit('millisecond')).toBe(1)
        expect(Duration.getTimeUnit('second')).toBe(1000)
        expect(Duration.getTimeUnit('minute')).toBe(60000)
        expect(Duration.getTimeUnit('hour')).toBe(3600000)
        expect(Duration.getTimeUnit('day')).toBe(86400000)
        expect(Duration.getTimeUnit('week')).toBe(604800000)
      })

      it('should return correct unit values for plural forms', () => {
        expect(Duration.getTimeUnit('milliseconds')).toBe(1)
        expect(Duration.getTimeUnit('seconds')).toBe(1000)
        expect(Duration.getTimeUnit('minutes')).toBe(60000)
        expect(Duration.getTimeUnit('hours')).toBe(3600000)
        expect(Duration.getTimeUnit('days')).toBe(86400000)
        expect(Duration.getTimeUnit('weeks')).toBe(604800000)
      })

      it('should throw TypeError for invalid unit', () => {
        expect(() => Duration.getTimeUnit('invalid' as any)).toThrow(TypeError)
        expect(() => Duration.getTimeUnit('year' as any)).toThrow(/Invalid unit/)
      })
    })

    describe('min()', () => {
      it('should return the smaller duration', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(10)
        const result = Duration.min(d1, d2)
        expect(result.toMilliseconds()).toBe(d1.toMilliseconds())
      })

      it('should return b when b is smaller', () => {
        const result = Duration.min(Duration.fromMinutes(10), Duration.fromMinutes(5))
        expect(result.toMinutes()).toBe(5)
      })

      it('should work with DurationInput types', () => {
        const result = Duration.min(5000, Duration.fromSeconds(10))
        expect(result.toMilliseconds()).toBe(5000)
      })

      it('should work with DurationLike objects', () => {
        const result = Duration.min({ minutes: 5 }, { minutes: 10 })
        expect(result.toMinutes()).toBe(5)
      })
    })

    describe('max()', () => {
      it('should return the larger duration', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(10)
        const result = Duration.max(d1, d2)
        expect(result.toMilliseconds()).toBe(d2.toMilliseconds())
      })

      it('should return b when b is larger', () => {
        const result = Duration.max(Duration.fromMinutes(5), Duration.fromMinutes(10))
        expect(result.toMinutes()).toBe(10)
      })

      it('should return a when a is larger', () => {
        const result = Duration.max(Duration.fromMinutes(10), Duration.fromMinutes(5))
        expect(result.toMinutes()).toBe(10)
      })

      it('should work with DurationInput types', () => {
        const result = Duration.max(5000, Duration.fromSeconds(10))
        expect(result.toMilliseconds()).toBe(10000)
      })

      it('should work with DurationLike objects', () => {
        const result = Duration.max({ minutes: 5 }, { minutes: 10 })
        expect(result.toMinutes()).toBe(10)
      })
    })

    describe('sum()', () => {
      it('should sum an array of durations', () => {
        const laps = [Duration.fromSeconds(62), Duration.fromSeconds(58), Duration.fromSeconds(61)]
        expect(Duration.sum(laps).toSeconds()).toBe(181)
      })

      it('should return zero for an empty array', () => {
        expect(Duration.sum([]).isZero()).toBe(true)
      })

      it('should accept mixed DurationInput types', () => {
        const result = Duration.sum([
          Duration.fromMinutes(1),
          30000,
          { seconds: 30 }
        ])
        expect(result.toSeconds()).toBe(120)
      })

      it('should return a Duration instance', () => {
        expect(Duration.sum([Duration.fromSeconds(1)])).toBeInstanceOf(Duration)
      })
    })

    describe('isDuration()', () => {
      it('should return true for Duration instances', () => {
        const d = Duration.fromMinutes(5)
        expect(Duration.isDuration(d)).toBe(true)
      })

      it('should return true for valid DurationLike objects', () => {
        const obj: DurationLike = {
          days: 1,
          hours: 2,
          minutes: 3,
          seconds: 4,
          milliseconds: 500
        }
        expect(Duration.isDuration(obj)).toBe(true)
      })

      it('should return true for valid ISO 8601 duration strings', () => {
        expect(Duration.isDuration('PT1H')).toBe(true)
        expect(Duration.isDuration('P1D')).toBe(true)
        expect(Duration.isDuration('PT30M')).toBe(true)
        expect(Duration.isDuration('P1DT2H30M')).toBe(true)
      })

      it('should return false for invalid inputs', () => {
        expect(Duration.isDuration(null)).toBe(false)
        expect(Duration.isDuration(undefined)).toBe(false)
        expect(Duration.isDuration(123)).toBe(false)
        expect(Duration.isDuration('invalid string')).toBe(false)
        expect(Duration.isDuration('P1Y')).toBe(false) // Years not supported
        expect(Duration.isDuration({})).toBe(false)
        expect(Duration.isDuration({ invalid: 'object' })).toBe(false)
      })
    })

    describe('toDuration()', () => {
      it('should convert Duration to Duration', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.toDuration(d1)
        expect(d2).toBe(d1) // Should be the same instance
      })

      it('should convert number to Duration', () => {
        const d = Duration.toDuration(5000)
        expect(d.toMilliseconds()).toBe(5000)
      })

      it('should convert DurationLike to Duration', () => {
        const d = Duration.toDuration({ minutes: 5, seconds: 30 })
        expect(d.toMilliseconds()).toBe(330000)
      })

      it('should convert ISO 8601 string to Duration', () => {
        const d = Duration.toDuration('PT1H30M')
        expect(d.toMinutes()).toBe(90)
      })

      it('should throw TypeError for invalid input', () => {
        expect(() => Duration.toDuration('invalid' as any)).toThrow(TypeError)
        expect(() => Duration.toDuration(null as any)).toThrow(TypeError)
      })
    })
  })

  describe('ISO 8601 Parsing', () => {
    describe('parseISO8601()', () => {
      it('should parse basic hour format', () => {
        const d = Duration.parseISO8601('PT1H')
        expect(d.toHours()).toBe(1)
        expect(d.toMilliseconds()).toBe(3600000)
      })

      it('should parse basic minute format', () => {
        const d = Duration.parseISO8601('PT30M')
        expect(d.toMinutes()).toBe(30)
      })

      it('should parse basic second format', () => {
        const d = Duration.parseISO8601('PT45S')
        expect(d.toSeconds()).toBe(45)
      })

      it('should parse combined hour and minute format', () => {
        const d = Duration.parseISO8601('PT1H30M')
        expect(d.toMinutes()).toBe(90)
      })

      it('should parse day and time format', () => {
        const d = Duration.parseISO8601('P1DT2H')
        expect(d.toHours()).toBe(26)
      })

      it('should parse decimal seconds', () => {
        const d = Duration.parseISO8601('PT30.5S')
        expect(d.toMilliseconds()).toBe(30500)
      })

      it('should parse complex format', () => {
        const d = Duration.parseISO8601('P7DT3H15M30S')
        const expected =
          7 * 86400000 +  // 7 days
          3 * 3600000 +   // 3 hours
          15 * 60000 +    // 15 minutes
          30 * 1000       // 30 seconds
        expect(d.toMilliseconds()).toBe(expected)
      })

      it('should parse edge case P0D', () => {
        const d = Duration.parseISO8601('P0D')
        expect(d.toMilliseconds()).toBe(0)
      })

      it('should parse edge case PT0S', () => {
        const d = Duration.parseISO8601('PT0S')
        expect(d.toMilliseconds()).toBe(0)
      })

      it('should throw TypeError for invalid format', () => {
        expect(() => Duration.parseISO8601('invalid')).toThrow(TypeError)
        expect(() => Duration.parseISO8601('P1Y')).toThrow(/Invalid ISO 8601/)
        expect(() => Duration.parseISO8601('1H30M')).toThrow(/Invalid ISO 8601/)
      })

      it('should throw TypeError for non-string input', () => {
        expect(() => Duration.parseISO8601(123 as any)).toThrow(TypeError)
        expect(() => Duration.parseISO8601(123 as any)).toThrow('Input must be a string')
      })
    })

    describe('parse()', () => {
      it('should work as alias to parseISO8601', () => {
        const d1 = Duration.parse('PT1H30M')
        const d2 = Duration.parseISO8601('PT1H30M')
        expect(d1.toMilliseconds()).toBe(d2.toMilliseconds())
      })
    })

    describe('between()', () => {
      it('should return duration for a before b', () => {
        const a = new Date('2024-01-01T00:00:00Z')
        const b = new Date('2024-01-01T01:00:00Z')
        expect(Duration.between(a, b).toMilliseconds()).toBe(3600000)
      })

      it('should return same duration for b before a (commutative)', () => {
        const a = new Date('2024-01-01T00:00:00Z')
        const b = new Date('2024-01-01T01:00:00Z')
        expect(Duration.between(a, b).toMilliseconds()).toBe(Duration.between(b, a).toMilliseconds())
      })

      it('should return zero for identical dates', () => {
        const d = new Date('2024-01-01T00:00:00Z')
        expect(Duration.between(d, d).toMilliseconds()).toBe(0)
      })

      it('should handle 1-day difference', () => {
        const a = new Date('2024-01-01T00:00:00Z')
        const b = new Date('2024-01-02T00:00:00Z')
        expect(Duration.between(a, b).toDays()).toBe(1)
      })

      it('should handle millisecond precision', () => {
        const a = new Date(0)
        const b = new Date(123)
        expect(Duration.between(a, b).toMilliseconds()).toBe(123)
      })

      it('should return a Duration instance', () => {
        const a = new Date(0)
        const b = new Date(1000)
        expect(Duration.between(a, b)).toBeInstanceOf(Duration)
      })
    })
  })

  describe('Arithmetic Methods', () => {
    describe('add()', () => {
      it('should add Duration to Duration', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(10)
        const result = d1.add(d2)
        expect(result.toMinutes()).toBe(15)
      })

      it('should add number (milliseconds) to Duration', () => {
        const d = Duration.fromSeconds(30)
        const result = d.add(5000)
        expect(result.toMilliseconds()).toBe(35000)
      })

      it('should add DurationLike object to Duration', () => {
        const d = Duration.fromMinutes(5)
        const result = d.add({ minutes: 3, seconds: 30 })
        expect(result.toMilliseconds()).toBe(510000)
      })

      it('should add ISO 8601 string to Duration', () => {
        const d = Duration.fromMinutes(5)
        const result = d.add('PT30S')
        expect(result.toSeconds()).toBe(330)
      })

      it('should return new instance (immutability)', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = d1.add(Duration.fromMinutes(5))
        expect(d1.toMinutes()).toBe(5)
        expect(d2.toMinutes()).toBe(10)
      })
    })

    describe('and()', () => {
      it('should combine units', () => {
        const d = Duration.fromMinutes(5).and(30, 'seconds')
        expect(d.toMilliseconds()).toBe(330000)
      })

      it('should support chaining', () => {
        const d = Duration.fromHours(1)
          .and(30, 'minutes')
          .and(15, 'seconds')
        expect(d.toMilliseconds()).toBe(5415000)
      })

      it('should work with singular units', () => {
        const d = Duration.fromMinutes(5).and(1, 'second')
        expect(d.toMilliseconds()).toBe(301000)
      })
    })

    describe('multiply()', () => {
      it('should multiply by an integer', () => {
        expect(Duration.fromMinutes(5).multiply(3).toMinutes()).toBe(15)
      })

      it('should multiply by a fraction', () => {
        expect(Duration.fromHours(1).multiply(0.5).toMilliseconds()).toBe(1800000)
      })

      it('should multiply by zero', () => {
        expect(Duration.fromMinutes(5).multiply(0).isZero()).toBe(true)
      })

      it('should return new instance (immutability)', () => {
        const d = Duration.fromMinutes(5)
        const result = d.multiply(2)
        expect(d.toMinutes()).toBe(5)
        expect(result.toMinutes()).toBe(10)
      })
    })

    describe('subtract()', () => {
      it('should subtract Duration from Duration', () => {
        const d1 = Duration.fromMinutes(10)
        const d2 = Duration.fromMinutes(5)
        const result = d1.subtract(d2)
        expect(result.toMinutes()).toBe(5)
      })

      it('should bottom out at zero', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(10)
        const result = d1.subtract(d2)
        expect(result.toMilliseconds()).toBe(0)
      })

      it('should subtract number (milliseconds)', () => {
        const d = Duration.fromSeconds(30)
        const result = d.subtract(5000)
        expect(result.toMilliseconds()).toBe(25000)
      })

      it('should return new instance (immutability)', () => {
        const d1 = Duration.fromMinutes(10)
        const d2 = d1.subtract(Duration.fromMinutes(5))
        expect(d1.toMinutes()).toBe(10)
        expect(d2.toMinutes()).toBe(5)
      })
    })

    describe('floorTo()', () => {
      it('should floor seconds to minutes', () => {
        expect(Duration.fromSeconds(90).floorTo('minute').toMinutes()).toBe(1)
      })

      it('should floor minutes to hours', () => {
        expect(Duration.fromMinutes(61).floorTo('hour').toHours()).toBe(1)
      })

      it('should return same value when already on boundary', () => {
        expect(Duration.fromMinutes(60).floorTo('hour').toHours()).toBe(1)
      })

      it('should work with plural units', () => {
        expect(Duration.fromSeconds(90).floorTo('minutes').toMinutes()).toBe(1)
      })

      it('should return new instance (immutability)', () => {
        const d = Duration.fromSeconds(90)
        const result = d.floorTo('minute')
        expect(d.toSeconds()).toBe(90)
        expect(result.toSeconds()).toBe(60)
      })
    })

    describe('ceilTo()', () => {
      it('should ceil seconds to minutes', () => {
        expect(Duration.fromSeconds(90).ceilTo('minute').toMinutes()).toBe(2)
      })

      it('should ceil minutes to hours', () => {
        expect(Duration.fromMinutes(61).ceilTo('hour').toHours()).toBe(2)
      })

      it('should return same value when already on boundary', () => {
        expect(Duration.fromMinutes(60).ceilTo('hour').toHours()).toBe(1)
      })

      it('should work with plural units', () => {
        expect(Duration.fromSeconds(90).ceilTo('minutes').toMinutes()).toBe(2)
      })

      it('should return new instance (immutability)', () => {
        const d = Duration.fromSeconds(90)
        const result = d.ceilTo('minute')
        expect(d.toSeconds()).toBe(90)
        expect(result.toSeconds()).toBe(120)
      })
    })

    describe('roundTo()', () => {
      it('should round to seconds', () => {
        const d = Duration.fromMilliseconds(1600)
        const result = d.roundTo('second')
        expect(result.toMilliseconds()).toBe(2000)
      })

      it('should round to minutes', () => {
        const d = Duration.fromSeconds(90)
        const result = d.roundTo('minute')
        expect(result.toMinutes()).toBe(2)
      })

      it('should round down to minutes', () => {
        const d = Duration.fromSeconds(89)
        const result = d.roundTo('minute')
        expect(result.toMinutes()).toBe(1)
      })

      it('should round to hours', () => {
        const d = Duration.fromMinutes(25)
        const result = d.roundTo('hour')
        expect(result.toHours()).toBe(0)
      })

      it('should round up to hours', () => {
        const d = Duration.fromMinutes(35)
        const result = d.roundTo('hour')
        expect(result.toHours()).toBe(1)
      })

      it('should work with plural units', () => {
        const d = Duration.fromSeconds(90)
        const result = d.roundTo('minutes')
        expect(result.toMinutes()).toBe(2)
      })
    })
  })

  describe('Comparison Methods', () => {
    describe('compare()', () => {
      it('should return negative when this is less', () => {
        expect(Duration.fromMinutes(5).compare(Duration.fromMinutes(10))).toBeLessThan(0)
      })

      it('should return zero when equal', () => {
        expect(Duration.fromMinutes(5).compare(Duration.fromSeconds(300))).toBe(0)
      })

      it('should return positive when this is greater', () => {
        expect(Duration.fromMinutes(10).compare(Duration.fromMinutes(5))).toBeGreaterThan(0)
      })

      it('should work for sorting', () => {
        const d1 = Duration.fromMinutes(10)
        const d2 = Duration.fromMinutes(3)
        const d3 = Duration.fromMinutes(7)
        const sorted = [d1, d2, d3].sort((a, b) => a.compare(b))
        expect(sorted.map(d => d.toMinutes())).toEqual([3, 7, 10])
      })

      it('should accept raw milliseconds', () => {
        expect(Duration.fromSeconds(5).compare(5000)).toBe(0)
      })
    })

    describe('equals()', () => {
      it('should return true for equal durations', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromSeconds(300)
        expect(d1.equals(d2)).toBe(true)
      })

      it('should return false for unequal durations', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(10)
        expect(d1.equals(d2)).toBe(false)
      })

      it('should work with number input', () => {
        const d = Duration.fromMilliseconds(5000)
        expect(d.equals(5000)).toBe(true)
      })

      it('should work with ISO 8601 string input', () => {
        const d = Duration.fromMinutes(5)
        expect(d.equals('PT5M')).toBe(true)
        expect(d.equals('PT300S')).toBe(true)
        expect(d.equals('PT1M')).toBe(false)
      })
    })

    describe('isLessThan()', () => {
      it('should return true when less than', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(10)
        expect(d1.isLessThan(d2)).toBe(true)
      })

      it('should return false when greater than', () => {
        const d1 = Duration.fromMinutes(10)
        const d2 = Duration.fromMinutes(5)
        expect(d1.isLessThan(d2)).toBe(false)
      })

      it('should return false when equal', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(5)
        expect(d1.isLessThan(d2)).toBe(false)
      })
    })

    describe('isGreaterThan()', () => {
      it('should return true when greater than', () => {
        const d1 = Duration.fromMinutes(10)
        const d2 = Duration.fromMinutes(5)
        expect(d1.isGreaterThan(d2)).toBe(true)
      })

      it('should return false when less than', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(10)
        expect(d1.isGreaterThan(d2)).toBe(false)
      })

      it('should return false when equal', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(5)
        expect(d1.isGreaterThan(d2)).toBe(false)
      })
    })

    describe('isLessThanOrEqual()', () => {
      it('should return true when less than', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(10)
        expect(d1.isLessThanOrEqual(d2)).toBe(true)
      })

      it('should return true when equal', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(5)
        expect(d1.isLessThanOrEqual(d2)).toBe(true)
      })

      it('should return false when greater than', () => {
        const d1 = Duration.fromMinutes(10)
        const d2 = Duration.fromMinutes(5)
        expect(d1.isLessThanOrEqual(d2)).toBe(false)
      })
    })

    describe('isGreaterThanOrEqual()', () => {
      it('should return true when greater than', () => {
        const d1 = Duration.fromMinutes(10)
        const d2 = Duration.fromMinutes(5)
        expect(d1.isGreaterThanOrEqual(d2)).toBe(true)
      })

      it('should return true when equal', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(5)
        expect(d1.isGreaterThanOrEqual(d2)).toBe(true)
      })

      it('should return false when less than', () => {
        const d1 = Duration.fromMinutes(5)
        const d2 = Duration.fromMinutes(10)
        expect(d1.isGreaterThanOrEqual(d2)).toBe(false)
      })
    })

    describe('clamp()', () => {
      it('should return this when within bounds', () => {
        const d = Duration.fromMinutes(7)
        expect(d.clamp(Duration.fromMinutes(5), Duration.fromMinutes(10)).toMinutes()).toBe(7)
      })

      it('should return min when below bounds', () => {
        const d = Duration.fromMinutes(3)
        expect(d.clamp(Duration.fromMinutes(5), Duration.fromMinutes(10)).toMinutes()).toBe(5)
      })

      it('should return max when above bounds', () => {
        const d = Duration.fromSeconds(120)
        expect(d.clamp(Duration.fromSeconds(1), Duration.fromMinutes(1)).toSeconds()).toBe(60)
      })

      it('should return this when on the lower boundary', () => {
        const d = Duration.fromMinutes(5)
        expect(d.clamp(Duration.fromMinutes(5), Duration.fromMinutes(10)).toMinutes()).toBe(5)
      })

      it('should return this when on the upper boundary', () => {
        const d = Duration.fromMinutes(10)
        expect(d.clamp(Duration.fromMinutes(5), Duration.fromMinutes(10)).toMinutes()).toBe(10)
      })
    })

    describe('isBetween()', () => {
      it('should return true when within bounds', () => {
        const d = Duration.fromMilliseconds(450)
        expect(d.isBetween(Duration.fromMilliseconds(100), Duration.fromSeconds(1))).toBe(true)
      })

      it('should return true on the lower boundary (inclusive)', () => {
        const d = Duration.fromMinutes(5)
        expect(d.isBetween(Duration.fromMinutes(5), Duration.fromMinutes(10))).toBe(true)
      })

      it('should return true on the upper boundary (inclusive)', () => {
        const d = Duration.fromMinutes(10)
        expect(d.isBetween(Duration.fromMinutes(5), Duration.fromMinutes(10))).toBe(true)
      })

      it('should return false when below bounds', () => {
        const d = Duration.fromMinutes(3)
        expect(d.isBetween(Duration.fromMinutes(5), Duration.fromMinutes(10))).toBe(false)
      })

      it('should return false when above bounds', () => {
        const d = Duration.fromMinutes(15)
        expect(d.isBetween(Duration.fromMinutes(5), Duration.fromMinutes(10))).toBe(false)
      })
    })

    describe('isZero()', () => {
      it('should return true for zero duration', () => {
        const d = new Duration(0)
        expect(d.isZero()).toBe(true)
      })

      it('should return false for non-zero duration', () => {
        const d = Duration.fromMilliseconds(1)
        expect(d.isZero()).toBe(false)
      })
    })
  })

  describe('Conversion Methods', () => {
    describe('toMilliseconds()', () => {
      it('should return total milliseconds', () => {
        const d = Duration.fromSeconds(5)
        expect(d.toMilliseconds()).toBe(5000)
      })
    })

    describe('valueOf()', () => {
      it('should return milliseconds when called directly', () => {
        expect(Duration.fromSeconds(5).valueOf()).toBe(5000)
      })

      it('should support unary + coercion', () => {
        const duration = Duration.fromSeconds(5)
        expect(+duration).toBe(5000)
      })

      it('should support Number() cast', () => {
        const duration = Duration.fromSeconds(5)
        expect(Number(duration)).toBe(5000)
      })

      it('should support addition with a number', () => {
        const duration = Duration.fromSeconds(5)
        expect(duration + 5000).toBe(10000)
      })

      it('should support subtraction between two Durations', () => {
        const d1 = Duration.fromSeconds(2)
        const d2 = Duration.fromSeconds(5)
        expect(d2 - d1).toBe(3000)
      })

      it('should support multiplication by a number', () => {
        const duration = Duration.fromSeconds(5)
        expect(duration * 2).toBe(10000)
      })

      it('should support numeric comparison with >', () => {
        const d5s = Duration.fromSeconds(5)
        const d3s = Duration.fromSeconds(3)
        expect(d5s > d3s).toBe(true)
      })

      it('should work with Math.max()', () => {
        const d1 = Duration.fromSeconds(2)
        const d2 = Duration.fromSeconds(5)
        expect(Math.max(d1, d2)).toBe(5000)
      })

      it('should work with Math.min()', () => {
        const d1 = Duration.fromSeconds(2)
        const d2 = Duration.fromSeconds(5)
        expect(Math.min(d1, d2)).toBe(2000)
      })

      it('should support Date arithmetic', () => {
        const duration = Duration.fromSeconds(5)
        expect(new Date(0 + duration)).toEqual(new Date(5000))
      })

      it('should return ISO 8601 string via template literal (string hint)', () => {
        expect(`${Duration.fromMinutes(5)}`).toBe('PT5M')
      })

      it('should return 0 for zero duration', () => {
        expect(+Duration.fromMilliseconds(0)).toBe(0)
      })
    })

    describe('toSeconds()', () => {
      it('should return total seconds with truncation', () => {
        const d = Duration.fromMilliseconds(5500)
        expect(d.toSeconds()).toBe(5)
      })

      it('should handle minutes correctly', () => {
        const d = Duration.fromMinutes(2)
        expect(d.toSeconds()).toBe(120)
      })

      it('should return fractional value with { exact: true }', () => {
        expect(Duration.fromMilliseconds(1500).toSeconds({ exact: true })).toBe(1.5)
      })
    })

    describe('toMinutes()', () => {
      it('should return total minutes with truncation', () => {
        const d = Duration.fromSeconds(150)
        expect(d.toMinutes()).toBe(2)
      })

      it('should handle hours correctly', () => {
        const d = Duration.fromHours(2)
        expect(d.toMinutes()).toBe(120)
      })

      it('should return fractional value with { exact: true }', () => {
        expect(Duration.fromSeconds(90).toMinutes({ exact: true })).toBe(1.5)
      })
    })

    describe('toHours()', () => {
      it('should return total hours with truncation', () => {
        const d = Duration.fromMinutes(150)
        expect(d.toHours()).toBe(2)
      })

      it('should handle days correctly', () => {
        const d = Duration.fromDays(2)
        expect(d.toHours()).toBe(48)
      })

      it('should return fractional value with { exact: true }', () => {
        expect(Duration.fromMinutes(90).toHours({ exact: true })).toBe(1.5)
      })
    })

    describe('toDays()', () => {
      it('should return total days with truncation', () => {
        const d = Duration.fromHours(30)
        expect(d.toDays()).toBe(1)
      })

      it('should handle weeks correctly', () => {
        const d = Duration.fromWeeks(2)
        expect(d.toDays()).toBe(14)
      })

      it('should return fractional value with { exact: true }', () => {
        expect(Duration.fromHours(36).toDays({ exact: true })).toBe(1.5)
      })
    })

    describe('toWeeks()', () => {
      it('should return total weeks with truncation', () => {
        const d = Duration.fromDays(10)
        expect(d.toWeeks()).toBe(1)
      })

      it('should handle exact weeks', () => {
        const d = Duration.fromDays(14)
        expect(d.toWeeks()).toBe(2)
      })

      it('should return fractional value with { exact: true }', () => {
        expect(Duration.fromDays(3).toWeeks({ exact: true })).toBeCloseTo(3 / 7)
      })
    })

    describe('toObject()', () => {
      it('should break down duration into components', () => {
        const d = new Duration({
          days: 1,
          hours: 2,
          minutes: 3,
          seconds: 4,
          milliseconds: 500
        })
        const obj = d.toObject()
        expect(obj).toEqual({
          weeks: 0,
          days: 1,
          hours: 2,
          minutes: 3,
          seconds: 4,
          milliseconds: 500
        })
      })

      it('should handle zero values', () => {
        const d = Duration.fromMinutes(5)
        const obj = d.toObject()
        expect(obj.days).toBe(0)
        expect(obj.hours).toBe(0)
        expect(obj.minutes).toBe(5)
        expect(obj.seconds).toBe(0)
        expect(obj.milliseconds).toBe(0)
      })

      it('should break down complex duration', () => {
        const d = Duration.fromMilliseconds(90061500)
        const obj = d.toObject()
        expect(obj.days).toBe(1)
        expect(obj.hours).toBe(1)
        expect(obj.minutes).toBe(1)
        expect(obj.seconds).toBe(1)
        expect(obj.milliseconds).toBe(500)
      })
    })

    describe('toJSON()', () => {
      it('should return same as toObject', () => {
        const d = Duration.fromMinutes(5).and(30, 'seconds')
        expect(d.toJSON()).toEqual(d.toObject())
      })
    })
  })

  describe('Serialization', () => {
    describe('toString()', () => {
      it('should return ISO 8601 format for simple durations', () => {
        expect(Duration.fromHours(1).toString()).toBe('PT1H')
        expect(Duration.fromMinutes(30).toString()).toBe('PT30M')
        expect(Duration.fromSeconds(45).toString()).toBe('PT45S')
      })

      it('should return ISO 8601 format for combined durations', () => {
        const d = Duration.fromHours(1).and(30, 'minutes')
        expect(d.toString()).toBe('PT1H30M')
      })

      it('should return ISO 8601 format with days only (no T section)', () => {
        expect(Duration.fromDays(2).toString()).toBe('P2D')
      })

      it('should return ISO 8601 format with days', () => {
        const d = Duration.fromDays(1).and(2, 'hours')
        expect(d.toString()).toBe('P1DT2H')
      })

      it('should return ISO 8601 format for complex duration', () => {
        const d = new Duration({
          days: 7,
          hours: 3,
          minutes: 15,
          seconds: 30
        })
        expect(d.toString()).toBe('P7DT3H15M30S')
      })

      it('should handle milliseconds as decimal seconds', () => {
        const d = Duration.fromMilliseconds(30500)
        expect(d.toString()).toBe('PT30.5S')
      })

      it('should return PT0S for zero duration', () => {
        const d = new Duration(0)
        expect(d.toString()).toBe('PT0S')
      })
    })

    describe('toLocaleString()', () => {
      it('should return a non-empty string', () => {
        const d = Duration.fromHours(2).and(30, 'minutes')
        expect(d.toLocaleString()).toBeTruthy()
      })

      it('should include numeric component values in output', () => {
        const d = Duration.fromHours(2).and(30, 'minutes')
        const result = d.toLocaleString()
        expect(result).toContain('2')
        expect(result).toContain('30')
      })

      it('should accept locale and options without throwing', () => {
        const d = Duration.fromMinutes(90)
        expect(() => d.toLocaleString('en-US', { style: 'long' })).not.toThrow()
        expect(() => d.toLocaleString(['en', 'fr'], { style: 'short' })).not.toThrow()
      })

      it('fallback: should format as "2 hours, 30 minutes"', () => {
        const saved = (Intl as any).DurationFormat
        delete (Intl as any).DurationFormat
        const d = Duration.fromHours(2).and(30, 'minutes')
        expect(d.toLocaleString()).toBe('2 hours, 30 minutes')
        if (saved !== undefined) (Intl as any).DurationFormat = saved
      })

      it('fallback: should use singular for value of 1', () => {
        const saved = (Intl as any).DurationFormat
        delete (Intl as any).DurationFormat
        expect(Duration.fromHours(1).toLocaleString()).toBe('1 hour')
        expect(Duration.fromMinutes(1).toLocaleString()).toBe('1 minute')
        expect(Duration.fromSeconds(1).toLocaleString()).toBe('1 second')
        if (saved !== undefined) (Intl as any).DurationFormat = saved
      })

      it('fallback: zero duration returns "0 seconds"', () => {
        const saved = (Intl as any).DurationFormat
        delete (Intl as any).DurationFormat
        expect(new Duration(0).toLocaleString()).toBe('0 seconds')
        if (saved !== undefined) (Intl as any).DurationFormat = saved
      })
    })

    describe('[inspect.custom]()', () => {
      it('should return human-readable format', () => {
        const d = Duration.fromMinutes(5).and(30, 'seconds')
        const output = (d as any)[Symbol.for('nodejs.util.inspect.custom')]()
        expect(output).toContain('Duration {')
        expect(output).toContain('5m')
        expect(output).toContain('30s')
      })

      it('should include weeks and days', () => {
        const d = Duration.fromWeeks(2).and(3, 'days').and(5, 'hours')
        const output = (d as any)[Symbol.for('nodejs.util.inspect.custom')]()
        expect(output).toContain('2w')
        expect(output).toContain('3d')
        expect(output).toContain('5h')
      })

      it('should show 0s for zero duration', () => {
        const d = new Duration(0)
        const output = (d as any)[Symbol.for('nodejs.util.inspect.custom')]()
        expect(output).toBe('Duration { 0s }')
      })

      it('should combine seconds and milliseconds', () => {
        const d = Duration.fromMilliseconds(1500)
        const output = (d as any)[Symbol.for('nodejs.util.inspect.custom')]()
        expect(output).toContain('1.5s')
      })
    })
  })

  describe('[Symbol.iterator]()', () => {
    it('should yield 6 values matching toObject() in order', () => {
      const d = Duration.fromWeeks(1).and(2, 'days').and(3, 'hours').and(4, 'minutes').and(5, 'seconds').add(6)
      const [weeks, days, hours, minutes, seconds, ms] = d
      const obj = d.toObject()
      expect(weeks).toBe(obj.weeks)
      expect(days).toBe(obj.days)
      expect(hours).toBe(obj.hours)
      expect(minutes).toBe(obj.minutes)
      expect(seconds).toBe(obj.seconds)
      expect(ms).toBe(obj.milliseconds)
    })

    it('should yield 6 zeros for zero duration', () => {
      const d = new Duration(0)
      const values = [...d]
      expect(values).toEqual([0, 0, 0, 0, 0, 0])
    })

    it('spread should have length 6', () => {
      const d = Duration.fromHours(2).and(30, 'minutes')
      expect([...d]).toHaveLength(6)
    })

    it('values should match toObject()', () => {
      const d = Duration.fromHours(2).and(30, 'minutes').and(15, 'seconds')
      const [weeks, days, hours, minutes, seconds, ms] = d
      const obj = d.toObject()
      expect([weeks, days, hours, minutes, seconds, ms]).toEqual([
        obj.weeks, obj.days, obj.hours, obj.minutes, obj.seconds, obj.milliseconds
      ])
    })

    it('should support partial destructuring with skips', () => {
      const d = Duration.fromHours(2).and(30, 'minutes')
      const [, , hours, minutes] = d
      expect(hours).toBe(2)
      expect(minutes).toBe(30)
    })

    it('should support for...of iteration', () => {
      const d = Duration.fromHours(1)
      const values: number[] = []
      for (const v of d) values.push(v)
      expect(values).toHaveLength(6)
      expect(values.every(v => typeof v === 'number')).toBe(true)
    })

    it('Array.from() should produce a length-6 array', () => {
      const d = Duration.fromMinutes(90)
      const arr = Array.from(d)
      expect(arr).toHaveLength(6)
    })
  })

  describe('ratio()', () => {
    it('should return 0.5 when this is half of other', () => {
      expect(Duration.fromMinutes(30).ratio(Duration.fromHours(1))).toBe(0.5)
    })

    it('should return 0.75 for 45s / 1m', () => {
      expect(Duration.fromSeconds(45).ratio(Duration.fromMinutes(1))).toBe(0.75)
    })

    it('should return 1 when equal', () => {
      expect(Duration.fromMinutes(5).ratio(Duration.fromMinutes(5))).toBe(1)
    })

    it('should return greater than 1 when this is larger', () => {
      expect(Duration.fromMinutes(10).ratio(Duration.fromMinutes(5))).toBe(2)
    })

    it('should throw RangeError for zero other', () => {
      expect(() => Duration.fromMinutes(5).ratio(new Duration(0))).toThrow(RangeError)
    })

    it('should accept raw milliseconds', () => {
      expect(Duration.fromSeconds(1).ratio(2000)).toBe(0.5)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero duration', () => {
      const d = new Duration(0)
      expect(d.isZero()).toBe(true)
      expect(d.toMilliseconds()).toBe(0)
      expect(d.toString()).toBe('PT0S')
    })

    it('should handle very large durations', () => {
      const largeMs = Number.MAX_SAFE_INTEGER
      const d = new Duration(largeMs)
      expect(d.toMilliseconds()).toBe(largeMs)
    })

    it('should handle fractional inputs', () => {
      const d = Duration.fromSeconds(1.5)
      expect(d.toMilliseconds()).toBe(1500)
    })

    it('should support method chaining', () => {
      const d = Duration.fromHours(1)
        .add(Duration.fromMinutes(30))
        .subtract(Duration.fromSeconds(90))
        .roundTo('minute')
      expect(d.toMinutes()).toBe(89)
    })

    it('should maintain immutability', () => {
      const d1 = Duration.fromMinutes(5)
      const d2 = d1.add(Duration.fromMinutes(5))
      const d3 = d1.subtract(Duration.fromMinutes(2))
      const d4 = d1.roundTo('hour')

      expect(d1.toMinutes()).toBe(5)
      expect(d2.toMinutes()).toBe(10)
      expect(d3.toMinutes()).toBe(3)
      expect(d4.toMinutes()).toBe(0)
    })
  })
})
