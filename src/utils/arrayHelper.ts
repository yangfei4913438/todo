/**
 * 数组排序: 用于todo列表返回时的排序
 *
 * 最优解是在服务端返回数据的时候排序好，放到缓存中。这里是mock, 所以在前端加了个排序
 */
export const sortArray = (arr: ITodoItem[]): ITodoItem[] => {
  // 先根据 等级进行排序，然后再按创建时间进行排序
  return arr.sort((a: ITodoItem, b: ITodoItem) => {
    if (a.level === b.level) {
      // 时间大的在前面
      return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
    } else {
      // 等级大的在前面
      return a.level > b.level ? -1 : 1;
    }
  });
};
