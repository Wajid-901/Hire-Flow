import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to the top on every route change.
 *
 * BUG-18: Guards against hash-link navigation (e.g. #features, #faq on
 * HomePage). When a hash is present we let the browser handle its own
 * scroll-to-anchor behaviour instead of overriding it with a scroll-to-top.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Only scroll to top when navigating to a new page without an anchor hash
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
