import redis from 'redis';
import { promisify } from 'util';

import { encode as encodeHashids } from './HashidsHelper';
import UserRepository from '../../api/v1/User/Repositories/UserRepository';

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

class PermissionHelper {
  static hasCommonRoles(user) {
    return this.checkUserHasRole(user, ['blogger', 'owner']);
  }

  static hasManagementRole(user) {
    return this.checkUserHasRole(user, 'owner');
  }

  static checkPermission(element, user) {
    if (this.hasManagementRole(user) || user.id === element.user_id) {
      return true;
    }

    return false;
  }

  static checkElementPermission(element, user) {
    if (this.checkUserHasRole(user, 'owner') || user.id === element.user_id) {
      return true;
    }

    return false;
  }

  static checkUserHasRole(user, roles) {
    if (typeof roles === 'string') {
      roles = [roles];
    }

    return user.roles.find(role => roles.includes(role.name));
  }

  static cacheRoles(hashid, roles) {
    return setAsync(hashid, JSON.stringify(roles));
  }

  static async getRoles(userId) {
    const hashid = encodeHashids(userId);
    let roles = await getAsync(hashid);

    if (roles) {
      roles = JSON.parse(roles);
    } else {
      roles = await this.getRolesFromDatabase(userId, hashid);
      this.cacheRoles(hashid, roles);
    }

    return roles;
  }

  static getRolesFromDatabase(userId) {
    const userRepository = UserRepository.getRepository();

    return userRepository.getUserRoles(userId);
  }
}

export default PermissionHelper;
