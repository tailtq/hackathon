import Hashids from 'hashids';

import BadRequestException from '../Exceptions/BadRequestException';
import { charsQuantity, hashidsChars, keys } from '../../config/hashids';

const hashids = new Hashids('Kibara', charsQuantity, hashidsChars);

export const encode = id => hashids.encodeHex(id);

export const encodeIds = ids => ids.map(id => encode(id));

export const decode = id => hashids.decodeHex(id);

export const loopHashids = (data) => {
  if (data && typeof data !== 'string' && data.length) {
    Object.keys(data).forEach((key) => {
      data[key] = loopHashids(data[key]);
    });
  } else {
    Object.keys(data).forEach((key) => {
      if (data[key] && typeof data[key] === 'object' && typeof data[key][0] !== 'number') { // && data[key].length
        data[key] = loopHashids(data[key]);
      } else if (keys.indexOf(key) >= 0) {
        if (data[key]) {
          if (typeof data[key] === 'object') {
            // array of ids
            data[key].forEach((value, index) => {
              data[key][index] = hashids.encodeHex(value);
            });
          } else if (typeof data[key] === 'number') {
            data[key] = hashids.encodeHex(data[key]);
          }
        }
      }
    });
  }

  return data;
};

export const loopParseHashids = (data) => {
  const verifyHashId = (id) => {
    if (typeof id === 'object') {
      throw new BadRequestException('INVALID_ID');
    }
  };

  if (data && typeof data === 'object' && !(data instanceof Array)) {
    Object.keys(data).forEach((key) => {
      if (keys.indexOf(key) >= 0) {
        if (data[key] instanceof Array) {
          data[key].forEach((element, index) => {
            data[key][index] = hashids.decodeHex(element);
            verifyHashId(data[key][index]);
          });
        } else {
          data[key] = hashids.decodeHex(data[key]);
          verifyHashId(data[key]);
        }
      }
    });
  }

  return data;
};
