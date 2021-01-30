class SudokuSolver {

  validate(puzzleString) {
    //check that there are 81 characters
    if(puzzleString.length !== 81){
      return { error: 'Expected puzzle to be 81 characters long' }
    }
    //check that characters are within {0-9 | .}   
    let validTextValues = /^[1-9.]*$/;
    if(!validTextValues.test(puzzleString)){
      return { error: 'Invalid characters in puzzle' }
    }
    return { error: 'none' }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    //check that numbers aren't repeated in row    
    let values = puzzleString.split("");
    let r = (row.charCodeAt(0) - 'A'.charCodeAt(0)) * 9;
    let i = 0
    while(i < 9){
      if(values[r] == value){
        return false;
      }
      i++
      r++;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    //check that numbers aren't repeated in column    
    let values = puzzleString.split("");
    let c = column - 1;
    while(c < puzzleString.length){
      if(values[c] == value){
        return false;
        break;
      }
      c += 9;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    //check that numbers aren't repeated within region
    //calculate index of value
    let values = puzzleString.split("");
    let i = parseInt((row.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)) / 3) * 3 * 9 + parseInt((column - 1) / 3) * 3;
    let c = 0;
    let r = 0;
    while(r < 3){
      if(values[i] == value){
        return false;
        break;
      }
      if(c === 3){
        c = 0;
        r++;
        i += 6;
      } else {
        c++;
        i++;
      }
    }    
    return true;
  }

  canPlace(board, row, col, value) {

    /* Check Column */
    let i
    for(i = 0; i < 9; i++){
      if(board[i][col] == value){
        return false
      }
    }

    /*Check Row */
    let j
    for(j=0; j < 9; j++){
      if(board[row][j] == value){
        return false
      }
    }

    /*Check Box Placement */
    let boxTopRow = parseInt(row / 3) * 3       // Returns index of top row of box (0, 3, or 6)
    let boxLeftColumn = parseInt(col / 3) * 3   // Returns index of left column of box (0, 3 or 6)

    let k // Looks through rows
    let l // Looks through columns
    for (k = boxTopRow; k < boxTopRow + 3; k++) {
      for(l = boxLeftColumn; l < boxLeftColumn + 3; l++){
        if(board[k][l] == value){
          return false
        }
      }
    }

    return true
  }

  solveFromCell(board, row, col) {

    //console.log('Attempting to solve row ' + (row + 1) + ', column ' + (col+1))

    /* If on column 9 (outside row), move to next row and reset column to zero */
    if(col === 9){
      col = 0
      row ++
    }

    /* If on row 9 (outside board), the solution is complete, so return the board */
    if(row === 9){
      return board
    }

    /* If already filled out (not empty) then skip to next column */
    if(board[row][col] != '.'){
      return this.solveFromCell(board, row, col + 1)
    }

    //* Try placing in values */

    // Start with 1 and check if okay to place in cell. If so,
    // run the algorithm from the next cell (col + 1), and see if
    // false is not returned. A returned board indicates true, since
    // a solution has been found. If false was returned, then empty out
    // the cell, and try with next value
    let i
    for(i = 1; i < 10; i ++){
      let valueToPlace = i.toString()
      //console.log('Trying with ' + valueToPlace)
      if(this.canPlace(board, row, col, valueToPlace)){
        board[row][col] = valueToPlace
        if(this.solveFromCell(board, row, col + 1) != false){
          return board
        }else{
          board[row][col] = '.'
        }
      }
    }
    
    /* If not found a solution yet, return false */
    return false
  }

  solve(puzzleString) {
    let values = puzzleString.split("");
    let board = [[],[],[],[],[],[],[],[],[]];
    let boardRow = -1;
    let i = 0;
    while (i < values.length){
      if(i % 9 === 0){
        boardRow += 1;
      }
      board[boardRow].push(values[i])//board will contain dots
      i++;
    }

    let solvedBoard = this.solveFromCell(board, 0, 0) 

    let result = {}

    if(solvedBoard == false){
      result.error = 'Puzzle cannot be solved'
      return result
    } else {

      let solution = ''
      for(let l=0; l < 9; l++){
        solution += solvedBoard[l].join('')
      }

      result.solution = solution

      return result
    }
  }
}

module.exports = SudokuSolver;

