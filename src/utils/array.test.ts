import { sortArray } from './arrayHelper';

describe('测试数组方法', () => {
  it('测试数组排序1: level 不同', () => {
    const data = [
      { id: 'r2sxR9jKg', title: '买一辆车', level: 0, time: 1622942487518 },
      { id: 'Yg4R_bjc4', title: '买一套房', level: 2, time: 1622942492375 },
      { id: 'mJwzfBnyx', title: '娶个老婆', level: 1, time: 1622942498319 },
    ];
    const sortData = [
      { id: 'Yg4R_bjc4', title: '买一套房', level: 2, time: 1622942492375 },
      { id: 'mJwzfBnyx', title: '娶个老婆', level: 1, time: 1622942498319 },
      { id: 'r2sxR9jKg', title: '买一辆车', level: 0, time: 1622942487518 },
    ];
    expect(sortArray(data)).toEqual(sortData);
  });
  it('测试数组排序2: level 相同，time 不同', () => {
    const data = [
      { id: 'r2sxR9jKg', title: '买一辆车', level: 1, time: 1622942487518 },
      { id: 'Yg4R_bjc4', title: '买一套房', level: 1, time: 1622942487517 },
      { id: 'mJwzfBnyx', title: '娶个老婆', level: 1, time: 1622942487519 },
      { id: 'qamhI4FeH', title: '事业有成', level: 1, time: 1622942487519 },
    ];
    const sortData = [
      { id: 'mJwzfBnyx', title: '娶个老婆', level: 1, time: 1622942487519 },
      { id: 'qamhI4FeH', title: '事业有成', level: 1, time: 1622942487519 },
      { id: 'r2sxR9jKg', title: '买一辆车', level: 1, time: 1622942487518 },
      { id: 'Yg4R_bjc4', title: '买一套房', level: 1, time: 1622942487517 },
    ];
    expect(sortArray(data)).toEqual(sortData);
  });
});
