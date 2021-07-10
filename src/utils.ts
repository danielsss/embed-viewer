/**
 * Resolving path string to object.
 * @param pathStr - "/test/files/*.xmind"
 */
export const resolvePathString = function(pathStr: string) {
  const ret = { dir: [], name: null };

  if (!pathStr || typeof pathStr !== 'string') {
    return ret;
  }

  if (pathStr.includes('/')) {
    const arr = pathStr.split('/').filter(v => v);
    ret.name = arr[arr.length - 1];
    ret.dir = ret.dir.concat(arr.slice(0, arr.length - 1));
    return ret;
  }

  ret.name = pathStr;
  return ret;
}