import sanitizeHtml from "sanitize-html"

const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "s", "code", "pre", "blockquote",
    "ul", "ol", "li", "a", "img", "span", "div",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    "*": ["style"],
  },
  allowedStyles: {
    "*": { "text-align": [/^(left|right|center|justify)$/] },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, rel: "noopener noreferrer nofollow", target: "_blank" },
    }),
  },
}

export function cleanLessonHtml(html: unknown): string {
  return typeof html === "string" ? sanitizeHtml(html, options) : ""
}
