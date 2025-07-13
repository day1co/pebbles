import {
  calcDatetime,
  diffDate,
  durationTo,
  endOfByTimezone,
  formatDate,
  formatInIso8601,
  fromNow,
  getDateString,
  getDatetimeString,
  getTimestampString,
  getTimezoneOffsetInHours,
  isAdult,
  isLastDateOfMonth,
  isValidDate,
  minDate,
  parseByFormatDate,
  parseDate,
  parseTimestamp,
  parseUnixTime,
  startOfByTimezone,
  startOfDate,
} from './date-util';
import {
  DATE_FORMAT,
  DATETIME_FORMAT,
  DATETIME_FORMAT_WITH_MILLIS,
  TIMESTAMP_FORMAT,
  TIMEZONE_PST,
  TIMEZONE_SEOUL,
  TIMEZONE_TOKYO,
} from './date-util.const';

const testDateStr = '2022-02-23';
const testDatetimeStr1 = '2022-02-23 01:23';
const testDatetimeStr2 = '2022-02-23T01:23Z';
const testDatetimeStr3 = '2022-02-23 01:23:45';
const testDatetimeStr4 = '2022-02-23T01:23:45';
const testDatetimeStr5 = `${testDatetimeStr4}Z`;
const testDatetimeStr6 = '2022-02-23 01:23:45.678';
const testDatetimeStr7 = '2022-02-23T01:23:45.678';
const testDatetimeStr8 = `${testDatetimeStr7}Z`;
const testTimestampStr = '20220223012345678';
const testDate = new Date(`${testDateStr} 00:00`);

describe('isValidDate', () => {
  it('should return true with valid date', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date(1))).toBe(true);
    expect(isValidDate(new Date(testDateStr))).toBe(true);
  });
  it('should return false with invalid date', () => {
    expect(isValidDate(new Date(''))).toBe(false);
    expect(isValidDate(new Date('abc'))).toBe(false);
    expect(isValidDate(new Date('2000년 01월 01일'))).toBe(false);
  });
});

describe('parse', () => {
  test('invalid date input throws error', () => {
    expect(() => parseDate('')).toThrow();
    expect(() => parseDate('abc')).toThrow();
    expect(() => parseDate('3월 9일')).toThrow();
  });
  test('valid date input returns instance of Date', () => {
    const now = new Date();
    expect(parseDate(now)).toEqual(now);
    expect(parseDate(testDateStr)).toEqual(testDate);
    expect(parseDate(testDatetimeStr1)).toEqual(new Date(testDatetimeStr1));
    expect(parseDate(testDatetimeStr2)).toEqual(new Date(testDatetimeStr2));
    expect(parseDate(testDatetimeStr3)).toEqual(new Date(testDatetimeStr3));
    expect(parseDate(testDatetimeStr5)).toEqual(new Date(testDatetimeStr5));
    expect(parseDate(testDatetimeStr6)).toEqual(new Date(testDatetimeStr6));
    expect(parseDate(testDatetimeStr8)).toEqual(new Date(testDatetimeStr8));
  });
  test('original input value is maintained', () => {
    const now = new Date();
    const parsedDate = parseDate(now);
    parsedDate.setHours(parsedDate.getHours() + 1);
    expect(parsedDate).not.toBe(now);
  });
});

describe('parseByFormat', () => {
  it('should throw error for invalid format', () => {
    const testData = testTimestampStr.substring(0, 8);
    expect(() => parseByFormatDate(testData, 'YYYYM')).toThrow();
  });
  it('should throw error for invalid string', () => {
    expect(() => parseByFormatDate('20221301', 'YYYYMMDD')).toThrow();
    expect(() => parseByFormatDate('20220223241234567', 'YYYYMMDDHHmmssSSS')).toThrow();
  });
  it('should return valid date', () => {
    const testData = testTimestampStr.substring(0, 14);
    expect(parseByFormatDate(testData, 'YYYYMMDDHHmmss')).toEqual(new Date(testDatetimeStr3));
    expect(parseByFormatDate('02202223012345', 'MMYYYYDDHHmmss')).toEqual(
      new Date(testDatetimeStr3)
    );
    expect(parseByFormatDate('23/02/2022 01:23:45', 'DD/MM/YYYY HH:mm:ss')).toEqual(
      new Date(testDatetimeStr3)
    );
  });
});

describe('parseTimestamp', () => {
  it('should throw error when invalid arguments given', () => {
    expect(() => parseTimestamp(testTimestampStr.substring(0, 8))).not.toThrow();
    expect(() => parseTimestamp('2021013111223344112233')).toThrow();
  });

  it('should return valid date', () => {
    expect(parseTimestamp(testTimestampStr.substring(0, 8))).toEqual(testDate);
    expect(parseTimestamp(testTimestampStr.substring(0, 14))).toEqual(new Date(testDatetimeStr3));
    expect(parseTimestamp(testTimestampStr)).toEqual(new Date(testDatetimeStr6));
  });
});

