'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //req.body {puzzle: , coordinate: A1, value: {1-9||.}}
      //res return { error: Required field(s) missing } if coordinate or value is missing
      if(!req.body.coordinate || req.body.coordinate == "" || !req.body.value || req.body.value == ''){
        return res.json({ error: 'Required field(s) missing' })
      }
      //||res return { error: 'Invalid coordinate'} if coordinate invalid
      let validCoordInput = /^[a-iA-I][1-9]$/;
      if(!validCoordInput.test(req.body.coordinate)){
        return res.json({ error: 'Invalid coordinate'})
      }
      //||res return { error: 'Invalid value' } if value <> {1-9}
      let validValueInput = /^[1-9]$/;
      if(!validValueInput.test(req.body.value)){
        return res.json({ error: 'Invalid value' })
      }
      //||res return { error: 'Expected puzzle to be 81 characters long' } if puzzle.length <> 81
      if(req.body.puzzle.length !== 81){
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      //||res return { error: 'Invalid characters in puzzle' } if value is an  char
      let validPuzzleValues = /^[1-9.]*$/
      if(!validPuzzleValues.test(req.body.puzzle)){
        return res.json({ error: 'Invalid characters in puzzle' })
      }
      //||res return {valid: false, {conflict: 'row' 'column' 'region'}} specify why invalid
      let response = {}
      let conflict = [];
      if(!solver.checkRowPlacement(req.body.puzzle, req.body.coordinate.substr(0,1), req.body.coordinate.substr(1,1), req.body.value)){
        conflict.push('row')
      }
      if(!solver.checkColPlacement(req.body.puzzle, req.body.coordinate.substr(0,1), req.body.coordinate.substr(1,1), req.body.value)){
        conflict.push('column')
      }
      if(!solver.checkRegionPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value)){
        conflict.push('region')
      }

      if(conflict.length > 0){
        response.valid = false;
        response.conflict = conflict
        return res.json(response)
      }
      response.valid = true

      //||res return {valid: true} if valid
      return res.json(response)
    
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      //req includes form data {puzzle: '81 valid char string'}
      //|| return { error: 'Required field missing' }
      if(!req.body.puzzle){
        return res.json({ error: 'Required field missing' })
      }
      //|| return { error: 'Expected puzzle to be 81 characters long' } if puzzle.length <> 81
      if(solver.validate(req.body.puzzle).error !== 'none'){
        return res.json({error : solver.validate(req.body.puzzle).error })
      }      
      //let solution = solver.solve(req.body.puzzle)
      //if(!solution){
      //  return res.json({error: 'Puzzle cannot be solved'})
      //}
      //let result = {}
      //result.solution = solution
      return res.json(solver.solve(req.body.puzzle))
    });
};

