
import myTextFile from './boards/pentominoes4x15'

class Piece {
    constructor(char) {
        this.data = [[0, 0, char]]
        this.size = 1
        this.symmetry = 4
        this.available = []
        this.reflect = 1
    }

    buildPiece(y, x, dy, dx, layout) {
        layout[y][x] = " "
        if (layout[y - 1][x] != " ") {
            this.data.push([dy - 1, dx, layout[y - 1][x]])
            this.size++
            this.buildPiece(y - 1, x, dy - 1, dx, layout)
        }
        if (layout[y + 1][x] != " ") {
            this.data.push([dy + 1, dx, layout[y + 1][x]])
            this.size++
            this.buildPiece(y + 1, x, dy + 1, dx, layout)
        }
        if (layout[y][x - 1] != " ") {
            this.data.push([dy, dx - 1, layout[y][x - 1]])
            this.size++
            this.buildPiece(y, x - 1, dy, dx - 1, layout)
        }
        if (layout[y][x + 1] != " ") {
            this.data.push([dy, dx + 1, layout[y][x + 1]])
            this.size++
            this.buildPiece(y, x + 1, dy, dx + 1, layout)
        }
    }
}

//#test rotational symmetry of a piece
const testSym = (a) => {
    let sym = 4
    a.data.forEach(sq => {
        if (tryPiece(a, sq[0], sq[1], 1, 0, a)) { // a = i * a
            sym = Math.min(sym, 1)
        }
        if (tryPiece(a, sq[0], sq[1], 2, 0, a)) { // a = -a
            sym = Math.min(sym, 2)
        }
    })
    return sym
}

//#test reflective symmetry of a piece
const testRef = (a) => {
    let ref = 2
    for (const sq of a.data) {
        if (tryPiece(a, sq[0], sq[1], 0, 1, a)) {
            return 1
        }
        if (tryPiece(a, sq[0], sq[1], 1, 1, a)) {
            return 1
        }
        if (tryPiece(a, sq[0], sq[1], 2, 1, a)) {
            return 1
        }
        if (tryPiece(a, sq[0], sq[1], 3, 1, a)) {
            return 1
        }
    }
    return ref
}

const splits = (aboard) => {
    const seen = new Set([])
    const islands = []
    aboard.data.forEach(i => {
        const iJson = JSON.stringify(i)
        if (!seen.has(iJson)) {
            const a = new Piece(i[2])
            a.data = [i]
            const yoff = i[0]
            const xoff = i[1]
            seen.add(iJson)
            buildIsland(aboard, a, yoff, xoff, 0, 0, seen)
            islands.push(a)
        }
    });
    return islands
}


//called by splits(). return all the blocks connected to a given piece
const buildIsland = (aboard, a, y, x, dy, dx, seen) => {
    aboard.data.forEach(i => {
        const iJson = JSON.stringify(i)
        if (!seen.has(iJson)) {
            if (i[0] == y + dy && i[1] == x + dx + 1) {
                a.data.push(i)
                a.size += 1
                seen.add(iJson)
                buildIsland(aboard, a, y, x, dy, dx + 1, seen)
            }

            if (i[0] == y + dy && i[1] == x + dx - 1) {
                a.data.push(i)
                a.size += 1
                seen.add(iJson)
                buildIsland(aboard, a, y, x, dy, dx - 1, seen)
            }
            if (i[0] == y + dy + 1 && i[1] == x + dx) {
                a.data.push(i)
                a.size += 1
                seen.add(iJson)
                buildIsland(aboard, a, y, x, dy + 1, dx, seen)
            }
            if (i[0] == y + dy - 1 && i[1] == x + dx) {
                a.data.push(i)
                a.size += 1
                seen.add(iJson)
                buildIsland(aboard, a, y, x, dy - 1, dx, seen)
            }
        }
    });
}

// make sure there are enough pieces to fill up the entire board
const sizeCheck = (bag, boardSize) => {
    let totalSize = 0
    bag.forEach(piece => {
        totalSize += piece.size
    })
    if (totalSize >= boardSize) {
        console.log("Valid puzzle so far")
        alert("Valid puzzle so far")
    } else {
        console.log("Stop right there. Not enough pieces to cover board")
        alert("Stop right there. Not enough pieces to cover board")
    }
}

const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false
    }
    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }
    return true
}

const arrayContains = (arr, elementArr) => {
    const ret = arr.some(e => {
        return arraysEqual(e, elementArr)
    })
    return ret
}

