/* eslint-env es6 */
import resolvePathname from 'resolve-pathname';

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
const splitPath = filename => splitPathRe.exec(filename).slice(1);

export const getDirname = path => {
  const result = splitPath(path);
  const root = result[0];
  let dir = result[1];
  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
}
export const getExtension = path => splitPath(path)[3]
export const isAbsolute = pathname => !!(pathname && pathname.charAt(0) === '/');
const hasTrailingSlash = pathname => (!!pathname && pathname.charAt(pathname.length - 1) === '/');
const withTrailingSlash = function(pathname) {
  return (hasTrailingSlash(pathname) ? pathname : `${pathname}/`)
}
const stripTrailingSlash = pathname => (
  pathname.length > 1 && hasTrailingSlash(pathname) ? pathname.slice(0, -1) : pathname
);
const sameSlash = (pathname, noSlash) => (noSlash ? stripTrailingSlash(pathname) : pathname);

export const join = (to, from) => {
  if (isAbsolute(to)) {
    return to;
  }
  const toSlash = hasTrailingSlash(to);
  const fromSlash = hasTrailingSlash(from);
  const pathname = resolvePathname(to, withTrailingSlash(from));
  return sameSlash(pathname, !toSlash && !fromSlash);
}