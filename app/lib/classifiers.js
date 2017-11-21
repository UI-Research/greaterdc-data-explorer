const times = (n) => Array.from(Array(n)).map((_, i) => i);

export const equalIntervals = (values, steps = 5) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const inc = (max - min) / steps;

  // 0.001 is added to account for rounding errors on the highest values
  return times(steps).reduce((all, i) => [ ...all, ((i + 1) * inc) + min + 0.001 ], []);
};
