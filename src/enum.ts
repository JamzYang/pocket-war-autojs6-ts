export enum HuntType {
  army = '黑暗陆军',
  navy = '黑暗海军',
  airForce = '黑暗空军',
  chuizi = '战锤',
  heijun = '黑暗军团',
  nanmin = '难民',
  juxing = '惧星',
  byTurn = 'byTurn', //三军轮流
  right = 'right', //最右边
}

export enum EnemyName {
  Chuizi = '战锤',
  Heijun = '黑暗军团',
  Nanmin = '难民',
  Juxing = '惧星',
  Pengpeng = '砰砰',
  Jingwei = '黑暗精卫',
  Shouwei = '守卫',
  Null = '无',
}

export function getValueByKey<T>(enumObj: T, key: string): T[keyof T] | undefined {
  return enumObj[key as keyof T];
}
