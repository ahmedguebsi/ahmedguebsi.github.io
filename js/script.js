// Navbar elevation + back-to-top behavior
(function () {
  const navbar = document.getElementById("navbar-top");
  const backToTopBtn = document.getElementById("btn-back-to-top");

  function onScroll() {
    const scrolled = window.scrollY > 24;
    if (navbar) navbar.classList.toggle("is-scrolled", scrolled);
    if (backToTopBtn) {
      backToTopBtn.style.display = window.scrollY > 200 ? "inline-flex" : "none";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("DOMContentLoaded", onScroll);

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Close mobile nav after tapping a link
  document.querySelectorAll("#navbarNav .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      const nav = document.getElementById("navbarNav");
      if (nav && nav.classList.contains("show") && window.bootstrap) {
        const instance = window.bootstrap.Collapse.getInstance(nav);
        if (instance) instance.hide();
      }
    });
  });
})();
