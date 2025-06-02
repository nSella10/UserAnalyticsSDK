package com.analytics.analyticsfinal.pages;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.analytics.analyticsfinal.R;
import com.analytics.analyticsfinal.model.ItemDetail;
import com.analytics.analyticsfinal.adapter.ItemDetailAdapter;
import com.analytics.analyticsfinal.utils.UserManager;
import com.analytics.analyticstracker.AnalyticsTracker;

import java.util.*;

public class ItemDetailActivity extends AppCompatActivity {

    private RecyclerView itemRecycler;
    private String category; // הוספת שדה לשמירת הקטגוריה
    private String subcategory; // הוספת שדה לשמירת התת-קטגוריה

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_item_detail);

        category = getIntent().getStringExtra("category"); // שמירה בשדה הקלאס
        subcategory = getIntent().getStringExtra("subcategory"); // שמירה בשדה הקלאס

        setTitle("קטגוריה: " + category + " > " + subcategory);

        itemRecycler = findViewById(R.id.itemRecycler);
        itemRecycler.setLayoutManager(new LinearLayoutManager(this));

        List<ItemDetail> items = loadItems(category, subcategory);
        itemRecycler.setAdapter(new ItemDetailAdapter(this, items,category,subcategory
        ));
    }
    @Override
    protected void onResume() {
        super.onResume();
        // שליחת שם המסך עם הקטגוריה והתת-קטגוריה
        String screenName = "ItemDetailActivity_" + category + "_" + subcategory;
        AnalyticsTracker.startScreen(screenName);
    }

    @Override
    protected void onPause() {
        super.onPause();
        String userId = UserManager.getUserId(this);
        if (userId != null) {
            AnalyticsTracker.endScreen(userId);
        }
    }

    private List<ItemDetail> loadItems(String category, String subcategory) {
        List<ItemDetail> list = new ArrayList<>();
        if (category.equals("ספורט")) {
            switch (subcategory) {
                case "כדורגל":
                    list.add(new ItemDetail("כריסטיאנו רונאלדו", "כוכב פורטוגלי, זוכה 5 פעמים בכדור הזהב."));
                    list.add(new ItemDetail("ליאונל מסי", "כוכב ארגנטינאי, זוכה 7 פעמים בכדור הזהב."));
                    list.add(new ItemDetail("קיליאן אמבפה", "כוכב צעיר מצרפת, זכה במונדיאל 2018 והפך לסמל של הדור החדש."));
                    list.add(new ItemDetail("לוקה מודריץ'", "קשר נבחרת קרואטיה וריאל מדריד, זוכה בכדור הזהב לשנת 2018."));
                    break;
                case "כדורסל":
                    list.add(new ItemDetail("לברון ג'יימס", "אגדת NBA, אלוף 4 פעמים, ידוע בכוח, חוכמה ומנהיגות."));
                    list.add(new ItemDetail("סטף קרי", "הקלעי הטוב בהיסטוריה, שינה את המשחק עם השלשות שלו."));
                    list.add(new ItemDetail("יאניס אנטטוקומפו", "הכוח היווני, אלוף NBA ב־2021 עם מילווקי באקס."));
                    list.add(new ItemDetail("ניקולה יוקיץ'", "סנטר סרבי עם ראיית משחק ייחודית, MVP ב־2021 ו־2022."));
                    break;
                case "טניס":
                    list.add(new ItemDetail("רפאל נדאל", "מלך החימר, זוכה ביותר מ־20 תארי גרנד סלאם."));
                    list.add(new ItemDetail("רוג'ר פדרר", "אגדה שווייצרית, סמל לאלגנטיות ודיוק, פרש ב־2022."));
                    list.add(new ItemDetail("נובאק ג'וקוביץ'", "אחד הטניסאים הגדולים אי פעם, שובר שיאי גרנד סלאם."));
                    list.add(new ItemDetail("קארלוס אלקרס", "כוכב ספרדי צעיר, נחשב ליורש של נדאל."));
                    break;
                case "שחייה":
                    list.add(new ItemDetail("מייקל פלפס", "השחיין המעוטר ביותר בכל הזמנים, עם 23 מדליות זהב אולימפיות."));
                    list.add(new ItemDetail("קייטי לדקי", "אלופת עולם בשחייה למרחקים, בעלת סגנון עוצמתי ובלתי מנוצח."));
                    list.add(new ItemDetail("קיילב דרסל", "אלוף אולימפי אמריקאי בסגנון חופשי ופרפר."));
                    list.add(new ItemDetail("אדם פיטי", "שחיין בריטי המתמחה בחזה, שובר שיאים עולמיים."));
                    break;
                case "ריצה":
                    list.add(new ItemDetail("יוסיין בולט", "האיש המהיר בהיסטוריה, שיאן עולם ב־100 ו־200 מטר."));
                    list.add(new ItemDetail("אליוד קיפצ'וגה", "מרתוניסט קנייתי אגדי, הראשון שעבר מרתון בפחות מ־2 שעות."));
                    list.add(new ItemDetail("פלורנס גריפית' ג'וינר", "שיאנית עולם בריצת 100 ו־200 מטר לנשים."));
                    list.add(new ItemDetail("נואה ליילס", "כוכב אמריקאי צעיר בריצות קצרות, אלוף עולם בריצת 200 מטר."));
                    break;
            }
        } else if (category.equals("מוזיקה")) {
            switch (subcategory) {
                case "פופ":
                    list.add(new ItemDetail("Blinding Lights", "שיר מצליח של The Weeknd עם סאונד רטרו"));
                    list.add(new ItemDetail("Levitating", "להיט קצבי של Dua Lipa"));
                    list.add(new ItemDetail("As It Was", "שיר אישי ומרגש של Harry Styles"));
                    list.add(new ItemDetail("Shivers", "שיר אנרגטי של Ed Sheeran"));
                    break;
                case "רוק":
                    list.add(new ItemDetail("Bohemian Rhapsody", "שיר אייקוני של Queen"));
                    list.add(new ItemDetail("Smells Like Teen Spirit", "להיט של Nirvana מ־1991"));
                    list.add(new ItemDetail("Hotel California", "בלדת רוק אלמותית של The Eagles"));
                    list.add(new ItemDetail("Back In Black", "שיר עוצמתי של AC/DC"));
                    break;
                case "ג'אז":
                    list.add(new ItemDetail("Take Five", "קטע ג'אז איקוני של Dave Brubeck"));
                    list.add(new ItemDetail("So What", "יצירה של Miles Davis"));
                    list.add(new ItemDetail("My Favorite Things", "ביצוע ג'אז מפורסם של John Coltrane"));
                    list.add(new ItemDetail("Feeling Good", "שיר ג'אז־בלוז בביצוע Nina Simone"));
                    break;
                case "היפ הופ":
                    list.add(new ItemDetail("Lose Yourself", "שיר עוצמתי מתוך הסרט 8 Mile של אמינם"));
                    list.add(new ItemDetail("Sicko Mode", "שיתוף פעולה ייחודי של טראוויס סקוט ודרייק"));
                    list.add(new ItemDetail("God's Plan", "להיט של דרייק עם מסר חיובי"));
                    list.add(new ItemDetail("HUMBLE.", "שיר חזק של קנדריק לאמאר"));
                    break;
            }
        } else if (category.equals("סרטים")) {
            switch (subcategory) {
                case "אקשן":
                    list.add(new ItemDetail("John Wick", "סיפור נקמה עוצמתי בכיכוב קיאנו ריבס"));
                    list.add(new ItemDetail("Mad Max: Fury Road", "מרדף סוחף בעולם פוסט־אפוקליפטי"));
                    list.add(new ItemDetail("The Dark Knight", "באטמן נגד הג'וקר בקרב פסיכולוגי"));
                    list.add(new ItemDetail("Inception", "מותחן פעולה בתוך חלומות"));
                    break;
                case "קומדיה":
                    list.add(new ItemDetail("Superbad", "שני נערים בהרפתקה מצחיקה לפני סיום התיכון"));
                    list.add(new ItemDetail("The Hangover", "מסיבת רווקים שהשתבשה לגמרי"));
                    list.add(new ItemDetail("Step Brothers", "שני גברים בוגרים שחיים כמו ילדים"));
                    list.add(new ItemDetail("Dumb and Dumber", "שניים מהטיפשים המצחיקים ביותר על המסך"));
                    break;
                case "דרמה":
                    list.add(new ItemDetail("The Shawshank Redemption", "חברות ותקווה בתוך כלא קודר"));
                    list.add(new ItemDetail("Forrest Gump", "סיפורו המרגש של גבר פשוט עם לב גדול"));
                    list.add(new ItemDetail("The Pursuit of Happyness", "מאבק לשרוד ולהצליח בעולם העסקים"));
                    list.add(new ItemDetail("A Beautiful Mind", "סיפורו של מתמטיקאי מבריק עם סכיזופרניה"));
                    break;
                case "אנימציה":
                    list.add(new ItemDetail("Inside Out", "רגשותיה של ילדה מתמודדים עם שינוי גדול"));
                    list.add(new ItemDetail("Up", "מסע מופלא של סבא וילד בלון באוויר"));
                    list.add(new ItemDetail("Toy Story", "חיים סודיים של צעצועים"));
                    list.add(new ItemDetail("Finding Nemo", "הרפתקה בלב הים אחרי דגון קטן"));
                    break;
                case "אימה":
                    list.add(new ItemDetail("The Conjuring", "מבוסס על סיפור אמיתי של רוחות רפאים"));
                    list.add(new ItemDetail("It", "ליצן אימה מטיל פחד בילדים"));
                    list.add(new ItemDetail("Get Out", "מותחן אימה חברתי"));
                    list.add(new ItemDetail("A Quiet Place", "משפחה שנאבקת לשרוד בלי להשמיע קול"));
                    break;
            }
        } else if (category.equals("משחקים")) {
            switch (subcategory) {
                case "מחשב":
                    list.add(new ItemDetail("League of Legends", "משחק אסטרטגיה מרובה משתתפים"));
                    list.add(new ItemDetail("Counter-Strike", "משחק יריות תחרותי מהיר"));
                    list.add(new ItemDetail("Minecraft", "עולם פתוח לבנייה והרפתקאות"));
                    list.add(new ItemDetail("Valorant", "משחק יריות עם יכולות מיוחדות"));
                    break;
                case "קונסולה":
                    list.add(new ItemDetail("God of War", "הרפתקה אפית בעולם מיתולוגי"));
                    list.add(new ItemDetail("Spider-Man", "משחק אקשן בעיר ניו־יורק"));
                    list.add(new ItemDetail("Horizon Zero Dawn", "קרב נגד מכונות בעולם עתידני"));
                    list.add(new ItemDetail("The Last of Us", "סיפור הישרדות חזק בעולם פוסט־אפוקליפטי"));
                    break;
                case "מובייל":
                    list.add(new ItemDetail("Clash Royale", "משחק קלפים מהיר בזמן אמת"));
                    list.add(new ItemDetail("PUBG Mobile", "באטל רויאל הישרדותי"));
                    list.add(new ItemDetail("Among Us", "זהה את הבוגד בצוות החלל"));
                    list.add(new ItemDetail("Subway Surfers", "ריצה אינסופית וחמקמקה"));
                    break;
                case "לוח":
                    list.add(new ItemDetail("קטאן", "משחק אסטרטגיה לבניית יישובים"));
                    list.add(new ItemDetail("מונופול", "ניהול כספים ונכסים"));
                    list.add(new ItemDetail("דמקה", "משחק קלאסי של תכנון וטקטיקה"));
                    list.add(new ItemDetail("שחמט", "משחק אינטלקטואלי בן מאות שנים"));
                    break;
                case "יריות":
                    list.add(new ItemDetail("Call of Duty", "משחק יריות מבוסס מלחמות"));
                    list.add(new ItemDetail("Battlefield", "קרבות מלחמה מרובי משתתפים"));
                    list.add(new ItemDetail("Overwatch", "משחק יריות עם דמויות ייחודיות"));
                    list.add(new ItemDetail("Fortnite", "באטל רויאל עם בנייה ותחפושות"));
                    break;
            }
        } else if (category.equals("ספרים")) {
            switch (subcategory) {
                case "פנטזיה":
                    list.add(new ItemDetail("הארי פוטר", "המסע של קוסם צעיר נגד וולדמורט"));
                    list.add(new ItemDetail("שר הטבעות", "הרפתקה אפית בארץ התיכונה"));
                    list.add(new ItemDetail("אראגון", "סיפורו של נער שמוצא דרקון"));
                    list.add(new ItemDetail("עולם הדיסק", "סדרת פנטזיה סאטירית של טרי פראצ'ט"));
                    break;
                case "מותחנים":
                    list.add(new ItemDetail("החטא הקדמון", "בלש פרטי חושף קונספירציה"));
                    list.add(new ItemDetail("הנערה ברכבת", "אישה מגלה אמת מטרידה על רצח"));
                    list.add(new ItemDetail("השתיקה של הכבשים", "סיפור פסיכולוגי מותח עם חניבעל לקטר"));
                    list.add(new ItemDetail("המלאך", "מותחן ריגול על סוכן כפול ישראלי"));
                    break;
                case "ילדים":
                    list.add(new ItemDetail("מעשה בחמישה בלונים", "קלאסיקה ישראלית לקטנים"));
                    list.add(new ItemDetail("איה פלוטו", "סיפורו של כלב שרוצה חופש"));
                    list.add(new ItemDetail("דירה להשכיר", "משל על קבלת האחר"));
                    list.add(new ItemDetail("פיטר פן", "הילד שלא רצה לגדול"));
                    break;
                case "רומנים":
                    list.add(new ItemDetail("גאווה ודעה קדומה", "רומן תקופתי על גאווה, מעמד ואהבה"));
                    list.add(new ItemDetail("אנא קארנינה", "טרגדיה של אהבה ונישואין"));
                    list.add(new ItemDetail("נוטות החסד", "רומן מלחמתי אפי"));
                    list.add(new ItemDetail("האהבה בימי חול", "אהבה מורכבת באווירה נוסטלגית"));
                    break;
            }
        } else if (category.equals("אוכל")) {
            switch (subcategory) {
                case "איטלקי":
                    list.add(new ItemDetail("פיצה נפוליטנה", "פיצה דקה עם עגבניות טריות וגבינת מוצרלה"));
                    list.add(new ItemDetail("פסטה קרבונרה", "רוטב שמנת עם ביצים, גבינה ובייקון"));
                    list.add(new ItemDetail("ריזוטו", "אורז איטלקי בבישול איטי עם מרק"));
                    list.add(new ItemDetail("לזניה", "שכבות פסטה עם גבינה ורוטב עגבניות"));
                    break;
                case "אסייתי":
                    list.add(new ItemDetail("סושי", "מאכל יפני עם אורז ודג נא"));
                    list.add(new ItemDetail("פאד תאי", "אטריות מוקפצות בסגנון תאילנדי"));
                    list.add(new ItemDetail("מרק מיסו", "מרק יפני קל על בסיס סויה"));
                    list.add(new ItemDetail("אגרול", "גלילה מטוגנת ממולאת ירקות ובשר"));
                    break;
                case "קינוחים":
                    list.add(new ItemDetail("עוגת שוקולד", "הקינוח המושלם לאוהבי מתוק"));
                    list.add(new ItemDetail("טירמיסו", "קינוח איטלקי עם גבינה וקפה"));
                    list.add(new ItemDetail("קרם ברולה", "קרם עם שכבת סוכר מקורמלת"));
                    list.add(new ItemDetail("מלבי", "קינוח מזרח־תיכוני עם סירופ ורדים"));
                    break;
                case "טבעוני":
                    list.add(new ItemDetail("טופו מוקפץ", "מנת חלבון מהצומח עם ירקות"));
                    list.add(new ItemDetail("חומוס ביתי", "ממרח חומוס מתובל עם טחינה"));
                    list.add(new ItemDetail("שקשוקה טבעונית", "עגבניות עם טופו במקום ביצים"));
                    list.add(new ItemDetail("בורגר עדשים", "קציצה מהצומח עם ערך תזונתי גבוה"));
                    break;
                case "אוכל רחוב":
                    list.add(new ItemDetail("שווארמה", "מאכל רחוב פופולרי עם בשר מתובל"));
                    list.add(new ItemDetail("סביח", "פיתה עם חצילים, ביצה קשה וטחינה"));
                    list.add(new ItemDetail("פלאפל", "כדורי חומוס מטוגנים ומוגשים בפיתה"));
                    list.add(new ItemDetail("בורקס", "מאפה ממולא גבינה/תפוחי אדמה"));
                    break;
            }
        } else if (category.equals("טיולים")) {
            switch (subcategory) {
                case "אירופה":
                    list.add(new ItemDetail("פריז", "עיר האורות והרומנטיקה בצרפת"));
                    list.add(new ItemDetail("ברצלונה", "עיר חוף עם ארכיטקטורה מרהיבה"));
                    list.add(new ItemDetail("אמסטרדם", "עיר התעלות והאופניים"));
                    list.add(new ItemDetail("פראג", "עיר עתיקה עם גשרים וטירות"));
                    break;
                case "אסיה":
                    list.add(new ItemDetail("טוקיו", "עיר חדשנית ומרתקת ביפן"));
                    list.add(new ItemDetail("בנגקוק", "בירת תאילנד עם שווקים ותרבות עשירה"));
                    list.add(new ItemDetail("באלי", "אי טרופי עם חופים ומקדשים"));
                    list.add(new ItemDetail("האנוי", "בירת וייטנאם עם שווקים אותנטיים"));
                    break;
                case "אמריקה":
                    list.add(new ItemDetail("ניו יורק", "העיר שלא ישנה לעולם"));
                    list.add(new ItemDetail("לוס אנג'לס", "עיר הסרטים והחופים"));
                    list.add(new ItemDetail("מיאמי", "חופים טרופיים וחיי לילה"));
                    list.add(new ItemDetail("ריו דה ז'נרו", "חופים, קרנבל והר הסוכר"));
                    break;
                case "ישראל":
                    list.add(new ItemDetail("תל אביב", "העיר ללא הפסקה עם חיי לילה וחוף"));
                    list.add(new ItemDetail("ירושלים", "עיר הקודש עם היסטוריה עשירה"));
                    list.add(new ItemDetail("הכנרת", "אגם מים מתוקים בצפון הארץ"));
                    list.add(new ItemDetail("אילת", "עיר הנופש הדרומית של ישראל"));
                    break;
                case "אוסטרליה":
                    list.add(new ItemDetail("סידני", "עיר החופים והאופרה"));
                    list.add(new ItemDetail("מלבורן", "עיר התרבות והקפה"));
                    list.add(new ItemDetail("קיירנס", "שער לשונית המחסום הגדולה"));
                    list.add(new ItemDetail("בריסביין", "עיר צעירה עם מזג אוויר נעים"));
                    break;
            }
        } else if (category.equals("טכנולוגיה")) {
            switch (subcategory) {
                case "סמארטפונים":
                    list.add(new ItemDetail("iPhone 14", "הדגם החדש עם מצלמה משופרת"));
                    list.add(new ItemDetail("Samsung Galaxy S23", "מכשיר דגל עם ביצועים חזקים"));
                    list.add(new ItemDetail("Google Pixel 7", "סמארטפון עם אנדרואיד נקי ומצלמה AI"));
                    list.add(new ItemDetail("Xiaomi 13", "דגם משתלם עם מפרט עוצמתי"));
                    break;
                case "AI":
                    list.add(new ItemDetail("ChatGPT", "מודל שיחה מבוסס בינה מלאכותית"));
                    list.add(new ItemDetail("Midjourney", "יצירת תמונות באמצעות טקסט"));
                    list.add(new ItemDetail("GitHub Copilot", "עוזר קוד למפתחים"));
                    list.add(new ItemDetail("DALL·E", "יצירת תמונות מבוססות טקסט"));
                    break;
                case "גיימינג":
                    list.add(new ItemDetail("PlayStation 5", "קונסולת הדור הבא של סוני"));
                    list.add(new ItemDetail("Xbox Series X", "הקונסולה של מיקרוסופט עם ביצועים חזקים"));
                    list.add(new ItemDetail("Nintendo Switch", "קונסולה היברידית עם משחקים צבעוניים"));
                    list.add(new ItemDetail("Steam Deck", "קונסולת גיימינג ניידת למחשב"));
                    break;
                case "מדפסות תלת־ממד":
                    list.add(new ItemDetail("Prusa i3", "מדפסת איכותית ונגישה להדפסה ביתית"));
                    list.add(new ItemDetail("Creality Ender 3", "מדפסת תלת־ממד פופולרית"));
                    list.add(new ItemDetail("Anycubic Photon", "מדפסת שרף מדויקת"));
                    list.add(new ItemDetail("Bambu Lab X1", "מדפסת חכמה ומהירה במיוחד"));
                    break;
            }
        }

        return list;
    }
}
