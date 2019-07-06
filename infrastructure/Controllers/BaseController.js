import ResponseHelper from '../Helpers/ResponseHelper';
import { decode, encode } from '../Helpers/Core/HashidsHelper';

class BaseController {
  filterFields(input, fields, addition) {
    let newInput = {};

    fields.forEach((field) => {
      if (typeof field === 'object') {
        if (field.noEmptyString && input[field.name]) {
          newInput[field.name] = input[field.name];
        }
      } else if (input[field] !== undefined) {
        newInput[field] = input[field];
      }
    });

    if (addition) {
      newInput = Object.assign(newInput, addition);
    }

    return newInput;
  }

  callMethod(method) {
    return async (req, res, next) => {
      try {
        return await this[method](req, res, next);
      } catch (e) {
        return next(e);
      }
    };
  }
}

Object.assign(BaseController.prototype, ResponseHelper);
Object.assign(BaseController.prototype, { encode, decode });

export default BaseController;
