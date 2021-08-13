
export function count(k = true, num, start) {
  if (start == null) {
    var m = new Date()
    start = m.getFullYear()
  }

  var number = []
  for (var i = 0; i < num; i++) {
    if (!k) {
      var obj = {
        value: start - i
      }
    } else {
      obj = {
        value: start + i
      }
    }

    number.push(obj)
  }
  return number
}
