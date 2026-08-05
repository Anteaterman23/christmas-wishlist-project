import { urlRegex } from "./consts";

export function sanitize(itemName, itemHyperlink) {
  const url = extractURL(itemHyperlink);
  const name = String(itemName).trim();
  
  if (!url) {
    return <span>{name}</span>;
  }
  return <a
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >{name}</a>
}

function extractURL(str) {
  if (!str) return undefined;
  const match = str.match(urlRegex);
  return match ? match[0] : undefined;
}
