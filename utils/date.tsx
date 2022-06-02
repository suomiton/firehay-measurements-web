import format from "date-fns/format";
import formatDistance from "date-fns/formatDistance";

export function DateDistance(from: string | Date, to: string | Date = new Date()): string {
    if(typeof from === "string") {
        from = new Date(from);
    }
    if(typeof to === "string") {
        to = new Date(to);
    }
    return formatDistance(from, to);
}

export function DateFormat(date: string | Date, formatting: string = "dd.MM.yyyy HH:mm"): string {
    if(typeof date === "string") {
        date = new Date(date);
    }
    return format(date, formatting);
}