import methodOverride from 'method-override';

import router from '../routes/web';
import { PER_PAGE } from '../infrastructure/Constants/CommonConstants';
import PermissionHelper from '../infrastructure/Helpers/PermissionHelper';


export default function (app) {
  app.use(methodOverride('X-HTTP-Method-Override'));

  app.use(
    methodOverride((req) => {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        const method = req.body._method;
        delete req.body._method;

        return method;
      }

      return undefined;
    }),
  );

  app.use(function (req, res, next) {
    if (req.is('text/*')) {
      req.text = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) { req.text += chunk });
      req.on('end', next);
    } else {
      next();
    }
  });

  app.use(async (req, res, next) => {
    res.redirectBack = () => {
      const backURL = req.header('Referer') || '/';
      return res.redirect(backURL);
    };

    res.locals.flashMessages = req.session.flash;

    res.locals.cUser = req.session.cUser;

    res.locals.ONE_SIGNAL_ID = process.env.ONE_SIGNAL_APP_ID;

    res.locals.checkUserHasRole = PermissionHelper.checkUserHasRole;

    res.locals.path = req.path;

    res.locals.query = req.query;

    res.locals.pathElements = req.path.split('/').splice(1);

    res.locals.comparePath = (path, className) => ((path === res.locals.path) ? className : '');

    res.locals.getPageIndex = (page, perPage = PER_PAGE) => {
      page = parseInt(page, 10);
      return (!page || page <= 1) ? 0 : (page - 1) * perPage;
    };
    delete req.session.flash;

    next();
  });

  app.use(router);

  // Page 404
  // app.use((req, res) => res.render('app/client/error/404'));
}
