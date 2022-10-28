import { toLowerCase, toNumber, trim } from './cast.helper';

describe('tests for helpers', () => {
  it('tolowerCase', () => {
    const result = toLowerCase('ABCdMELI');
    expect(result).toBe('abcdmeli');
  });

  it('trim', () => {
    const result = trim('             ABCdMELI             ');
    expect(result).toBe('ABCdMELI');
  });

  it('tuNumber', () => {
    const result = toNumber('102');
    expect(result).toBe(102);
  });

  it('tuNumber should return default', () => {
    const result = toNumber('invalid', 200);
    expect(result).toBe(200);
  });
});
