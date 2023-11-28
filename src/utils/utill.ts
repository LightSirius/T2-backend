export function isEmpty(obj) {
  if (obj == null) return true;
  if (obj.length === 0) return true;
  if (Object.keys(obj).length === 0) return true;

  return false;
}
