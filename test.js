const arr = [1, 2, 3, 4, 5];

const sum = arr.reduce((pre, cur) => {
  return pre + cur;
}, 0);

console.log(sum);
