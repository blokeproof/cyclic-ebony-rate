const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function(done) {
    let puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(solver.validate(puzzle).error, "none");
    done();
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function(done) {
    let puzzle =
      "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(solver.validate(puzzle).error, "Invalid characters in puzzle");
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function(done) {
    let puzzle =
      ".5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(
      solver.validate(puzzle).error,
      "Expected puzzle to be 81 characters long"
    );
    done();
  });

  test("Logic handles a valid row placement", function(done) {
    let puzzleString =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let row = "A";
    let column = "1";
    let value = 7;
    assert.isTrue(solver.checkRowPlacement(puzzleString, row, column, value));
    done();
  });

  test("Logic handles an invalid row placement", function(done) {
    let puzzleString =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let row = "A";
    let column = "5";
    let value = 1;
    assert.isFalse(solver.checkRowPlacement(puzzleString, row, column, value));
    done();
  });

  test("Logic handles a valid column placement", function(done) {
    let puzzleString =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let row = "G";
    let column = "4";
    let value = 1;
    assert.isTrue(solver.checkColPlacement(puzzleString, row, column, value));
    done();
  });
  //fails
  test("Logic handles an invalid column placement", function(done) {
    let puzzleString =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let row = "G";
    let column = "4";
    let value = 7;
    assert.isFalse(solver.checkColPlacement(puzzleString, row, column, value));
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", function(done) {
    let puzzleString =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let row = "A";
    let column = "1";
    let value = 1;
    assert.isTrue(
      solver.checkRegionPlacement(puzzleString, row, column, value)
    );
    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", function(done) {
    let puzzleString =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let row = "A";
    let column = "1";
    let value = 2;
    assert.isFalse(
      solver.checkRegionPlacement(puzzleString, row, column, value)
    );
    done();
  });

  test("Valid puzzle strings pass the solver", function(done) {
    let puzzleString =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.property(solver.solve(puzzleString), "solution");
    done();
  });

  test("Invalid puzzle strings fail the solver", function(done) {
    let puzzleString =
      "a.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.equal(
      solver.validate(puzzleString).error,
      "Invalid characters in puzzle"
    );
    done();
  });

  test("Solver returns the the expected solution for an incomplete puzzle", function(done) {
    let puzzleString =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    let solution =
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    assert.equal(solver.solve(puzzleString).solution, solution);
    done();
  });
});
