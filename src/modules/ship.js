const Ship = (length) => {
  if (typeof length !== 'number') throw new Error('You must pass a number as the length argument to Ship()')
  if (length < 2 || length > 6) throw new Error('Ship length must be between 2 to 6')

  return {
    length,
    hitCount: 0,
    hit() { this.hitCount += 1 },
    isSunk() { return this.hitCount >= this.length },
  }
}

export default Ship