describe('parseUnixTime', () => {
  it('should return Date instance of given unix time', () => {
    // see https://www.epochconverter.com/
    expect(parseUnixTime(1645579425)).toEqual(new Date(testDatetimeStr5));
    expect(parseUnixTime(0)).toEqual(new Date(new Date('1970-01-01T00:00:00Z')));
    expect(parseUnixTime(-1000000000)).toEqual(new Date('1938-04-24T22:13:20Z'));
  });

  it('should throw with invalid parameter', () => {
    expect(() => parseUnixTime(Number.NEGATIVE_INFINITY)).toThrow();
    expect(() => parseUnixTime(Number.POSITIVE_INFINITY)).toThrow();
    expect(() => parseUnixTime(Number.MAX_SAFE_INTEGER)).toThrow();
    expect(() => parseUnixTime(Number.MIN_SAFE_INTEGER)).toThrow();
    expect(() => parseUnixTime(8640000000001)).toThrow();
    expect(() => parseUnixTime(-8640000000001)).toThrow();
  });
});

describe('calcDatetime', () => {
  test('should throw error for invalid date', () => {
    expect(() => calcDatetime('string', { year: 3 })).toThrow();
    expect(() => calcDatetime('20209999', { year: 3 })).toThrow();
    expect(() => calcDatetime('', { year: 3 })).toThrow();
  });
  test('add/subtract year/month/week/day/hour/minute/second', () => {
    expect(calcDatetime(testDatetimeStr6, { year: 1 })).toEqual(
      new Date('2023-02-23 01:23:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { month: 1 })).toEqual(
      new Date('2022-03-23 01:23:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { week: 1 })).toEqual(
      new Date('2022-03-02 01:23:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { day: 1 })).toEqual(new Date('2022-02-24 01:23:45.678'));
    expect(calcDatetime(testDatetimeStr6, { hour: 1 })).toEqual(
      new Date('2022-02-23 02:23:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { minute: 1 })).toEqual(
      new Date('2022-02-23 01:24:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { second: 1 })).toEqual(
      new Date('2022-02-23 01:23:46.678')
    );

    expect(calcDatetime(testDatetimeStr6, { year: -1 })).toEqual(
      new Date('2021-02-23 01:23:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { month: -1 })).toEqual(
      new Date('2022-01-23 01:23:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { week: -1 })).toEqual(
      new Date('2022-02-16 01:23:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { day: -1 })).toEqual(
      new Date('2022-02-22 01:23:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { hour: -1 })).toEqual(
      new Date('2022-02-23 00:23:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { minute: -1 })).toEqual(
      new Date('2022-02-23 01:22:45.678')
    );
    expect(calcDatetime(testDatetimeStr6, { second: -1 })).toEqual(
      new Date('2022-02-23 01:23:44.678')
    );
  });

  test('should return date for the over-unit-max-value', () => {
    expect(calcDatetime(testDatetimeStr6, { hour: 100 })).toEqual(
      new Date('2022-02-27 05:23:45.678')
    ); // 100시간 => 4일 4시간
    expect(calcDatetime(testDatetimeStr6, { minute: 100 })).toEqual(
      new Date('2022-02-23 03:03:45.678')
    ); // 100분 => 1시간 40분
    expect(calcDatetime(testDatetimeStr6, { second: 100 })).toEqual(
      new Date('2022-02-23 01:25:25.678')
    ); // 100초 => 1분 40초

    expect(calcDatetime(testDatetimeStr6, { hour: 100, minute: 100, second: 100 })).toEqual(
      new Date('2022-02-27 07:05:25.678')
    ); // 100시간 + 100분 + 100초 => 4일 5시간 41분 40초
  });
});

describe('startOf', () => {
  it('should throw error when invalid Date given', () => {
    expect(() => startOfDate('zzzzz', 'year')).toThrow();
    expect(() => startOfDate('2021-13-01 00:00:00', 'month')).toThrow();
    expect(() => startOfDate(new Date('zzzzz'), 'day')).toThrow();
  });

  it('should return start of the year', () => {
    expect(startOfDate(testDatetimeStr6, 'year')).toEqual(new Date('2022-01-01 00:00:00.000'));
    expect(startOfDate(new Date(testDatetimeStr6), 'year')).toEqual(
      new Date('2022-01-01 00:00:00.000')
    );
  });

  it('should return start of the month', () => {
    expect(startOfDate(testDatetimeStr6, 'month')).toEqual(new Date('2022-02-01 00:00:00.000'));
    expect(startOfDate(new Date(testDatetimeStr6), 'month')).toEqual(
      new Date('2022-02-01 00:00:00.000')
    );
  });

  it('should return start of the day', () => {
    expect(startOfDate(testDatetimeStr6, 'day')).toEqual(new Date('2022-02-23 00:00:00.000'));
    expect(startOfDate(new Date(testDatetimeStr6), 'day')).toEqual(
      new Date('2022-02-23 00:00:00.000')
    );
  });

  it('should return start of the hour', () => {
    expect(startOfDate(testDatetimeStr6, 'hour')).toEqual(new Date('2022-02-23 01:00:00.000'));
    expect(startOfDate(new Date(testDatetimeStr6), 'hour')).toEqual(
      new Date('2022-02-23 01:00:00.000')
    );
  });

  it('should return start of the minute', () => {
    expect(startOfDate(testDatetimeStr6, 'minute')).toEqual(new Date('2022-02-23 01:23:00.000'));
    expect(startOfDate(new Date(testDatetimeStr6), 'minute')).toEqual(
      new Date('2022-02-23 01:23:00.000')
    );
  });

  it('should return start of the second', () => {
    expect(startOfDate(testDatetimeStr6, 'second')).toEqual(new Date('2022-02-23 01:23:45.000'));
    expect(startOfDate(new Date(testDatetimeStr6), 'second')).toEqual(
      new Date('2022-02-23 01:23:45.000')
    );
  });
});

describe('startOfByTimezone', () => {
  it('주어진 속성의 시작 시간을 반환해야 한다', () => {
    const targetDate = new Date('2024-02-15T16:15:15Z');
    const timezone = 'Asia/Seoul';

    const result1 = startOfByTimezone({ date: targetDate, property: 'month', timezone });
    const result2 = startOfByTimezone({ date: targetDate, property: 'year', timezone });
    const result3 = startOfByTimezone({ date: targetDate, property: 'day', timezone });
    const result4 = startOfByTimezone({ date: targetDate, property: 'hour', timezone });
    const result6 = startOfByTimezone({ date: targetDate, property: 'minute', timezone });

    expect(result1).toEqual(new Date('2024-01-31T15:00:00Z'));
    expect(result2).toEqual(new Date('2023-12-31T15:00:00Z'));
    expect(result3).toEqual(new Date('2024-02-15T15:00:00Z'));
    expect(result4).toEqual(new Date('2024-02-15T16:00:00Z'));
    expect(result6).toEqual(new Date('2024-02-15T16:15:00Z'));
  });

  it('연말 전환을 올바르게 처리해야 한다', () => {
    const targetDate = new Date('2023-12-31T15:01:30Z');
    const timezone = 'Asia/Seoul';

    const result = startOfByTimezone({ date: targetDate, property: 'minute', timezone });

    expect(result).toEqual(new Date('2023-12-31T15:01:00Z'));
  });

  describe('KST는 15시 기준으로 날짜가 다르다', () => {
    it('15시 이전 시각을 올바르게 처리한다.', () => {
      const targetDate = new Date('2024-02-29T00:00:00Z');
      const timezone = 'Asia/Seoul';

      const result = startOfByTimezone({ date: targetDate, property: 'month', timezone });

      expect(result).toEqual(new Date('2024-01-31T15:00:00Z'));
    });

    it('15시 이후 시각을 올바르게 처리한다.', () => {
      const targetDate = new Date('2024-02-29T15:00:00Z');
      const timezone = 'Asia/Seoul';

      const result = startOfByTimezone({ date: targetDate, property: 'month', timezone });

      expect(result).toEqual(new Date('2024-02-29T15:00:00Z'));
    });
  });

  describe('시간대가 다른 경우', () => {
    it('서울', () => {
      const targetDate = new Date('2024-02-15T16:15:15Z');
      const timezone = 'Asia/Seoul';

      const result = startOfByTimezone({ date: targetDate, property: 'day', timezone });

      expect(result).toEqual(new Date('2024-02-15T15:00:00Z'));
    });

    it('PST', () => {
      const targetDate = new Date('2024-02-15T16:15:15Z');
      const timezone = 'PST8PDT';

      const result = startOfByTimezone({ date: targetDate, property: 'day', timezone });

      expect(result).toEqual(new Date('2024-02-15T08:00:00Z'));
    });
  });
});

describe('endOfByTimezone', () => {
  it('주어진 속성의 끝 시간을 반환해야 한다', () => {
    const targetDate = new Date('2024-02-15T16:15:15Z');
    const timezone = 'Asia/Seoul';

    const result = endOfByTimezone({ date: targetDate, property: 'month', timezone });
    const result2 = endOfByTimezone({ date: targetDate, property: 'year', timezone });
    const result3 = endOfByTimezone({ date: targetDate, property: 'day', timezone });
    const result4 = endOfByTimezone({ date: targetDate, property: 'hour', timezone });
    const result6 = endOfByTimezone({ date: targetDate, property: 'minute', timezone });

    expect(result).toEqual(new Date('2024-02-29T15:00:00Z'));
    expect(result2).toEqual(new Date('2024-12-31T15:00:00Z'));
    expect(result3).toEqual(new Date('2024-02-16T15:00:00Z'));
    expect(result4).toEqual(new Date('2024-02-15T17:00:00Z'));
    expect(result6).toEqual(new Date('2024-02-15T16:16:00Z'));
  });

  it('주어진 속성의 끝 시간을 반환해야 한다. 2', () => {
    const targetDate = new Date('2022-12-31T17:00:00Z');
    const timezone = 'Asia/Seoul';

    const result = endOfByTimezone({ date: targetDate, property: 'year', timezone });

    expect(result).toEqual(new Date('2023-12-31T15:00:00Z'));
  });

  it('연말 전환을 올바르게 처리해야 한다', () => {
    const targetDate = new Date('2023-12-15T00:00:00Z');
    const timezone = 'Asia/Seoul';

    const result = endOfByTimezone({ date: targetDate, property: 'month', timezone });

    expect(result).toEqual(new Date('2023-12-31T15:00:00Z'));
  });

  it('윤년을 올바르게 처리해야 한다 (15시 이후)', () => {
    const targetDate = new Date('2023-12-31T16:00:00Z');
    const timezone = 'Asia/Seoul';

    const result = endOfByTimezone({ date: targetDate, property: 'year', timezone });

    expect(result).toEqual(new Date('2024-12-31T15:00:00Z'));
  });

  describe('15시 기준으로 날짜가 다르다', () => {
    it('15시 이전 시각을 올바르게 처리한다.', () => {
      const targetDate = new Date('2024-02-29T00:00:00Z');
      const timezone = 'Asia/Seoul';

      const result = endOfByTimezone({ date: targetDate, property: 'month', timezone });

      expect(result).toEqual(new Date('2024-02-29T15:00:00Z'));
    });

    it('15시 이후 시각을 올바르게 처리한다.', () => {
      const targetDate = new Date('2024-12-31T15:01:00Z');
      const timezone = 'Asia/Seoul';

      const result = endOfByTimezone({ date: targetDate, property: 'minute', timezone });

      expect(result).toEqual(new Date('2024-12-31T15:02:00Z'));
    });
  });

  describe('시간대가 다른 경우', () => {
    it('서울', () => {
      const targetDate = new Date('2024-02-29T16:15:15Z');
      const timezone = 'Asia/Seoul';

      const result = endOfByTimezone({ date: targetDate, property: 'month', timezone });

      expect(result).toEqual(new Date('2024-03-31T15:00:00Z'));
    });

    it('UTC', () => {
      const targetDate = new Date('2024-02-15T16:15:15Z');
      const timezone = 'UTC';

      const result = endOfByTimezone({ date: targetDate, property: 'month', timezone });

      expect(result).toEqual(new Date('2024-03-01T00:00:00Z'));
    });
  });
});

describe('isLastDateOfMonth', () => {
  it('should accept Date object and check last date of the month', () => {
    expect(isLastDateOfMonth(parseDate('2020-02-28'))).toBe(false);
    expect(isLastDateOfMonth(parseDate('2020-02-29'))).toBe(true);
    expect(isLastDateOfMonth(parseDate('2021-02-28'))).toBe(true);
  });

  it('should accept string and check last date of the month', () => {
    expect(isLastDateOfMonth('2020-02-28')).toBe(false);
    expect(isLastDateOfMonth('2020-02-29')).toBe(true);
    expect(isLastDateOfMonth('2021-02-28')).toBe(true);
  });
});

describe('diff', () => {
  test('should throw error', () => {
    expect(() => diffDate('string', '2020-01-01- 10:00:00', 'year')).toThrow();
    expect(() => diffDate('2020-01-01- 10:00:00', 'string', 'year')).toThrow();
    expect(() => diffDate('', '', 'year')).toThrow();
  });
  test('get date diff', () => {
    // year
    expect(diffDate('2020-02-10 15:00:00', '2021-02-09 15:00:00', 'year')).toBe(0);
    expect(diffDate('2020-02-10 15:00:00', '2021-02-10 15:00:00', 'year')).toBe(1);
    expect(diffDate('2020-02-10 15:00:00', '2022-02-09 15:00:00', 'year')).toBe(1);
    expect(diffDate('2020-02-10 15:00:00', '2022-02-10 15:00:00', 'year')).toBe(2);

    // month
    expect(diffDate('2020-02-10 15:00:00', '2020-03-09 15:00:00', 'month')).toBe(0);
    expect(diffDate('2020-02-10 15:00:00', '2020-03-10 15:00:00', 'month')).toBe(1);
    expect(diffDate('2020-02-10 15:00:00', '2020-03-11 15:00:00', 'month')).toBe(1);
    expect(diffDate('2020-02-10 15:00:00', '2021-02-09 15:00:00', 'month')).toBe(11);
    expect(diffDate('2020-02-10 15:00:00', '2021-02-10 15:00:00', 'month')).toBe(12);

    // date
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 15:00:00', 'day')).toBe(0);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-11 15:00:00', 'day')).toBe(1);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-12 15:00:00', 'day')).toBe(2);
    expect(diffDate('2020-02-10 15:00:00', '2020-03-10 15:00:00', 'day')).toBe(29);

    // hour
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 15:59:59', 'hour')).toBe(0);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 16:00:00', 'hour')).toBe(1);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-11 15:00:00', 'hour')).toBe(24);

    // minute
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 15:00:59', 'minute')).toBe(0);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 15:01:00', 'minute')).toBe(1);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 15:20:00', 'minute')).toBe(20);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 16:00:00', 'minute')).toBe(60);

    // second
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 15:00:00.999', 'second')).toBe(0);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 15:00:01', 'second')).toBe(1);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 15:00:59', 'second')).toBe(59);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 15:01:00', 'second')).toBe(60);
    expect(diffDate('2020-02-10 15:00:00', '2020-02-10 16:00:00', 'second')).toBe(3600);
  });

  test('since가 until보다 큰 경우', () => {
    const since1 = '2020-02-10 15:00:00';
    const since2 = '2020-02-10 15:00:00';

    const until1 = '2022-02-09 15:00:00';
    const until2 = '2022-02-10 15:00:00';

    expect(diffDate(since1, until1, 'year')).toBe(-diffDate(until1, since1, 'year'));
    expect(diffDate(since2, until2, 'year')).toBe(-diffDate(until2, since2, 'year'));

    expect(diffDate(since1, until1, 'month')).toBe(-diffDate(until1, since1, 'month'));
    expect(diffDate(since2, until2, 'month')).toBe(-diffDate(until2, since2, 'month'));

    expect(diffDate(since1, until1, 'day')).toBe(-diffDate(until1, since1, 'day'));
    expect(diffDate(since2, until2, 'day')).toBe(-diffDate(until2, since2, 'day'));

    expect(diffDate(since1, until1, 'hour')).toBe(-diffDate(until1, since1, 'hour'));
    expect(diffDate(since2, until2, 'hour')).toBe(-diffDate(until2, since2, 'hour'));

    expect(diffDate(since1, until1, 'minute')).toBe(-diffDate(until1, since1, 'minute'));
    expect(diffDate(since2, until2, 'minute')).toBe(-diffDate(until2, since2, 'minute'));

    expect(diffDate(since1, until1, 'second')).toBe(-diffDate(until1, since1, 'second'));
    expect(diffDate(since2, until2, 'second')).toBe(-diffDate(until2, since2, 'second'));
  });
});

