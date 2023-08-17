import * as R from "ramda";

export function filterPropsBy(prefix: string) {
  return (obj: Object) =>
    R.pipe(
      R.pickBy((_, key) => key.startsWith(prefix)),
      removePrefixInKey(prefix),
    )(obj);
}

export function removePrefixInKey(prefix: string) {
  return (obj: Object) => {
    Object.keys(obj).forEach(oldKey => {
      const newKey = oldKey.replace(prefix, "");
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    });
    return obj;
  };
}
