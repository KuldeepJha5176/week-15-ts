export function random(len: number) {
  let options = "udgsuydcubsdjakfvkjdfhgvsy837426r8r4198y39708";
  let length = options.length;

  let ans = "";
  for (let i = 0; i < options.length; i++) {
    ans += options[Math.floor(Math.random() * length)];
  }
  return ans;
}
