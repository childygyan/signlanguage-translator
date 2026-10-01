/**
 * Redirect the Pages-assigned hostname to the main custom domain.
 * Only matches the exact production pages.dev hostname — preview
 * deployments (*.pages.dev hashes) and the custom domain itself pass through.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "signlanguage-translator.pages.dev") {
    url.hostname = "signlanguage-translator.com";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
