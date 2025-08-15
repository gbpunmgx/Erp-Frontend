import Cookies from "js-cookie";

/**
 * Reads layout preferences from cookies (with defaults) and
 * returns the Tailwind max-width class based on sidebar & content layout.
 *
 * @param sidebarState e.g. "expanded" or "collapsed"
 */
export function getContentMaxWidth(sidebarState: string): string {
  const sidebarVariant = Cookies.get("sidebar_variant") ?? "sidebar";
  const sidebarCollapsible = Cookies.get("sidebar_collapsible") ?? "icon";
  const contentLayout = Cookies.get("content_layout") ?? "full-width";

  const isSidebarOpen = sidebarState === "expanded";

  if (contentLayout === "full-width" && sidebarCollapsible === "icon") {
    return isSidebarOpen ? "max-w-[calc(100vw-315px)]" : "max-w-[calc(100vw-120px)]";
  }

  if (contentLayout === "full-width" && sidebarCollapsible === "offcanvas") {
    return isSidebarOpen ? "max-w-[calc(100vw-315px)]" : "max-w-full";
  }

  if (contentLayout === "centered" && sidebarCollapsible === "offcanvas") {
    return isSidebarOpen ? "max-w-[calc(100vw-315px)]" : "max-w-full";
  }

  if (contentLayout === "centered" && sidebarCollapsible === "icon") {
    return isSidebarOpen ? "max-w-[calc(100vw-315px)]" : "max-w-[calc(100vw-120px)]";
  }

  return "max-w-full";
}
