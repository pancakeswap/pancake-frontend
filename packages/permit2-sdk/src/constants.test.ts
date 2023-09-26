import { MaxUint48, MaxUint160, MaxUint256, InstantExpiration } from './constants'

describe('Constants', () => {
  it('MaxUint256', () => {
    const expected = BigInt(2) ** BigInt(256) - BigInt(1);
    expect(MaxUint256).toEqual(expected);
  });

  it('MaxUint160', () => {
    const expected = BigInt(2) ** BigInt(160) - BigInt(1);
    expect(MaxUint160).toEqual(expected);
  });

  it('MaxUint48', () => {
    const expected = BigInt(2) ** BigInt(48) - BigInt(1);
    expect(MaxUint48).toEqual(expected);
  });

  it('InstantExpiration', () => {
    const expected = BigInt(0);
    expect(InstantExpiration).toEqual(expected);
  });
});