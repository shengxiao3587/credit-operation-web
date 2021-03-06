import config from '../config.json';

/*
* get url prefix according to the env, default local
* */
export const getEnv = () => {
  let env = 'local';
  if (__ONLINE__) {
    env = 'online';
  } else if (__PRE__) {
    env = 'pre';
  } else if (__QAIF__) {
    env = 'qaif';
  } else if (__QAFC__) {
    env = 'qafc';
  } else if (__DEV__) {
    env = 'dev';
  } else if (__LOCAL__) {
    env = 'local';
  }
  return env;
};

export const getBaseUrl = () => {
  const address = config.apiAddress;
  if (__MOCK__) {
    return address.mock || window.location.origin;
  }
  return address[getEnv()];
};

export const getUserBaseUrl = () => {
  const address = config.userApiAddress;
  if (__MOCK__) {
    return address.mock || window.location.origin;
  }
  return address[getEnv()];
};

export const getDictBaseUrl = () => {
  const address = config.dictApiAddress;
  if (__MOCK__) {
    return address.mock || window.location.origin;
  }
  return address[getEnv()];
};

export function createAction(type, ...argNames) {
  return function ca(...args) {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}

export function formatMoney(num, reduce, precision, dropZero, fillZero, notMoney) {
  let newNum = +num;
  if (typeof newNum !== 'number' || Number.isNaN(newNum)) {
    newNum = '--';
  }
  const numStr = `${newNum}`;
  const nums = numStr.split('.');
  const digitalNum = (nums[1] || '').length;
  let resPrecision = digitalNum;

  if (reduce) {
    const leftNum = `${reduce}`.length - `${reduce}`.replace(/0/g, '').length;
    resPrecision = digitalNum + leftNum;
    newNum /= reduce;
  }

  if (typeof precision === 'number') {
    resPrecision = precision;
  }
  newNum = (+newNum).toFixed(resPrecision);
  const newNums = `${newNum}`.split('.');
  let integer = (newNums[0]).toString();
  if (!notMoney) {
    integer = (newNums[0]).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
  let res = newNums.length > 1 ? `${integer}.${newNums[1]}` : integer;
  if (dropZero) {
    res = res.replace(/0*$/, '').replace(/\.$/, '');
  }
  if (fillZero) {
    const fillNums = res.split('.');
    if ((fillNums[1] || '').length === 0) {
      res = `${res}.${'00000000000'.slice(0, fillZero)}`;
    } else {
      res = `${res}${'00000000000'.slice(0, Math.max(0, fillZero - fillNums[1].length))}`;
    }
  }
  return res === 'NaN' ? '--' : res;
}

export function mapReceivedData(data, decorate) {
  let newData = { ...data };
  newData = decorate ? decorate(newData) : newData;
  const keys = Object.keys(newData);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (/^.*Start$/.test(key)) {
      const prefix = key.slice(0, key.length - 5);
      newData[prefix] = {};
      newData[prefix].value = [newData[key], data[`${prefix}End`]];
    }
    const param = newData[key];
    if (typeof param === 'object' && param !== null && 'value' in param) {
      newData[key] = param;
    } else {
      newData[key] = { value: param };
    }
  }
  return newData;
}

const isField = (val) => (typeof val === 'object' && val !== null) &&
  !(val instanceof Array) && 'value' in val && !(val._d);

const shapeType = (param, key) => {
  let { value } = param;
  const res = {};
  switch (param.type) {
    case 'month':
      res[key] = param.format('YYYY-MM');
      break;
    case 'datetimeRange':
    case 'numberRange':
      value = value || [];
      res[key] = param.value;
      res[`${key}Start`] = value[0] ? value[0].valueOf() : undefined;
      res[`${key}End`] = value[1] ? value[1].valueOf() : undefined;
      break;
    case 'dateRange':
      value = value || [];
      res[key] = param.value;
      res[`${key}Start`] = value[0].format('YYYY-MM-DD 00:00:00');
      res[`${key}End`] = value[1].format('YYYY-MM-DD 23:59:59');
      break;
    case 'monthRange':
      value = value || [];
      res[key] = param.value;
      res[`${key}Start`] = value[0].format('YYYY-MM');
      res[`${key}End`] = value[1].format('YYYY-MM');
      break;
    default:
      res[key] = param.value;
      (typeof res[key] === 'string') && res[key].trim();
  }
  return res;
};

export function mapToSendData(params, decorate) {
  let res = {};
  const keys = Object.keys(params);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const param = params[key];
    if (isField(param)) {
      const valueObj = shapeType(param, key);
      res = {
        ...res,
        ...valueObj,
      };
    } else {
      res[key] = param;
    }
  }
  return decorate ? decorate(res) : res;
}

export function parseFields(fields) {
  return fields.map((field) => {
    const newField = { ...field };
    const keys = Object.keys(newField);
    keys.forEach((key) => {
      const value = newField[key];
      let matched;
      let funcName;
      let props;
      if (Object.prototype.toString.call(value) === '[object Array]' && value[0] && typeof value[0] === 'object') {
        newField[key] = parseFields.call(this, value);
      }
      if (typeof value === 'string') {
        matched = value.match(/func:([^:]+)/);
      }
      if (matched) {
        [, funcName] = matched;
        if (/:run/.test(value)) {
          newField[key] = this[funcName]();
        } else {
          newField[key] = this[funcName];
        }
      }
      if (typeof value === 'string') {
        matched = value.match(/props:([^:]+)/);
      }
      if (matched) {
        [, props] = matched;
        let operate;
        if (props.indexOf('!!') === 0) {
          operate = '!!';
          props = props.slice(2);
        } else if (props.indexOf('!') === 0) {
          operate = '!';
          props = props.slice(1);
        }
        const propsArr = props.split('.');
        newField[key] = propsArr.reduce((res, prop) => {
          return res[prop];
        }, this.props);
        if (operate === '!') {
          newField[key] = !newField[key];
        } else if (operate === '!!') {
          newField[key] = !!newField[key];
        }
      }
    });
    return newField;
  });
}

export function mapToAntdFields(fields) {
  const antdFields = {};
  fields.forEach((field) => {
    const newField = { ...field };
    if (!('value' in newField)) {
      newField.value = undefined;
    }
    antdFields[newField.name] = newField;
  });
  return antdFields;
}

export const price2percent = (value) => Number((Number(value) * 100).toFixed(0));

export const percent2price = (value) => {
  if (typeof value !== 'number') return undefined;
  return (Number(value) / 100).toFixed(2);
};

export const validatePassword = (value, callback) => {
  if (/\s/.test(value)) {
    callback('密码不可包含空格');
  }
  if (!/[0-9]/.test(value) || !/[A-Za-z]/.test(value)) {
    callback('密码必须包含字母和数字');
  }
  if (value && (value.length < 8 || value.length > 20)) {
    callback('密码长度为8-20');
  }
  callback();
};

export const imagePath = () => ({
  1: '/img_check_gray.png',
  2: '/img-ok.png',
  3: '/img-no.png',
});
