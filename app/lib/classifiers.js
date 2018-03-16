const times = (n) => Array.from(Array(n)).map((_, i) => i);

export const equalIntervals = (values, steps = 5) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const inc = (max - min) / steps;

  // 0.001 is added to account for rounding errors on the highest values
  return times(steps).reduce((all, i) => [ ...all, ((i + 1) * inc) + min + 0.001 ], []);
};

export const quantileIntervals = (values, steps = 5) => {
  const perBucket = Math.floor(values.length / steps);
  const sortedValues = [ ...values ].sort((a,b) => a - b);
  const outlierCount = sortedValues.length % perBucket;

  const intervals = times(steps)
    .reduce((all, i) => [ ...all, sortedValues[perBucket + i*perBucket - 1]], []);

  if (outlierCount > 0)
    intervals[intervals.length - 1] = sortedValues[sortedValues.length - 1];

  return intervals;
}
