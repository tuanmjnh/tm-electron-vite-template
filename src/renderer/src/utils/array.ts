/**
* Convert the given array to a tree structure.
* @param arr - the original array, where each element contains the id and pid attributes, and pid represents the parent id.
* @returns Returns the converted tree structure array.
*/
export function arrayToTree(arr: any[]) {
  // Initialize the result array
  const res: any = []
  // Use Map to store array elements, with id as the key and the element itself as the value
  const map = new Map()

  // Traverse the array and store each element in the Map with id as the key
  arr.forEach((item) => {
    map.set(item.id, item)
  })

  // Traverse the array again and organize the elements into a tree structure according to pid
  arr.forEach((item) => {
    // Get the parent element of the current element
    const parent = item.pid && map.get(item.pid)
    // If there is a parent element
    if (parent) {
      // If the parent element already has child elements, append the current element to the child element array
      if (parent?.children)
        parent.children.push(item)
      // If the parent element has no child elements, create a child element array and use the current element as the first element
      else
        parent.children = [item]
    }
    // If there is no parent element, add the current element directly to the result array
    else {
      res.push(item)
    }
  })
  // Return the organized tree structure array
  return res
}
