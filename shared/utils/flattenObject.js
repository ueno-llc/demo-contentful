export default function flattenObject(object) {
  const isValidObject = (value) => {
    if (!value) {
      return false;
    }

    const isArray = Array.isArray(value);
    const isObject = Object.prototype.toString.call(value) === '[object Object]';
    const hasKeys = !!Object.keys(value).length;

    return !isArray && isObject && hasKeys;
  };

  const walker = (child, path = []) =>
    Object.assign(
      {},
      ...Object.keys(child).map(
        key =>
          isValidObject(child[key])
            ? walker(child[key], path.concat([key]))
            : { [key]: child[key] },
      ),
    );

  return Object.assign({}, walker(object));
}
