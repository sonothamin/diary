export default {
  title: "Diary",
  author: "Sonoth Amin",
  description: "Notes on building, learning and everything else.",
  origin: "https://sonothamin.dev",
  year: new Date().getFullYear(),
  homeLimit: 5, // rows per category column on the home page before "Show more"
  // Links back to the main site (plain root paths, so no /Diary/ prefix).
  nav: [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio/" },
    { label: "Blog", href: "/Diary/", self: true },
    { label: "Contact", href: "/contact/" },
    { label: "About", href: "/about/" },
  ],
};
