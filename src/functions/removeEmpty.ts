export function removeEmpty(obj: Object): Object {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
