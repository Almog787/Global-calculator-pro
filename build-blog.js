const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const outputFile = path.join(__dirname, 'posts.json');

// אם אין עדיין תיקיית מאמרים, הסקריפט לא יקרוס
if (!fs.existsSync(articlesDir)) {
    console.log("No articles directory found. Creating empty posts.json");
    fs.writeFileSync(outputFile, JSON.stringify([]));
    process.exit(0);
}

// קריאת כל קובצי ה-HTML בתיקייה
const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.html'));
const posts =[];

files.forEach(file => {
    const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
    
    // שליפת הנתונים מהקובץ באמצעות ביטויים רגולריים (Regex)
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const descMatch = content.match(/<meta name="description" content="(.*?)">/i);
    const dateMatch = content.match(/<meta name="article:published_time" content="(.*?)">/i);
    const tagMatch = content.match(/<meta name="article:tag" content="(.*?)">/i);
    const iconMatch = content.match(/<meta name="article:icon" content="(.*?)">/i);

    // ניקוי הכותרת (הסרת שם האתר מהכותרת שתופיע בכרטיסייה)
    let cleanTitle = titleMatch ? titleMatch[1].replace(' | Global Calc Hub', '') : 'Untitled Article';

    posts.push({
        url: `/articles/${file}`,
        title: cleanTitle,
        description: descMatch ? descMatch[1] : 'No description provided.',
        date: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0],
        tag: tagMatch ? tagMatch[1] : 'Article',
        icon: iconMatch ? iconMatch[1] : 'article'
    });
});

// מיון המאמרים מהחדש לישן
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// שמירת הנתונים לקובץ posts.json
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`Successfully generated posts.json with ${posts.length} articles.`);
