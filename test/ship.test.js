import Ship from '../src/modules/ship'

describe('Ship Object Instantiation', () => {
  it('Only accepts args of number type', () => {
    const msg = 'You must pass a number as the length argument to Ship()'
    expect(() => Ship('3')).toThrow(msg)
    expect(() => Ship('something')).toThrow(msg)
  })

  it('Only accepts ship length between 2 to 6', () => {
    const msg = 'Ship length must be between 2 to 6'
    expect(() => Ship(1)).toThrow(msg)
    expect(() => Ship(7)).toThrow(msg)
  })

  it('Returns a ship object with its properties', () => {
    const expected = {
      length: 3,
      hitCount: 0,
    }
    expect(Ship(3)).toMatchObject(expected)
  })
})

describe('hit() method', () => {
  it('Increments the hitCount by 1 for each call', () => {
    const ship = Ship(3)
    ship.hit()
    expect(ship.hitCount).toBe(1)
    ship.hit()
    expect(ship.hitCount).toBe(2)
  })
})

describe('isSunk() method', () => {
  const ship = Ship(3) // Ship length is 3

  it('Returns a boolean that indicates if ship is sunk', () => {
    ship.hit() // hitCount = 1
    expect(ship.isSunk()).toBe(false)
    ship.hit() // hitCount = 2
    expect(ship.isSunk()).toBe(false)
    ship.hit() // hitCount = 3
    expect(ship.isSunk()).toBe(true)
  })
})
