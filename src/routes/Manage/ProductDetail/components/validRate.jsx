const rightPrecision = (value, digit) => {
  let right = true;
  let dotNum = 0;
  let precision = 0;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (dotNum === 1) {
      precision += 1;
    }
    if (char === '.') {
      dotNum += 1;
      if (dotNum > 1) {
        right = false;
      }
    }
  }
  if (precision > digit) {
    right = false;
  }
  return right;
};

const numOnly = (value, dotContained) => {
  let result = true;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    const dot = dotContained ? '.' : '';
    const charIsNumber = `0123456789${dot}`.includes(char);
    if (!charIsNumber) {
      result = false;
    }
  }
  if (['0', '0.', '0.0'].includes(value)) {
    result = false;
  }
  return result;
};

const validRate = (value, digit) => rightPrecision(value, digit)
  && numOnly(value, true)
  && value.length <= 12;
  
export default validRate;
