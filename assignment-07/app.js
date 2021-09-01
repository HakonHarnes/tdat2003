// -- TASK 1 -- // 
console.log("-- TASK 1 --");

let v1 = [1, 2, 3];
let v2 = [4, 5, 6];

console.log('2 + v1: ', 
v1.map(e => e + 2)); 

console.log('2 * v1: ', 
v1.map(e => e * 2)); 

console.log('mean of v1: ',
v1.reduce((sum, e, i) => sum + e, 0) / v1.length) ; 

console.log('v1 dot v2: ',
v1.reduce((sum, e, i) => sum + e * v2[i], 0));

console.log('sum of v1 + 2 * v2: ',
v1.reduce((sum, e, i) => sum + e + (2 * v2[i]), 0)); 

console.log('v1 as string: ', 
v1.reduce((string, e, i) => string + 'v1[' + i + '] = ' + e + ', ', '')); 

// -- TASK 2 -- // 
console.log("\n-- TASK 2 --");

class Complex {
  constructor(real, img) {
    this.real = real;
    this.img = img;
  }
}

let v = [new Complex(2, 2), new Complex(1, 1)];

console.log('v elements as strings:', 
v.map(e => e.real + ' + ' + e.img + 'i'));

console.log('magnitude of v elements: ', 
v.map(e => Math.sqrt(Math.pow(e.real, 2) + Math.pow(e.img, 2)))); 

console.log('sum of v: ', 
'real: ' + v.reduce( (real, e) => real + e.real, 0),
'imag: ' + v.reduce( (imag, e) => imag + e.img, 0));

// -- TASK 3 -- // 
console.log("\n-- TASK 3 --");
let students = [{ name: 'Ola', grade: 'A' }, { name: 'Kari', grade: 'C' }, { name: 'Knut', grade: 'C' }];

console.log('student elements as strings: ', 
students.map(e => e.name + ' got ' + e.grade));

console.log('how many got C: ', 
students.filter(e => e.grade == 'C').length);

console.log('percentage of C grades: ', 
students.filter(e => e.grade == 'C').length / students.length);

console.log('did anynone get A: ', 
students.filter(e => e.grade == 'A').length > 0 ? 'Yes' : 'No'); 

console.log('did anynone get F: ', 
students.filter(e => e.grade == 'F').length > 0 ? 'Yes' : 'No'); 