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

/**
 * Check if user has any of multiple ACL keys
 */
export function hasAnyAcl(roleAndAcl: Record<string, string[]>, aclKeys: string[]): boolean {
  return aclKeys.some((key) => hasAcl(roleAndAcl, key));
}
