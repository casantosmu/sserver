export const generateETag = (stat) => {
  const mtime = stat.mtime.getTime().toString(16);
  const size = stat.size.toString(16);
  return '"' + size + "-" + mtime + '"';
};