describe('min', () => {
  it('should throw error when invalid date is given', () => {
    expect(() => minDate('zzzzz', new Date())).toThrow();
    expect(() => minDate('2021-13-01 00:00:00', new Date())).toThrow();
    expect(() => minDate(new Date('zzzzz'), new Date())).toThrow();
  });

  it('should return former date', () => {
    expect(minDate(testDateStr, testDatetimeStr6)).toEqual(testDate);
    expect(minDate(testDatetimeStr6, testDateStr)).toEqual(testDate);
    expect(minDate(testDate, new Date(testDatetimeStr6))).toEqual(testDate);
    expect(minDate(new Date(testDatetimeStr6), testDate)).toEqual(testDate);
    expect(minDate(testDatetimeStr6, testDatetimeStr3, testDate)).toEqual(testDate);
  });
});

describe('format', () => {
  it('should return formatted date string in specific format', () => {
    const testDatetime = new Date(testDatetimeStr8);
    expect(formatDate(testDatetime, { format: DATE_FORMAT })).toEqual(testDateStr);
    expect(formatDate(testDatetime, { format: DATETIME_FORMAT_WITH_MILLIS })).toEqual(
      testDatetimeStr8
    );
    expect(formatDate(testDatetime, { format: TIMESTAMP_FORMAT })).toEqual(testTimestampStr);
    expect(formatDate(testDatetime, { format: 'YYYY-MM-DD HH:mm:ss.SSS' })).toEqual(
      testDatetimeStr6
    );
    expect(formatDate(testDatetime, { format: 'YYYY년 MM월 DD일' })).toEqual('2022년 02월 23일');
    expect(formatDate(testDatetime, { format: 'YYYY년 M월 D일 H시 m분 s초' })).toEqual(
      '2022년 2월 23일 1시 23분 45초'
    );
    expect(formatDate(testDatetime, { format: 'M/D' })).toEqual('2/23');
    expect(formatDate(testDatetime, { format: 'MM월 DD일' })).toEqual('02월 23일');
    expect(formatDate(testDatetime, { format: 'YY/MM/DD' })).toEqual('22/02/23');
  });

  it('should return formatted date string in default format', () => {
    expect(formatDate(new Date(testDatetimeStr8))).toBe(testDatetimeStr5);
    expect(formatDate(new Date('2022-02-22T22:23:45-03:00'))).toBe(testDatetimeStr5);
    expect(formatDate(new Date('2022-02-23T07:08:45+05:45'))).toBe(testDatetimeStr5);
  });

  it('should return formatted date string of local time when isUtc is false', () => {
    const testDatetime = new Date(testDatetimeStr8);
    expect(
      formatDate(testDatetime, {
        format: 'YYYY-MM-DDTHH:mm:ss.SSSZZ',
        isUtc: false,
        timeZone: 'Asia/Seoul',
      })
    ).toEqual(`2022-02-23T10:23:45.678+0900`);
    expect(formatDate(testDatetime, { isUtc: false, timeZone: 'PST8PDT' })).toBe(
      '2022-02-22 17:23:45'
    );
  });
});

