function isValid(expr) {
  // validate expression
  return true;
}

function getOperator(expr) {
  var parts = expr.split(' ');
  return parts[0].substr(1, parts[0].length);
}

function getOperands(expr) {
  // remove the "(" and the operator
  var trimExpr = expr.substr(3, expr.length).trim();

  // remove trailing ")"
  var trimExpr = trimExpr.substr(0, trimExpr.length - 1);

  // find subexpressions
  var subExpressions = [];

  // this is a hack as js regex doesn't allow to math several occurrences of the
  // same string
  trimExpr = trimExpr.replace(/(\(.*?\))/g, function(subexpr) {
    console.log('found subexpr', subexpr);
    subExpressions.push(subexpr);

    return '(subexpr)';
  });

  var operands = trimExpr.split(' ');
  for ( var i = 0; i < subExpressions.length; i++) {
    var placeholderIdx = operands.indexOf('(subexpr)');
    operands[placeholderIdx] = subExpressions[i];
  }

  return operands;
}

function isExpression(expr) {
  return (expr[0] == '('); // actually this is more complex to determine, for
  // this example just do this
}

function eval(expression, environment) {
  if (!isValid(expression)) {
    console.error('Invalid expression:', expression);
    return;
  }

  var operator = getOperator(expression);
  var operands = getOperands(expression);

  for ( var i = 0; i < operands.length; i++) {
    var operand = operands[i];

    if (isExpression(operand)) {
      operands[i] = eval(operand);
    }
  }

  return {
    operator : operator,
    operands : operands
  };
}

function apply(evaled) {
  var procs = {
    '+' : function(args) {
      var result = 0;
      for ( var i = 0; i < args.length; i++)
        result += parseFloat(args[i]);

      return result;
    },
    '*' : function(args) {
      var result = 1;
      for ( var i = 0; i < args.length; i++)
        result *= parseFloat(args[i]);

      return result;
    },
    '/' : function(args) {
      return Math.round(args[0] / args[1]);
    },
    '-' : function(args) {
      var result = args[0];
      for ( var i = 1; i < args.length; i++)
        result -= parseFloat(args[i]);

      return result;
    }
  };

  var proc = evaled.operator;
  var args = evaled.operands;

  for ( var i = 0; i < args.length; i++) {
    var isExpr = (typeof args[i] == 'object');
    if (isExpr) {
      var subexpr = args[i];
      args[i] = apply(subexpr);
      console.log('Partial result', args[i]);
    }
  }

  var procFn = procs[proc];
  if (typeof procFn != 'function') {
    console.error(procFn, 'operator not found');
    return;
  }
  return procFn(args);
}

function resolve() {
  var expression = document.getElementById('expression').value;
  var resultEl = document.getElementById('result');

  var evaled = eval(expression);
  console.log('evaled', evaled);
  
  resultEl.innerHTML = apply(evaled).toString();
}

// var evaled = eval('(+ 10 (* 1 2))');
// console.log('evaled=', evaled);
// console.log('applied=', apply(evaled));
