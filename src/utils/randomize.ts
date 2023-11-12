export function randomize<T>(arr: T[]): T | null {
  if (arr.length === 0) {
    return null
  } else {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
  }
}
