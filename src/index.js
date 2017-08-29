const Matrix = require("ml-matrix");

module.exports = {
  nmf: nmf
}


/**
 * Compute the NMF of a matrix V, i.e the matrix W and H => A ~= W.H
 * @param {Matrix} V - Matrix to factorize
 * @param {Object} options - options can include the parameters K (width of the Matrix W and height of the Matrix H), Winit (Init matrix of W), Hinit (Init matrix of H), tol (tolerance - default is 0.001) and maxIter (maximum of iterations before stopping - default is 100)
 * @return {Object} WH - object with the format {W: ..., H: ...}. W and H are the results (i.e A ~= W.H)
 */

function nmf(V,options){
  const n = V.rows;
  const m = V.columns;
  const {
    K: 2,
    Winit: Matrix.zeros(m, K),
    Hinit: Matrix.zeros(K, n),
    tol: 0.001,
    maxIter: 100
  } = options;

  var W = Winit;
  var H = Hinit;
  var gradW = W.mmul(H.mmul(H.transpose())) - V.mmul(H.transpose());
  var gradH = W.transpose().mmul(W).mmul(H) - W.transpose().mmul(V);
  
  var initgrad = concatMatrix(gradW, gradH.transpose(), 'H');
  
  initgrad = norm2(initgrad);
  var tolW = max(0.001, tol)*initGrad;
  var tolH = tolW;

  for(var i; i < maxIter; i++){
    var projnorm = norm2(concatMatrix(selectElementsFromMatrix(gradW, logical_or_matrix(elementsMatrixInferiorZero(gradW), elementsMatrixSuperiorZero(W))), selectElementsFromMatrix(gradH, logical_or_matrix(elementsMatrixInferiorZero(gradH), elementsMatrixSuperiorZero(H)))));
    if(projnrom < tol*initgrad){
      break;
    }
    tmp = nlssubprob(V.transpose(),H.transpose(),W.transpose(),tolW,1000)
    W = tmp.M;
    gradW = tmp.grad;
    iterW = tmp.iter;

    W = W.transpose();
    gradW = gradW.transpose();
  
    if (iterW==1){
      tolW = 0.1 * tolW
    }
  
    tmp = nlssubprob(V,W,H,tolH,1000);
    H = tmp.M;
    gradH = tmp.grad;
    iterH = tmp.iter;
    if(iterH==1){
      tolH = 0.1 * tolH;
    }
  }
  console.log('\nIter = '+iter);
  return {W: W,H: H}
}

function nlssubprob(V, W, Hinit, tol, maxIter){
  var H = Hinit
  var WtV = W.transpose().mmul(V);
  var WtW = W.transpose().mmul(W);
  var grad = 0;
  var alpha = 1;
  var beta = 0.1;
  var decrAlpha;
  var Hp;

  for(var iter = 0; iter < maxIter; iter++) {
    grad = WtW.mmul(H) - WtV;
    projgrad = norm2(selectElementsFromMatrix(grad, logical_or_matrix(elementsMatrixInferiorZero(grad), elementsMatrixSuperiorZero(H))));
    for (let innerIter = 1; innerIter < 20; innerIter++) {
      let Hn = Matrix.sub(H, Matrix.mul(grad, alpha));
      Hn = replaceElementsMatrix(Hn, elementsMatrixSuperiorZero(Hn), 0);
      let d = Matrix.sub(Hn, H);
      let gradd = sumElements(multiplyELementByElement(d, grad));
      let dQd = sumElements(multiplyElementByElement(Matrix.mmul(WtW, d), d));
      let suffDecr = 0.99 * gradd + 0.5 * dQd < 0;
      if (innerIter === 1) {
        decrAlpha = ! suffrDecr;
        Hp = H.clone();
      if (decrAlpha) {
        if (suffDecr) {
          H = Hn.clone();
          break;
        } else {
          alpha = alpha * beta;
        }
      } else {
        if (! suffDecr || matrixEqual(H, Hp)) {
          H = Hp.clone();
          break;
        } else {
          alpha = alpha / beta;
          Hp = H.clone();
        }
      }
    }
    
    if (iter === maxiter) {
      console.log('Max iterations in nlssubprob');
    }
  }
  return {M: H, grad: grad, iter: iter};
}


function norm2(A){
  var result = 0;
  for(var i = 0; i < A.rows; i++){
    for(var j = 0; j < A.columns; j++){
      result = result + Math.abs(A.get(i,j))**2;
    }
  }
  return Math.sqrt(result);
}

function concatMatrix(A, B, direction='H'){
  var result = A;
  if(direction == 'H'){
    for(var i = 0; i < B.columns; i++){
      result = result.addColumnVector(B.getColumn(i));
    }
  }
  else{
    for(var i = 0; i < B.rows; i++){
      result = result.addRowVector(B.getRow(i));
    }
  }
  return result;
}

function elementsMatrixSuperiorZero (X) {

}

function elementsMatrixInferiorZero (X) {

}

function selectElementsFromMatrix (X, arrayBooleans) {
    
} 

function replaceElementsMatrix (X, arrayBooleans, value) {
    
} 

function logical_or_matrix(m1, m2) {

}

function sumElements (X) {

}

function multiplyELementByElement (m1, m2) {

}

function matrixEqual (m1, m2) {

}