describe('formatInIso8601', () => {
  it('should return formatted date string in ISO format string', () => {
    const testDatetime = new Date(testDatetimeStr8);
    expect(formatInIso8601(testDatetime, { format: DATE_FORMAT })).toEqual(testDateStr);
    expect(formatInIso8601(testDatetime, { format: DATETIME_FORMAT })).toEqual(testDatetimeStr5);
    expect(formatInIso8601(testDatetime, { format: DATETIME_FORMAT_WITH_MILLIS })).toEqual(
      testDatetimeStr8
    );
  });
  it('should return formatted date string of local time', () => {
    const testDatetime = new Date(testDatetimeStr8);
    expect(
      formatInIso8601(testDatetime, {
        format: DATETIME_FORMAT,
        isUtc: false,
        timeZone: 'Asia/Seoul',
      })
    ).toEqual(`2022-02-23T10:23:45+09:00`);
    expect(formatInIso8601(testDatetime, { isUtc: false, timeZone: 'PST8PDT' })).toEqual(
      '2022-02-22T17:23:45-08:00'
    );
  });
});

describe('getDateString', () => {
  it('should return formatted date string', () => {
    expect(getDateString(new Date(testDatetimeStr8))).toBe(testDateStr);
  });
  it('should return formatted date string of local time', () => {
    expect(getDateString(new Date(testDatetimeStr6), false)).toBe(testDateStr);
  });
});

