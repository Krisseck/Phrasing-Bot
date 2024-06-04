import * as Diff from 'diff'

export interface DiffItem {
  added?: boolean
  removed?: boolean
  count: number
  value: string
}

export default function getDiffArray(string1: string, string2: string): DiffItem[] {
  let diffArray = Diff.diffWords(string1, string2, {
    ignoreCase: false
  }) as DiffItem[]

  /*
     Try to look for patterns where there is:
        1. removed word
        2. added word
        3. a space
        4. removed word
        5. added word
      In that pattern, we can compress the items to just one removed and one added
      */

  let foundCompressibleItems = true

  while (foundCompressibleItems) {
    foundCompressibleItems = false

    for (const [index] of diffArray.entries()) {
      if (
        index + 5 <= diffArray.length &&
        diffArray[index].removed &&
        diffArray[index + 1].added &&
        diffArray[index + 2].value === ' ' &&
        diffArray[index + 3].removed &&
        diffArray[index + 4].added
      ) {
        // Merge the added & removed items
        diffArray[index].value += ' ' + diffArray[index + 3].value
        diffArray[index + 1].value += ' ' + diffArray[index + 4].value
        // Remove extra items
        diffArray.splice(index + 2, 3)
        foundCompressibleItems = true
        break
      }
    }
  }

  return diffArray
}
