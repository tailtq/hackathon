import bcrypt from 'bcryptjs';
import BaseController from './BaseController';

class UserController extends BaseController {
  loginFields = ['id', 'email', 'name', 'avatar'];

  type;

  repository;

  constructor() {
    super();
  }

  showSignInForm(req, res) {
    return res.render(`app/client/${this.type}/sign-in`);
  }

  async signIn(req, res) {
    const { email, password } = req.body;
    const user = await this.repository.getBy({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      req.flash('oldValue', { email: req.body.email });
      req.flash('errors', {
        password: { msg: 'Email or password is not correct' },
      });

      return res.redirect(`/${this.type}/sign-in`);
    }

    this.setSession(req, user);

    return res.redirect('/');
  }

  showSignUpForm(req, res) {
    return res.render(`app/client/${this.type}/sign-up`);
  }

  signUp(req, res) {

  }

  setSession(req, user) {
    req.session.cUser = this.filterFields(user, this.loginFields);
    req.session.cUser.encodedId = this.encode(user.id);
  }
}

export default UserController;
