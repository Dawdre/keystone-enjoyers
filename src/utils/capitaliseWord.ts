export function capitaliseWords(string: string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase())
}
