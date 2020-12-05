function isValidListId (listId) {
  return listId !== null && listId !== undefined
}

console.log(isValidListId(null))
console.log(isValidListId(undefined))
console.log(isValidListId(0))
console.log(isValidListId(1))
