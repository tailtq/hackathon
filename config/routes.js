import methodOverride from 'method-override';

import router from '../routes/api';

export default function (app) {
  app.use(methodOverride('X-HTTP-Method-Override'));

  app.use(methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;

      return method;
    }

    return undefined;
  }));

  app.use(router);
};
