// 适用于数组中都是对象，且需要根据对象中的某个属性进行排序。默认正序排列。
export function sortArrayByKey(arr: any[], key: string, desc = 'asc'): any[] {
  if (arr.length < 2) return arr;
  let middleIndex = Math.floor(arr.length / 2);
  let left: any[] = [];
  let right: any[] = [];
  arr.forEach((row, idx) => {
    if (idx !== middleIndex) {
      if (desc === 'asc') {
        if (row[key] >= arr[middleIndex][key]) {
          right.push(row);
        }
        if (row[key] < arr[middleIndex][key]) {
          left.push(row);
        }
      } else {
        if (row[key] >= arr[middleIndex][key]) {
          left.push(row);
        }
        if (row[key] < arr[middleIndex][key]) {
          right.push(row);
        }
      }
    }
  });
  return sortArrayByKey(left, key, desc).concat([arr[middleIndex]], sortArrayByKey(right, key, desc));
}
