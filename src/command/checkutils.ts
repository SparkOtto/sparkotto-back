class CheckUtils {
    static empty(value: any): boolean {
        return value === null || value === undefined || value === '';
    }

    static equals(value1: any, value2: any): boolean {
        return value1 === value2;
    }

    static notEquals(value1: any, value2: any): boolean {
        return value1 !== value2;
    }

    static isEmail(value: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    static isNumeric(value: any): boolean {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }
}

export default CheckUtils;