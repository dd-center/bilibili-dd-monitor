function isEmpty (str) {
  return !str||str.trim().length===0
}

console.log(isEmpty(''))
console.log(isEmpty('  '))
console.log(isEmpty(null))
console.log(isEmpty(0))
console.log(isEmpty(false))
console.log(isEmpty(undefined))
console.log(isEmpty("  2 3"))

