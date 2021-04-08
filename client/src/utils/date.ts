import dayjs from 'dayjs';

// 5天毫秒数
const DAY_5 = 24 * 60 * 60 * 1000;

// 友好地显示时间：刚刚、几分钟前、几天前等
export function dateToFromNow(date: number) {
  let ret;
  // 五天内显示相对时间
  ret = Date.now() - date < DAY_5 ? (dayjs(date) as any).fromNow() : dayjs(date).format('YY/MM/DD');

  return ret;
}