describe('getDatetimeString', () => {
  it('should return format datetime string', () => {
    expect(getDatetimeString(new Date(testDatetimeStr8))).toBe(testDatetimeStr5);
  });
  it('should return formatted datetime string of local time', () => {
    expect(getDatetimeString(new Date(testDatetimeStr8), false)).toBe('2022-02-23 10:23:45');
  });
});

describe('getTimestampString', () => {
  it('should return formatted timestamp string', () => {
    expect(getTimestampString(new Date(testDatetimeStr8))).toBe(testTimestampStr);
  });
  it('should return formatted timestamp string of local time', () => {
    expect(getTimestampString(new Date(testDatetimeStr8), false)).toBe('20220223102345678');
  });
});

describe('durationTo', () => {
  it('시간을 초로 바꾸어 리턴한다.', () => {
    expect(durationTo('09:10:30')).toEqual(33030);
    expect(durationTo('09:40:00')).toEqual(34800);
    expect(durationTo('12:40:00')).toEqual(45600);
    expect(durationTo('109:40:00')).toEqual(394800);
    expect(durationTo('10:30')).toEqual(37800);
    expect(durationTo('12:4')).toEqual(43440);
    expect(durationTo('40:20')).toEqual(145200);
    expect(durationTo('9')).toEqual(32400);
  });

  it('숫자가 아닌값이 들어가면 에러가 발생한다.', () => {
    expect(durationTo('09:10:3ㅁ')).toEqual(0);
  });
  it('숫자 네가지 이상 넣으면 에러가 발생한다.', () => {
    expect(durationTo('09:10:31:12')).toEqual(0);
  });
  it('시간양식이 아니면 에러가 발생한다.', () => {
    expect(durationTo('-09:10:31')).toEqual(0);
    expect(durationTo('09:-10:31')).toEqual(0);
    expect(durationTo('09:10:-31')).toEqual(0);
    expect(durationTo('09:10:60')).toEqual(0);
    expect(durationTo('09:60:50')).toEqual(0);
  });
});

