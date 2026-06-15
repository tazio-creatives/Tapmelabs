/**
 * SVG color extraction and replacement utilities.
 * Handles fill, stroke, stop-color, and inline style attributes.
 */

function normalizeColor(color) {
  if (!color) return null;
  color = color.trim();
  if (color === "none" || color === "transparent" || color === "inherit" || color === "currentColor") return null;

  if (color.startsWith("#")) {
    if (color.length === 4) {
      const r = color[1], g = color[2], b = color[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    if (color.length === 7) return color.toLowerCase();
    return null;
  }

  const rgbMatch = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, "0");
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, "0");
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  return null;
}

function extractSvgColors(svgString) {
  const colors = new Set();

  // Match fill="..." stroke="..." stop-color="..."
  const attrRe = /(?:fill|stroke|stop-color)="([^"]+)"/gi;
  let m;
  while ((m = attrRe.exec(svgString)) !== null) {
    const c = normalizeColor(m[1]);
    if (c) colors.add(c);
  }

  // Match inline style: fill:#xxx; stroke:#xxx; stop-color:#xxx;
  const styleRe = /(?:fill|stroke|stop-color)\s*:\s*([^;}"'\s]+)/gi;
  while ((m = styleRe.exec(svgString)) !== null) {
    const c = normalizeColor(m[1]);
    if (c) colors.add(c);
  }

  return Array.from(colors);
}

function replaceSvgColors(svgString, colorMap) {
  if (!colorMap || colorMap.length === 0) return svgString;

  const map = {};
  for (const { original, selected } of colorMap) {
    if (original && selected) {
      map[original.toLowerCase()] = selected;
    }
  }

  // Replace attribute values: fill="..." stroke="..." stop-color="..."
  let result = svgString.replace(
    /(?:fill|stroke|stop-color)="([^"]+)"/gi,
    (match, val) => {
      const normalized = normalizeColor(val);
      if (normalized && map[normalized]) {
        return match.replace(val, map[normalized]);
      }
      return match;
    }
  );

  // Replace inline style values
  result = result.replace(
    /((?:fill|stroke|stop-color)\s*:\s*)([^;}"'\s]+)/gi,
    (match, prefix, val) => {
      const normalized = normalizeColor(val);
      if (normalized && map[normalized]) {
        return `${prefix}${map[normalized]}`;
      }
      return match;
    }
  );

  return result;
}

export { extractSvgColors, replaceSvgColors, normalizeColor };
