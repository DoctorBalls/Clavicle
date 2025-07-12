// src/data/norms.ts
export type Gender = 'male' | 'female';
export type Region = 'Western Europe' | 'America' | 'Asia';

export interface Norm { mean: number; sd: number; }

// Regional multipliers from literature:
export const regionFactors: Record<Region, number> = {
  'Western Europe': 1.0,
  America:         1.005,
  Asia:            0.98,
};

// Helper to generate age-based norms by linear segments:
function generateNorms(
  base: number,
  slope1: number,
  split1: number,    // first segment end age
  slope2: number,
  split2: number,    // second segment end age
  plateau: number,
): Record<number, Norm> {
  const out: Record<number, Norm> = {};
  for (let age = 12; age <= 30; age++) {
    let mean: number;
    if (age <= split1) {
      mean = base + slope1 * (age - 12);
    } else if (age <= split2) {
      mean = base + slope1 * (split1 - 12) + slope2 * (age - split1);
    } else {
      mean = plateau;
    }
    out[age] = { mean, sd: 5 };  // using SD = 5 mm as a generic reference
  }
  return out;
}

export const norms: Record<Gender, Record<number, Norm>> = {
  male: generateNorms(/* base= */129, /* slope1= */1.75, /* split1= */16,
                      /* slope2= */2.0,  /* split2= */20, /* plateau= */144),
  female: generateNorms(117, 3.0, 16, 1.5, 20, 135),
};
