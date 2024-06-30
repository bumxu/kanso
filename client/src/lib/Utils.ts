import { DateTime } from 'luxon';

export class Utils {

    public static parseDateServer(dateStr: string | undefined): DateTime | null {
        if (dateStr == null) {
            return null;
        }
        return DateTime.fromFormat(dateStr, dateStr.length === 8 ? 'yyyyMMdd' : 'yyyyMMddHHmm');
    }

    public static formatDateServer(date: DateTime | null, includeTime: boolean = true): string | null {
        if (date == null) {
            return null;
        }
        return date.toLocal().toFormat(includeTime ? 'yyyyMMddHHmm' : 'yyyyMMdd');
    }

}