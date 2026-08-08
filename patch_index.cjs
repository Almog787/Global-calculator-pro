const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Add preload for fonts
const preload = `    <!-- Preload Fonts -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;700;900&family=Public+Sans:wght@400;500;600;700&display=swap" as="style" />
    <link rel="preload" href="https://fonts.gstatic.com" crossorigin />`;

code = code.replace(/    <!-- Google Fonts & Icons -->/, preload + '\n    <!-- Google Fonts & Icons -->');

fs.writeFileSync('index.html', code);