describe('fromNow', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01')); // 00:00:00Z
  });
  afterAll(() => {
    jest.clearAllTimers();
  });

  it('should return year diff from now if the diff is greater than or equal to a year', () => {
    expect(fromNow(new Date('2021-01-01'))).toEqual('1년');
    expect(fromNow(new Date('2019-01-01'))).toEqual('1년');
    expect(fromNow(new Date('2022-01-01'))).toEqual('2년');
    expect(fromNow(new Date('2018-01-01'))).toEqual('2년');

    expect(fromNow(new Date('2021-12-31'))).toEqual('1년');
    expect(fromNow(new Date('2019-12-31'))).not.toEqual('1년');
    expect(fromNow(new Date('2022-12-31'))).toEqual('2년');
    expect(fromNow(new Date('2018-12-31'))).not.toEqual('2년');
  });
  it('should return month diff from now if the diff is greater than a month', () => {
    expect(fromNow(new Date('2020-12-01'))).toEqual('11달');
    expect(fromNow(new Date('2020-12-31'))).toEqual('11달');
    expect(fromNow(new Date('2020-02-01'))).toEqual('1달');
    expect(fromNow(new Date('2020-02-28'))).toEqual('1달');
    expect(fromNow(new Date('2019-12-01'))).toEqual('1달');
    expect(fromNow(new Date('2019-12-02'))).not.toEqual('1달');

    // `shouldHumanize` cases
    expect(fromNow(new Date('2019-11-02'))).toEqual('2달');
    expect(fromNow(new Date('2019-11-30'))).toEqual('2달');
    expect(fromNow(new Date('2019-02-01'))).toEqual('11달');
    expect(fromNow(new Date('2019-02-02'))).toEqual('11달');
  });
  it('should return day diff from now if the diff is greater than or equal to a day', () => {
    expect(fromNow(new Date('2020-01-02'))).toEqual('1일');
    expect(fromNow(new Date('2020-01-31'))).toEqual('30일');
    expect(fromNow(new Date('2019-12-31'))).toEqual('1일');
    expect(fromNow(new Date('2019-12-02'))).toEqual('30일');
  });
  it('should return hour diff from now if the diff is greater or equal than an hour', () => {
    expect(fromNow(new Date('2020-01-01 01:00:00Z'))).toEqual('1시간');
    expect(fromNow(new Date('2020-01-01 23:00:00Z'))).toEqual('23시간');
    expect(fromNow(new Date('2019-12-31 23:00:00Z'))).toEqual('1시간');
    expect(fromNow(new Date('2019-12-31 01:00:00Z'))).toEqual('23시간');
  });
  it('should return minute diff from now if the diff is greater or equal than a minute', () => {
    expect(fromNow(new Date('2020-01-01 00:59:00Z'))).toEqual('59분');
    expect(fromNow(new Date('2020-01-01 00:01:00Z'))).toEqual('1분');
    expect(fromNow(new Date('2019-12-31 23:01:00Z'))).toEqual('59분');
    expect(fromNow(new Date('2019-12-31 23:59:00Z'))).toEqual('1분');
  });
  it('should return second diff from now if the diff is greater or equal than a second', () => {
    expect(fromNow(new Date('2020-01-01 00:00:59Z'))).toEqual('59초');
    expect(fromNow(new Date('2020-01-01 00:00:01Z'))).toEqual('1초');
    expect(fromNow(new Date('2019-12-31 23:59:01Z'))).toEqual('59초');
    expect(fromNow(new Date('2019-12-31 23:59:59Z'))).toEqual('1초');
  });
  it('should return just now', () => {
    expect(fromNow(new Date())).toEqual('금방');
    expect(fromNow(new Date('2020-01-01 00:00:00.001Z'))).toEqual('금방');
    expect(fromNow(new Date('2020-01-01 00:00:00.999Z'))).toEqual('금방');
  });
});