// attempt to place piece a in aboard with location dy,dx with orientation and reflection
// returns boolean value
const tryPiece = (piece, dy, dx, orientation, reflection, aboard) => {
    // console.log('piece')
    // console.log(piece)
    // console.log('dy dx')
    // console.log(dy, dx)
    // console.log('aboard')
    // console.log(aboard)
    // console.log('reflection')
    // console.log(reflection)
    for (const block of piece.data) {
        const [i, j, char] = block
        const mult = 1 - 2 * reflection
        if (orientation == 0) { // as is
            // if (!aboard.data.incldes([i + dy, mult * j + dx, char])) {
            if (!arrayContains(aboard.data, [i + dy, mult * j + dx, char])) {
                // console.log([i + dy, mult * j + dx, char])
                // console.log('FalseFalse')
                return false
            }
        } else if (orientation == 1) { //90 degrees counterclockwise
            // if (!aboard.data.includes([-mult * j + dy, i + dx, char])) {
            if (!arrayContains(aboard.data, [-mult * j + dy, i + dx, char])) {
                return false
            }
        } else if (orientation == 2) { //180 degree rotation
            // if (!aboard.data.includes([-i + dy, -mult * j + dx, char])) {
            if (!arrayContains(aboard.data, [-i + dy, -mult * j + dx, char])) {
                return false
            }
        } else if (orientation == 3) { // 270 degree counterclockwise
            // if (!aboard.data.includes([mult * j + dy, -i + dx, char])) {
            if (!arrayContains(aboard.data, [mult * j + dy, -i + dx, char])) {
                return false
            }
        }
    }
    // console.log('truetrue')
    return true
}

// one step in solving the puzzle. take the first available square and try all the pieces in it

const boardFirstSolve = (bfirst, solutions, sameSize) => {
    if (bfirst.length == 0) {
        alert("Hmmm...")
        console.log("Hmmm...")
        return
    }
    const curState = bfirst.shift()
    // console.log(curState)
    const [abag, aused, aboards] = curState
    if (aboards.length == 0) {
        // alert("solved")
        console.log("solved")
        solutions.push(aused)
        console.log(solutions)
        return
    }
    aboards.sort((a, b) => a.size - b.size) //start with smallest remaining board
    const aboard = aboards[0]

    if (sameSize) {
        //we can eliminate possibilities all pieces are same size, and that size does not divide the size of an island
        if (aboard.size % sameSize != 0) {
            return
        }
    }
    const sq = aboard.data[0]
    // console.log('jamesku1996')
    // console.log(pieceFit(aboard, abag, sq[0], sq[1]))
    const pf = pieceFit(aboard, abag, sq[0], sq[1])
    for (const config of pf) {
        const [piece, center, ori, ref] = config
        const tempBoards = aboards.slice()
        tempBoards[0] = changeBoard2(piece, sq[0], sq[1], center, ori, ref, aboard)
        // console.log('tempboard')
        // console.log(tempBoards[0])
        // console.log('piece')
        // console.log(piece)
        if (tempBoards[0].size == 0) {
            tempBoards.shift()
        } else {
            splits(tempBoards.shift()).forEach(i => {
                tempBoards.push(i)
            })
        }
        const tempUsed = aused.slice()
        let newy, newx
        if (ori == 0) {
            newy = sq[0] - center[0]
            newx = sq[1] - center[1]
        }
        if (ori == 1) {
            newy = sq[0] + center[1]
            newx = sq[1] - center[0]
        }
        if (ori == 2) {
            newy = sq[0] + center[0]
            newx = sq[1] + center[1]
        }
        if (ori == 3) {
            newy = sq[0] - center[1]
            newx = sq[1] + center[0]
        }
        tempUsed.push([piece, newy, newx, ori, ref])
        const tempBag = abag.slice()
        const idx = tempBag.indexOf(piece)
        tempBag.splice(idx, 1)
        bfirst.unshift([tempBag, tempUsed, tempBoards])
    }
}

//return all of the pieces that can fit a given square
const pieceFit = (aboard, abag, y, x) => {
    const configs = []
    abag.forEach(a => {
        a.data.forEach(block => {
            for (let ori = 0; ori < a.symmetry; ++ori) {
                for (let ref = 0; ref < a.reflect; ++ref) {
                    if (tryPiece2(a, y, x, block, ori, ref, aboard)) {
                        // console.log(configs.length)
                        // console.log(a, block, ori, ref)
                        configs.push([a, block, ori, ref])
                    }
                }
            }
        });
    })
    return configs
}

//more general version of trypiece that adjusts for a board that doesnt contain 0,0
// y, x->coords on board
const tryPiece2 = (a, y, x, center, ori, ref, aboard) => {
    if (ori === 0) {
        const ret = tryPiece(a, y - center[0], x - center[1], ori, ref, aboard)
        // console.log(`ret: ${ret}`)
        return ret
    } else if (ori === 1) {
        return tryPiece(a, y + center[1], x - center[0], ori, ref, aboard)
    } else if (ori === 2) {
        return tryPiece(a, y + center[0], x + center[1], ori, ref, aboard)
    } else if (ori === 3) {
        return tryPiece(a, y - center[1], x + center[0], ori, ref, aboard)
    }
}

