class PermissionHelper {
  static rolesPoint = {
    admin: 3,
    manager: 2,
    staff: 1,
  };

  static checkClientPermission(element, userId) {
    if (userId === element.userId) {
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

  static compareRoles(roles1, roles2) {
    const { getHighestPoint } = PermissionHelper;
    const rolesName1 = roles1.map(role => role.name);
    const rolesName2 = roles2.map(role => role.name);

    if (getHighestPoint(rolesName1) > getHighestPoint(rolesName2)) {
      return 1;
    } else if (getHighestPoint(rolesName1) < getHighestPoint(rolesName2)) {
      return -1;
    }

    return 0;
  }

  static getHighestPoint(rolesName) {
    let highestPoint = 0;

    Object.keys(PermissionHelper.rolesPoint).forEach((role) => {
      if (rolesName.indexOf(role) >= 0 && highestPoint === 0) {
        highestPoint = PermissionHelper.rolesPoint[role];
      }
    });

    return highestPoint;
  }

  static getRolesForUpdating(roles) {
    let rolesName = roles.map(role => role.name);
    const highestPoint = PermissionHelper.getHighestPoint(rolesName);
    rolesName = Object.keys(this.rolesPoint);

    return rolesName.filter(role => this.rolesPoint[role] <= highestPoint);
  }
}

export default PermissionHelper;
