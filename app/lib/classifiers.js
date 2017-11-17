const times = (n) => Array.from(Array(n)).map((_, i) => i);

export const equal = (values, steps = 5) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const inc = (max - min) / steps;

  return times(steps).reduce((all, i) => [ ...all, ((i + 1) * inc) + min ], []);
};
