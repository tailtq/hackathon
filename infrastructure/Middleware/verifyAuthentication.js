export function verifyAuthentication(req, res, next) {
  if (req.session.cUser) {
    return res.redirect('/');
  }

  return next();
}

export function verifyNotAuthentication(req, res, next) {
  if (!req.session.cUser) {
    req.session.prevUrl = req.originalUrl;

    if (req.originalUrl.split('/').splice(1)[0] === 'admin') {
      return res.redirect('/admin/sign-in');
    }

    return res.redirect('/students/sign-in');
  }

  return next();
}
