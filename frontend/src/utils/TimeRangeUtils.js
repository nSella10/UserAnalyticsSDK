
export default class TimeRangeUtils {
  /**
   * מחזיר את פרמטרי הזמן לשליחה לשרת בהתאם לטווח הזמן שנבחר
   * @param {string} timeRange - טווח הזמן שנבחר ('all', 'day', 'week', 'month')
   * @returns {Object} אובייקט עם שדות fromDate ו-toDate
   */
  static getDateRangeParams(timeRange) {
    if (timeRange === 'all') return {};

    const now = new Date();
    let fromDate = new Date();

    // הגדרת טווח הזמן בהתאם לבחירה
    switch (timeRange) {
      case 'day':
        fromDate.setTime(now.getTime() - 24 * 60 * 60 * 1000); // 24 שעות אחורה
        break;
      case 'week':
        fromDate.setDate(fromDate.getDate() - 7); // שבוע אחורה
        break;
      case 'month':
        fromDate.setMonth(fromDate.getMonth() - 1); // חודש אחורה
        break;
      default:
        return {};
    }

    // פורמט התאריך בצורה שתואמת את הפורמט שהשרת מצפה לו
    // שליחת זמן מקומי (ישראל) בפורמט ISO
    console.log('🕐 Frontend sending dates:', {
      fromDate: fromDate.toISOString(),
      toDate: now.toISOString(),
      fromDateLocal: fromDate.toLocaleString('he-IL'),
      toDateLocal: now.toLocaleString('he-IL')
    });

    return {
      fromDate: fromDate.toISOString(),
      toDate: now.toISOString()
    };
  }

  /**
   * מוסיף את פרמטרי הזמן ל-URLSearchParams
   * @param {URLSearchParams} params - אובייקט URLSearchParams
   * @param {string} timeRange - טווח הזמן שנבחר
   * @returns {URLSearchParams} אובייקט URLSearchParams עם הפרמטרים שהתווספו
   */
  static addTimeRangeToParams(params, timeRange) {
    const dateRange = this.getDateRangeParams(timeRange);

    if (dateRange.fromDate) {
      params.append('fromDate', dateRange.fromDate);
    }

    if (dateRange.toDate) {
      params.append('toDate', dateRange.toDate);
    }

    return params;
  }

  /**
   * מחזיר תיאור מילולי של טווח הזמן הנבחר
   * @param {string} timeRange - טווח הזמן שנבחר
   * @returns {string} תיאור מילולי של טווח הזמן
   */
  static getTimeRangeDescription(timeRange) {
    switch (timeRange) {
      case 'day':
        return '24 שעות אחרונות';
      case 'week':
        return 'שבוע אחרון';
      case 'month':
        return 'חודש אחרון';
      default:
        return '';
    }
  }
}