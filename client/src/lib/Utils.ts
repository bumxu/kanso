import { DateTime } from 'luxon';

export class Utils {

    public static parseDateServer(dateStr: string | null): DateTime | null {
        if (dateStr == null) {
            return null;
        }
        return DateTime.fromFormat(dateStr, 'dd/MM/yyyy HH:mm ZZZ');
    }

    public static formatDateServer(date: DateTime | null): string | null {
        if (date == null) {
            return null;
        }
        return date.toLocal().toFormat('dd/MM/yyyy HH:mm ZZZ');
    }
}