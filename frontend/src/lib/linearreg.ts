// source: https://hazlo.medium.com/linear-regression-from-scratch-in-js-first-foray-into-ml-for-web-developers-867cfcae8fde

export interface Point {
  x: Date;
  y: number;
}

export interface Regressor {
  slope: number;
  intercept: number;
}

export function linearRegression(data: Point[]): Regressor {
  const regressor = {
    slope: 0,
    intercept: 0,
  };

  const xValues = data.map((d) => d.x.getTime());
  const yValues = data.map((d) => d.y);

  const xAvg = xValues.reduce((a, b) => a + b, 0) / xValues.length;
  const yAvg = yValues.reduce((a, b) => a + b, 0) / yValues.length;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < xValues.length; i++) {
    numerator += (xValues[i] - xAvg) * (yValues[i] - yAvg);
    denominator += (xValues[i] - xAvg) ** 2;
  }

  regressor.slope = numerator / denominator;
  regressor.intercept = yAvg - regressor.slope * xAvg;

  return regressor;
}
