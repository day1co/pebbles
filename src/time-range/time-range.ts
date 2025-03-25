import { decimalRoundDown, decimalRoundUp } from '../number-util';
import { TimeSection } from './time-range.interface';

/**
 * TimeRange manages a collection of time sections with capabilities for merging overlapping sections,
 * calculating total durations, and finding unwatched time periods.
 *
 * @param sections Initial time sections to include
 * @param decimalPlaces Decimal precision for time calculations (default 0)
 * @param bufferSeconds Additional buffer time to add around sections (default 0)
 */
export class TimeRange {
  private sections: Array<TimeSection>;
  private readonly decimalPlaces: number;
  private readonly bufferSeconds: number;

  constructor(sections: Array<TimeSection> = [], decimalPlaces = 0, bufferSeconds = 0) {
    this.sections = [...sections];
    this.decimalPlaces = decimalPlaces;
    this.bufferSeconds = bufferSeconds;

    if (this.bufferSeconds > 0) {
      this.applyBufferToAllSections();
    }
  }

  /**
   * Adds a new time section to the collection
   */
  public add(section: TimeSection): void {
    this.sections.push(section);
  }

  /**
   * Adds a new time section with buffer applied
   */
  public bufferAdd(section: TimeSection): void {
    if (this.bufferSeconds > 0) {
      const bufferedSection = this.applyBufferToSection(section);
      this.sections.push(bufferedSection);
    } else {
      this.sections.push(section);
    }
  }

  /**
   * Sorts and merges overlapping time sections
   * @param enableLogging Whether to log the merging process
   */
  public merge(enableLogging = false): void {
    if (enableLogging) {
      // eslint-disable-next-line no-console
      console.log('Merging sections:', this.sections);
    }

    this.sections = this.sections.sort(this.sortSectionsByStartTime).reduce(this.mergeOverlappingSections, []);

    if (enableLogging) {
      // eslint-disable-next-line no-console
      console.log('Merged result:', this.sections);
    }
  }

  /**
   * Returns all time sections
   */
  public value(): Array<TimeSection> {
    return this.sections;
  }

  /**
   * Calculates the total interval across all sections
   */
  public totalInterval(): number {
    const result = this.sections.reduce((sum, section) => {
      const interval = decimalRoundUp(section.interval, this.decimalPlaces);
      const end = decimalRoundUp(section.end, this.decimalPlaces);
      const start = decimalRoundUp(section.start, this.decimalPlaces);
      const durationFromBounds = end - start;

      // Use the larger of interval or calculated duration
      const effectiveInterval = Math.max(interval, durationFromBounds);
      return sum + effectiveInterval;
    }, 0);

    return decimalRoundDown(result, this.decimalPlaces);
  }

  /**
   * Calculates the total play time across all sections
   */
  public totalPlayTime(): number {
    const result = this.sections.reduce((sum, section) => {
      const end = decimalRoundUp(section.end, this.decimalPlaces);
      const start = decimalRoundUp(section.start, this.decimalPlaces);
      return sum + (end - start);
    }, 0);

    return decimalRoundDown(result, this.decimalPlaces);
  }

  /**
   * Identifies unwatched time ranges between 0 and endTime
   * @param endTime The end time to consider
   * @returns An array of {start, end} ranges representing unwatched periods
   */
  public getUnwatchedTimeRange(endTime: number): Array<Omit<TimeSection, 'interval'>> {
    if (this.sections.length === 0) {
      return [{ start: 0, end: endTime }];
    }

    const unwatchedRanges: Array<Omit<TimeSection, 'interval'>> = [];
    const sortedSections = [...this.sections].sort((a, b) => a.start - b.start);

    // Add unwatched range from beginning if needed
    if (sortedSections[0].start > 0) {
      unwatchedRanges.push({
        start: 0,
        end: sortedSections[0].start,
      });
    }

    // Add unwatched ranges between watched sections
    for (let i = 0; i < sortedSections.length - 1; i++) {
      if (sortedSections[i].end < sortedSections[i + 1].start) {
        unwatchedRanges.push({
          start: sortedSections[i].end,
          end: sortedSections[i + 1].start,
        });
      }
    }

    // Add unwatched range at the end if needed
    const lastSection = sortedSections[sortedSections.length - 1];
    const lastSectionEnd = decimalRoundUp(lastSection.end, this.decimalPlaces);
    const roundedEndTime = decimalRoundUp(endTime, this.decimalPlaces);

    if (lastSectionEnd < roundedEndTime) {
      unwatchedRanges.push({
        start: lastSection.end,
        end: endTime,
      });
    }

    return unwatchedRanges;
  }

  /**
   * Apply buffer to all existing sections
   */
  private applyBufferToAllSections(): void {
    for (let i = 0; i < this.sections.length; i++) {
      this.sections[i] = this.applyBufferToSection(this.sections[i]);
    }
  }

  /**
   * Apply buffer to a single section
   */
  private applyBufferToSection(section: TimeSection): TimeSection {
    const adjustedStart = Math.max(0, section.start - this.bufferSeconds);
    const startDifference = Math.min(section.start - this.bufferSeconds, 0);

    return {
      start: adjustedStart,
      end: section.end + this.bufferSeconds,
      interval: startDifference + section.interval + this.bufferSeconds * 2,
    };
  }

  /**
   * Sort function for ordering sections by start time
   */
  private sortSectionsByStartTime = (a: TimeSection, b: TimeSection): number => {
    return a.start < b.start ? -1 : 1;
  };

  /**
   * Reducer function to merge overlapping sections
   */
  private mergeOverlappingSections = (
    mergedSections: Array<TimeSection>,
    currentSection: TimeSection
  ): Array<TimeSection> => {
    if (mergedSections.length === 0) {
      return [currentSection];
    }

    const prevSection = mergedSections[mergedSections.length - 1];

    if (prevSection.end >= currentSection.start) {
      // Sections overlap - merge them
      prevSection.end = Math.max(prevSection.end, currentSection.end);
      prevSection.interval = decimalRoundDown(
        decimalRoundUp(prevSection.interval, this.decimalPlaces) +
          decimalRoundUp(currentSection.interval, this.decimalPlaces),
        this.decimalPlaces
      );
    } else {
      // No overlap - add as separate section
      mergedSections.push(currentSection);
    }

    return mergedSections;
  };
}
