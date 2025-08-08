export function toRoman(n: number): string {
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      throw new Error("Input must be an integer between 1 and 100");
    }
  
    const map: [number, string][] = [
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ];
  
    let result = "";
    for (const [value, numeral] of map) {
      while (n >= value) {
        result += numeral;
        n -= value;
      }
    }
  
    return result;
  }
  