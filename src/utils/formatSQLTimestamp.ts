export function formatSQLTimestamp(date: Date) {
    const pad = (n: number, z = 2) => n.toString().padStart(z, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // месяц от 0
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const ms = pad(date.getMilliseconds(), 3); // 3 цифры для миллисекунд

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
}
