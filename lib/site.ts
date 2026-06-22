export const siteConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || ""
};

export function withBasePath(path: string) {
  if (!path) {
    return siteConfig.basePath || "/";
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return siteConfig.basePath ? `${siteConfig.basePath}${normalizedPath}` : normalizedPath;
}
