import { urlRegex } from "./consts";

export function sanitize({ itemName, itemHyperlink }) {
  const url = extractURL(itemHyperlink);
  
  if (!url) {
    return <span>{itemName}</span>;
  }
  return <a href={url}>{itemName}</a>;
}

const extractURL = (str) => {
    if (!str) return undefined;
    const match = str.match(urlRegex)
    return match ? match[0] : undefined;
};
