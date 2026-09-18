export interface BmiResult {
  bmi: number;
  status: 'underweight' | 'normal' | 'overweight' | 'obese';
  color: string;
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return { bmi: 0, status: 'normal', color: 'gray' };
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let status: BmiResult['status'] = 'normal';
  let color = 'gray';

  if (bmi < 18.5) {
    status = 'underweight';
    color = 'blue';
  } else if (bmi < 25) {
    status = 'normal';
    color = 'green';
  } else if (bmi < 30) {
    status = 'overweight';
    color = 'yellow';
  } else {
    status = 'obese';
    color = 'red';
  }

  return { bmi: Number(bmi.toFixed(1)), status, color };
}

export interface BmrResult {
  bmr: number;
  tdee: {
    sedentary: number;
    light: number;
    moderate: number;
    active: number;
    veryActive: number;
  };
}

export function calculateBmr(
  weightKg: number, 
  heightCm: number, 
  age: number, 
  gender: 'male' | 'female',
  equation: 'mifflin' | 'harris' = 'mifflin'
): BmrResult {
  if (!weightKg || !heightCm || !age || weightKg <= 0 || heightCm <= 0 || age <= 0) {
    return {
      bmr: 0,
      tdee: { sedentary: 0, light: 0, moderate: 0, active: 0, veryActive: 0 }
    };
  }

  let bmr = 0;

  if (equation === 'mifflin') {
    // Mifflin-St Jeor
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr += gender === 'male' ? 5 : -161;
  } else {
    // Harris-Benedict (Revised)
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
    }
  }

  return {
    bmr: Math.round(bmr),
    tdee: {
      sedentary: Math.round(bmr * 1.2),
      light: Math.round(bmr * 1.375),
      moderate: Math.round(bmr * 1.55),
      active: Math.round(bmr * 1.725),
      veryActive: Math.round(bmr * 1.9)
    }
  };
}
