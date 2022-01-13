// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getPortalRoot = () => typeof window !== "undefined" && (document.getElementById("portal-root") ?? document.body);

export default getPortalRoot;
