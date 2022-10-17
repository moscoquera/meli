  export function toLowerCase(value: string): string {
    return value.toLowerCase();
  }
  
  export function trim(value: string): string {
    return value.trim();
  }
  
  export function toNumber(value: string, defaultVal: number = 10): number {
    let newValue: number = Number.parseInt(value || String(defaultVal), 10);
  
    if (Number.isNaN(newValue)) {
      newValue = defaultVal;
    }
    return newValue;
  }