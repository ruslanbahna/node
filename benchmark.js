const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const totalStartTime = Date.now();

suite
  .add('Fibonacci Recursive', function() {
    const fib = (n) => n < 2 ? n : fib(n - 1) + fib(n - 2);
    fib(30);
  })
  .add('Array Sorting', function() {
    const arr = Array.from({ length: 10 }, () => Math.random());
    arr.sort((a, b) => a - b);
  })
  .add('String Manipulation', function() {
    let str = '';
    for (let i = 0; i < 10; i++) str += 'a';
  })
  .add('Map Operations', function() {
    const map = new Map();
    for (let i = 0; i < 10; i++) map.set(i, i * i);
  })
  .add('Set Operations', function() {
    const set = new Set();
    for (let i = 0; i < 10; i++) set.add(i);
  })
  .add('JSON Parsing', function() {
    const json = JSON.stringify(Array.from({ length: 10 }, (_, i) => ({ num: i })));
    JSON.parse(json);
  })
  .add('RegExp Matching', function() {
    const str = 'hello world';
    /o/.test(str);
  })
  .add('Math Operations', function() {
    for (let i = 0; i < 10; i++) Math.sqrt(i);
  })
  .on('cycle', event => console.log(String(event.target)))
  .on('complete', function() {
    console.log('All tasks completed. Fastest is ' + this.filter('fastest').map('name'));
    const totalEndTime = Date.now();
    console.log('Total execution time: ' + (totalEndTime - totalStartTime) + ' ms');
  })
  .run({ async: true });

console.log("Benchmark test started...");