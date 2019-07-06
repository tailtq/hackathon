import bcrypt from 'bcryptjs';
import knex from '../../config/database';
import BaseController from './BaseController';
import jwt from 'jsonwebtoken';
import { EXPIRATION, JWT_SECRET } from '../../config/jsonwebtoken';

class UserController extends BaseController {
  type;

  repository;

  loginFields = ['id', 'email', 'name', 'avatar'];

  signUpFields = ['email', 'password', 'name', 'phone', 'address'];

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

  async signUp(req, res) {
    const data = this.filterFields(req.body, this.signUpFields);
    const user = await knex.transaction(trx => this.repository.signUp(data, trx));
    this.setSession(req, user);

    return res.redirect('/');
  }

  async signOut(req, res) {
    delete req.session.cUser;
    return res.redirect(`/${this.type}/sign-in`);
  }

  setSession(req, user) {
    req.session.cUser = this.filterFields(user, this.loginFields);
    req.session.cUser.encodedId = this.encode(user.id);
    req.session.cUser.type = this.type;

    const tokenData = {
      id: user.id,
      type: this.type,
    };

    req.session.cUser.token = jwt.sign({ user: tokenData }, JWT_SECRET, { expiresIn: EXPIRATION });
  }
}

export default UserController;
