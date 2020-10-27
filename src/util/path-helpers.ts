import resolvePathname from './resolvePath';

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
const splitPath = (filename: string) => splitPathRe.exec(filename).slice(1);

export const getDirname = (path: string) => {
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
};

export const getExtension = (path: string) => splitPath(path)[3];

export const isAbsolute = (pathname: string) =>
  !!(pathname && pathname.charAt(0) === '/');

const hasTrailingSlash = (pathname: string) =>
  !!pathname && pathname.charAt(pathname.length - 1) === '/';

const withTrailingSlash = function (pathname: string) {
  return hasTrailingSlash(pathname) ? pathname : `${pathname}/`;
};

const stripTrailingSlash = (pathname: string) =>
  pathname.length > 1 && hasTrailingSlash(pathname)
    ? pathname.slice(0, -1)
    : pathname;

const sameSlash = (pathname: string, noSlash: boolean) =>
  noSlash ? stripTrailingSlash(pathname) : pathname;

export const join = (to: string, from: string) => {
  if (isAbsolute(to)) {
    return to;
  }
  const toSlash = hasTrailingSlash(to);
  const fromSlash = hasTrailingSlash(from);
  const pathname = resolvePathname(to, withTrailingSlash(from));
  return sameSlash(pathname, !toSlash && !fromSlash);
};
