/**
 * Checks if the user has a specific ACL key.
 * @param roleAndAcl - roleAndAcl from LoginResponse
 * @param aclKey - ACL key constant
 * @returns true if user has permission
 */
export function hasAcl(roleAndAcl: Record<string, string[]>, aclKey: string): boolean {
  for (const permissions of Object.values(roleAndAcl)) {
    if (permissions.includes(aclKey)) {
      return true;
    }
  }
  return false;
}
