function isFalsyValue (str) {
  return !str || str.trim().length === 0
}

console.log(isFalsyValue(''))
console.log(isFalsyValue('  '))
console.log(isFalsyValue(null))
console.log(isFalsyValue(0))
console.log(isFalsyValue(false))
console.log(isFalsyValue(undefined))
console.log(isFalsyValue('  2 3'))
