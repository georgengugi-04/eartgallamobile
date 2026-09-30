// React Native's FormData accepts { uri, name, type } for files, but the DOM
// typings don't know that. This is the one place we bridge the gap.
export function imageFile(uri: string, name: string): Blob {
  return { uri, name, type: "image/jpeg" } as unknown as Blob;
}