const indexOfArray = (arr, elementArr) => {
    for (let i = 0; i < arr.length; ++i) {
        if (arraysEqual(arr[i], elementArr)) {
            return i
        }
    }
    return undefined
}

// remove a piece a from the board
const changeBoard2 = (a, dy, dx, center, orientation, reflection, bboard) => {
    //only call this if its been tested with trypiece first!!!
    const cboard = JSON.parse(JSON.stringify(bboard))
    a.data.forEach(i => {
        const mult = 1 - 2 * reflection
        cboard.size--
        if (orientation == 0) {//as is
            const idx = indexOfArray(cboard.data, [i[0] - center[0] + dy, mult * i[1] - center[1] + dx, i[2]])
            cboard.data.splice(idx, 1)
        } else if (orientation == 1) { // 90 degrees counterclockwise
            const idx = indexOfArray(cboard.data, [-mult * i[1] + center[1] + dy, i[0] - center[0] + dx, i[2]])
            cboard.data.splice(idx, 1)
        } else if (orientation == 2) {
            const idx = indexOfArray(cboard.data, [-i[0] + center[0] + dy, -mult * i[1] + center[1] + dx, i[2]])
            cboard.data.splice(idx, 1)
        } else if (orientation == 3) {
            const idx = indexOfArray(cboard.data, [mult * i[1] - center[1] + dy, -i[0] + center[0] + dx, i[2]])
            cboard.data.splice(idx, 1)
        }
    })
    return cboard
}

// Return the length of the longest line
const getWidth = (lines) => {
    let width = 0
    lines.forEach(line => {
        width = Math.max(width, line.length)
    })
    return width
}

// buffer around input file (top, bottom, left and right)
const getLayoutFromLines = (lines) => {
    const width = getWidth(lines)

    const layout = []
    layout.push(' '.repeat(width + 2).split(''))
    lines.forEach(line => {
        layout.push((' ' + line + ' '.repeat(width - line.length) + ' ').split(''))
    });
    layout.push(' '.repeat(width + 2).split(''))
    return layout
}

export const test = (setInput) => {
    fetch(myTextFile)
        .then((r) => r.text())
        .then(text => {
            setInput(text)
            // console.log(text);
        })
}



export const solve = (input, allowReflections = false) => {

    const lines = input.split('\n')
    for (let i = 0; i < lines.length; ++i) {
        lines[i] = lines[i].replace('\r', '')
    }
    // const width = getWidth(lines)
    const layout = getLayoutFromLines(lines)
    console.log(layout)
    // Area of largest piece
    let boardSize = 0
    const bag = []
    for (let i = 0; i < layout.length; ++i) {
        for (let j = 0; j < layout[i].length; ++j) {
            if (layout[i][j] != " ") {
                const a = new Piece(layout[i][j])
                a.buildPiece(i, j, 0, 0, layout)
                a.symmetry = testSym(a)
                if (allowReflections) {
                    a.reflect = testRef(a)
                }
                bag.push(a)
                if (a.size > boardSize) {
                    boardSize = a.size
                }
            }
        }
    }
    let board
    // Remove the board from bag
    for (let i = 0; i < bag.length; ++i) {
        if (bag[i].size == boardSize) {
            board = bag[i]
            bag.splice(i, 1)
            break
        }
    }

    for (let x = 0; x < bag.length; ++x) {//fix one piece with no symmetries if the board is symmetrical/semisymmetrical
        const i = bag[x]
        if (i.reflect == 2 && i.symmetry == 4) {
            i.symmetry = board.symmetry
            i.reflect = board.reflect
            break
        }
        if (allowReflections == 0 && i.symmetry == 4) {
            i.symmetry = board.symmetry
            break
        }
    }

    let sameSize = bag[0].size
    for (let i = 0; i < bag.length; ++i) {
        if (bag[i].size != sameSize) {
            sameSize = 0
            break
        }
    }
    sizeCheck(bag, boardSize)

    const solutions = []
    const used = []
    const bfirst = [[bag, used, [board]]]
    console.log('board')
    console.log(board)
    let i = 0
    while (bfirst.length > 0) {
        // console.log(bfirst)
        boardFirstSolve(bfirst, solutions, sameSize)
        // if (solutions.length > 0 || i >= 48249) {
        //     console.log('step: ' + i)
        //     console.log(solutions)
        //     break
        // }
        // break
        i++
    }
    console.log('bfirst')
    console.log(bfirst)
    console.log('solutions')
    console.log(solutions)
}