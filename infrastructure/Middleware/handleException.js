import ResponseTrait from '../Traits/ResponseTrait';

export default (err, req, res, next) => {
  const message = { title: err.message, stackTrace: err.stack };
  let code = err.code || 500;
  code = (code > 502) ? 500 : code;

  return res.status(code).json(ResponseTrait.error(message, code));
};
