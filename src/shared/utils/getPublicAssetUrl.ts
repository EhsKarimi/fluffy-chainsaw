const normalizeBaseUrl = (baseUrl: string) => (baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);

export const getPublicAssetUrl = (assetPath: string) => {
  const normalizedPath = assetPath.replace(/^\/+/, "");

  return `${normalizeBaseUrl(import.meta.env.BASE_URL)}${normalizedPath}`;
};