describe('isAdult', () => {
  describe('PST timezone(-1 day)', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2024-10-01 06:59:00Z')); // 2024-09-30 23:59:00 GMT-0700
    });
    afterAll(() => {
      jest.clearAllTimers();
    });
    it('should return true if the age is over 19', () => {
      expect(isAdult(parseDate('2000-10-01'), TIMEZONE_PST)).toBe(true); // 23
      expect(isAdult(parseDate('2003-10-01'), TIMEZONE_PST)).toBe(true); // 20
      expect(isAdult(parseDate('2005-09-30'), TIMEZONE_PST)).toBe(true); // 19

      expect(isAdult('2000-10-01', TIMEZONE_PST)).toBe(true);
      expect(isAdult('2003-10-01', TIMEZONE_PST)).toBe(true);
      expect(isAdult('2005-09-30', TIMEZONE_PST)).toBe(true);
      expect(isAdult(parseByFormatDate('20001001', 'YYYYMMDD'), TIMEZONE_PST)).toBe(true);
      expect(isAdult(parseByFormatDate('20031001', 'YYYYMMDD'), TIMEZONE_PST)).toBe(true);
      expect(isAdult(parseByFormatDate('20050930', 'YYYYMMDD'), TIMEZONE_PST)).toBe(true);
    });

    it('should return false if the age is under 19', () => {
      expect(isAdult(parseDate('2022-10-01'), TIMEZONE_PST)).toBe(false); // 1
      expect(isAdult(parseDate('2005-10-01'), TIMEZONE_PST)).toBe(false); // 18

      expect(isAdult('2022-10-01', TIMEZONE_PST)).toBe(false);
      expect(isAdult('2005-10-01', TIMEZONE_PST)).toBe(false);
      expect(isAdult(parseByFormatDate('20221001', 'YYYYMMDD'), TIMEZONE_PST)).toBe(false);
      expect(isAdult(parseByFormatDate('20051001', 'YYYYMMDD'), TIMEZONE_PST)).toBe(false);
    });
  });

  describe('PST timezone(normal day)', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2024-10-01 07:00:00Z')); // 2024-10-01 00:00:00 GMT-0700
    });
    afterAll(() => {
      jest.clearAllTimers();
    });
    it('should return true if the age is over 19', () => {
      expect(isAdult(parseDate('2000-10-01'), TIMEZONE_PST)).toBe(true); // 23
      expect(isAdult(parseDate('2003-10-01'), TIMEZONE_PST)).toBe(true); // 20
      expect(isAdult(parseDate('2005-10-01'), TIMEZONE_PST)).toBe(true); // 19

      expect(isAdult('2000-10-01', TIMEZONE_PST)).toBe(true);
      expect(isAdult('2003-10-01', TIMEZONE_PST)).toBe(true);
      expect(isAdult('2005-10-01', TIMEZONE_PST)).toBe(true);

      expect(isAdult(parseByFormatDate('20001001', 'YYYYMMDD'), TIMEZONE_PST)).toBe(true);
      expect(isAdult(parseByFormatDate('20031001', 'YYYYMMDD'), TIMEZONE_PST)).toBe(true);
      expect(isAdult(parseByFormatDate('20051001', 'YYYYMMDD'), TIMEZONE_PST)).toBe(true);
    });

    it('should return false if the age is under 19', () => {
      expect(isAdult(parseDate('2022-10-01'), TIMEZONE_PST)).toBe(false); // 2
      expect(isAdult(parseDate('2005-10-02'), TIMEZONE_PST)).toBe(false); // 18

      expect(isAdult('2022-10-01', TIMEZONE_PST)).toBe(false);
      expect(isAdult('2005-10-02', TIMEZONE_PST)).toBe(false);
      expect(isAdult(parseByFormatDate('20221001', 'YYYYMMDD'), TIMEZONE_PST)).toBe(false);
      expect(isAdult(parseByFormatDate('20051002', 'YYYYMMDD'), TIMEZONE_PST)).toBe(false);
    });
  });

  describe('Seoul AND Tokyo timezone', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2024-10-01 06:59:00Z')); // 2024-10-01 15:59:00 GMT+0900
    });
    afterAll(() => {
      jest.clearAllTimers();
    });
    it('should return true if the age is over 19', () => {
      expect(isAdult(parseDate('2000-10-01'), TIMEZONE_SEOUL)).toBe(true); // 24
      expect(isAdult(parseDate('2000-10-01'), TIMEZONE_TOKYO)).toBe(true); // 24
      expect(isAdult(parseDate('2003-10-01'), TIMEZONE_SEOUL)).toBe(true); // 21
      expect(isAdult(parseDate('2003-10-01'), TIMEZONE_TOKYO)).toBe(true); // 21
      expect(isAdult(parseDate('2005-10-01'), TIMEZONE_SEOUL)).toBe(true); // 19
      expect(isAdult(parseDate('2005-10-01'), TIMEZONE_TOKYO)).toBe(true); // 19

      expect(isAdult('2000-10-01', TIMEZONE_SEOUL)).toBe(true);
      expect(isAdult('2000-10-01', TIMEZONE_TOKYO)).toBe(true);
      expect(isAdult('2003-10-01', TIMEZONE_SEOUL)).toBe(true);
      expect(isAdult('2003-10-01', TIMEZONE_TOKYO)).toBe(true);
      expect(isAdult('2005-10-01', TIMEZONE_SEOUL)).toBe(true);
      expect(isAdult('2005-10-01', TIMEZONE_TOKYO)).toBe(true);

      expect(isAdult(parseByFormatDate('20001001', 'YYYYMMDD'), TIMEZONE_SEOUL)).toBe(true);
      expect(isAdult(parseByFormatDate('20031001', 'YYYYMMDD'), TIMEZONE_SEOUL)).toBe(true);
      expect(isAdult(parseByFormatDate('20051001', 'YYYYMMDD'), TIMEZONE_SEOUL)).toBe(true);
    });

    it('should return false if the age is under 19', () => {
      expect(isAdult(parseDate('2022-10-01'), TIMEZONE_SEOUL)).toBe(false); // 2
      expect(isAdult(parseDate('2022-10-01'), TIMEZONE_TOKYO)).toBe(false); // 2
      expect(isAdult(parseDate('2005-10-02'), TIMEZONE_SEOUL)).toBe(false); // 18
      expect(isAdult(parseDate('2005-10-02'), TIMEZONE_TOKYO)).toBe(false); // 18

      expect(isAdult('2022-10-01', TIMEZONE_SEOUL)).toBe(false);
      expect(isAdult('2022-10-01', TIMEZONE_TOKYO)).toBe(false);
      expect(isAdult('2005-10-02', TIMEZONE_SEOUL)).toBe(false);
      expect(isAdult('2005-10-02', TIMEZONE_TOKYO)).toBe(false);

      expect(isAdult(parseByFormatDate('20221001', 'YYYYMMDD'), TIMEZONE_SEOUL)).toBe(false);
      expect(isAdult(parseByFormatDate('20051002', 'YYYYMMDD'), TIMEZONE_SEOUL)).toBe(false);
    });

    describe('getTimezoneOffsetInHours', () => {
      it('Asia/Seoul', () => {
        const date = new Date('2022-02-23T00:00:00Z');
        const timezone = 'Asia/Seoul';
        expect(getTimezoneOffsetInHours(date, timezone)).toBe(9);
      });

      it('Asia/Tokyo', () => {
        const date = new Date('2022-02-23T00:00:00Z');
        const timezone = 'Asia/Tokyo';
        expect(getTimezoneOffsetInHours(date, timezone)).toBe(9);
      });

      it('PST8PDT', () => {
        const date = new Date('2022-02-23T00:00:00Z');
        const timezone = 'PST8PDT';
        expect(getTimezoneOffsetInHours(date, timezone)).toBe(-8);
      });

      it('UTC', () => {
        const date = new Date('2022-02-23T00:00:00Z');
        const timezone = 'UTC';
        expect(getTimezoneOffsetInHours(date, timezone)).toBe(0);
      });
    });
  });
});
