const urlRegExp = new RegExp(
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/
);
export function validateUrl(url: string): boolean {
    return url === 'https://' || urlRegExp.test(url);
}

export function getDatePrintFormat(date_string: string | undefined) {
    if (!date_string) {
        return null;
    }
    const dateObject: Date = new Date(date_string);
    const year: number = dateObject.getFullYear();
    const month: number = dateObject.getMonth() + 1;
    const date: number = dateObject.getDate();
    const hour: number = dateObject.getHours();
    const second: number = dateObject.getSeconds();
    // 아니면 그냥 dateObject.toLocaleString() 서또 된다.
    return `${year}.${month.toString().padStart(2, '0')}.${date.toString().padStart(2, '0')} ${hour}:${second}`;
}
