import fs from 'fs';
import path from 'path';

const ruWidgets = {
  mortgage: {
    name: 'Ипотечный калькулятор',
    desc: 'Расчет ежемесячных платежей по ипотеке, переплаты по процентам и сравнение графиков.'
  },
  compound: {
    name: 'Калькулятор сложных процентов',
    desc: 'Расчет прироста инвестиционного капитала, ежемесячных довложений и финансовой цели.'
  },
  salary: {
    name: 'Калькулятор зарплаты Gross / Net',
    desc: 'Расчет чистого дохода из оклада с учетом подоходного налога и социальных взносов.'
  },
  bmi: {
    name: 'Калькулятор индекса массы тела (ИМТ)',
    desc: 'Оценка индекса массы тела, диапазона здорового веса и рекомендации ВОЗ.'
  },
  percentage: {
    name: 'Калькулятор процентов и скидок',
    desc: 'Быстрый расчет скидок на распродаже, процентного изменения и наценки.'
  },
  unit: {
    name: 'Универсальный конвертер величин',
    desc: 'Мгновенный перевод единиц длины, веса, объема, температуры и площади.'
  },
  tip: {
    name: 'Калькулятор чаевых и деления счета',
    desc: 'Разделение счета в ресторане и расчет справедливых чаевых на человека.'
  },
  age: {
    name: 'Калькулятор точного возраста',
    desc: 'Расчет возраста в годах, месяцах, днях, часах и таймер до дня рождения.'
  },
  'z-score': {
    name: 'Калькулятор Z-оценки и распределения Гаусса',
    desc: 'Статистический расчет Z-оценки, p-value, перцентилей и интерактивная колоколообразная кривая.'
  },
  'linear-regression': {
    name: 'Калькулятор линейной регрессии',
    desc: 'Построение линии тренда, вычисление коэффициента корреляции Пирсона r и R².'
  },
  quadratic: {
    name: 'Решение квадратных уравнений',
    desc: 'Пошаговый расчет корней через дискриминант D с интерактивным графиком параболы.'
  },
  'linear-system': {
    name: 'Решение систем уравнений 2x2',
    desc: 'Решение системы из 2 уравнений методом Крамера, матричным способом и графиком.'
  },
  'base-converter': {
    name: 'Конвертер систем счисления',
    desc: 'Перевод чисел между двоичной (BIN), восьмеричной (OCT), десятичной (DEC) и 16-ричной (HEX).'
  },
  bitwise: {
    name: 'Побитовый калькулятор',
    desc: 'Побитовые логические операции AND, OR, XOR, NOT и битовые сдвиги с наглядным представлением.'
  },
  triangle: {
    name: 'Калькулятор треугольника',
    desc: 'Расчет всех сторон, углов, высот, площади и периметра по теореме синусов и косинусов.'
  },
  'circle-sector': {
    name: 'Калькулятор сектора круга и дуги',
    desc: 'Расчет площади сектора, длины дуги, хорды и сегмента по радиусу и центральному углу.'
  },
  matrix: {
    name: 'Матричный калькулятор онлайн',
    desc: 'Операции с матрицами: умножение, определитель, обратная матрица, ранг и транспонирование.'
  },
  'complex-numbers': {
    name: 'Калькулятор комплексных чисел',
    desc: 'Арифметика комплексных чисел, алгебраическая, тригонометрическая формы и плоскость Гаусса.'
  }
};

const filePath = path.resolve('src/lib/widgets/widgetsConfig.ts');
let content = fs.readFileSync(filePath, 'utf8');

for (const [id, data] of Object.entries(ruWidgets)) {
  // Find widget block
  const nameRegex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?name:\\s*{[\\s\\S]*?ar:\\s*['"][^'"]*['"]\\s*)(},)`, 'm');
  if (content.match(nameRegex) && !content.match(new RegExp(`id:\\s*['"]${id}['"][\\s\\S]*?name:\\s*{[\\s\\S]*?ru:`, 'm'))) {
    content = content.replace(nameRegex, `$1,\n      ru: '${data.name}'\n    $2`);
  }

  const descRegex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?description:\\s*{[\\s\\S]*?ar:\\s*['"][^'"]*['"]\\s*)(},)`, 'm');
  if (content.match(descRegex) && !content.match(new RegExp(`id:\\s*['"]${id}['"][\\s\\S]*?description:\\s*{[\\s\\S]*?ru:`, 'm'))) {
    content = content.replace(descRegex, `$1,\n      ru: '${data.desc}'\n    $2`);
  }
}

// Update poweredByText
content = content.replace(
  /const poweredByText = uiLang === 'he' \? 'מופעל ע״י' : uiLang === 'es' \? 'Desarrollado por' : uiLang === 'fr' \? 'Propulsé par' : uiLang === 'ar' \? 'مشغل بواسطة' : 'Powered by';/g,
  "const poweredByText = uiLang === 'he' ? 'מופעל ע״י' : uiLang === 'es' ? 'Desarrollado por' : uiLang === 'fr' ? 'Propulsé par' : uiLang === 'ar' ? 'مشغل بواسطة' : uiLang === 'ru' ? 'Работает на' : 'Powered by';"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated src/lib/widgets/widgetsConfig.ts');
