import sortedUniq from "lodash.sorteduniq";
import compact from 'lodash.compact'

const times = (n) => Array.from(Array(n)).map((_, i) => i);

export const equalIntervals = (values, steps = 5) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const inc = (max - min) / steps;

  // 0.001 is added to account for rounding errors on the highest values
  return times(steps).reduce((all, i) => [ ...all, ((i + 1) * inc) + min + 0.001 ], []);
};

export const quantileIntervals = (values, steps = 5) => {
  // Have to remove undefined values or this breaks
  const compactedValues = compact(values);
  const perBucket = Math.floor(compactedValues.length / steps);
  const sortedValues = [ ...compactedValues ].sort((a,b) => a - b);
  const intervals = times(steps)
    .reduce((all, i) => [ ...all, sortedValues[perBucket + i*perBucket - 1]], []);

  intervals[intervals.length - 1] = sortedValues[sortedValues.length - 1];

  return sortedUniq(intervals);
}
