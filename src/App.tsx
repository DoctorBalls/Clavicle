import { useState } from 'react';
import { norms, regionFactors } from './data/norms';
import type { Gender, Region } from './data/norms';

import narrowSVG from './assets/narrow-clavicles.png';
import shortSVG  from './assets/normal-clavicles.png';
import longSVG   from './assets/wide-clavicles.png';

type Category = 'narrow' | 'short' | 'long';

export default function App() {
  const [age, setAge]       = useState(20);
  const [gender, setGender] = useState<Gender>('male');
  const [region, setRegion] = useState<Region>('Western Europe');
  const [result, setResult] = useState<{ length: number; category: Category } | null>(null);

  const calculate = () => {
    const norm    = norms[gender][age];
    const factor  = regionFactors[region];
    const length  = norm.mean * factor;
    let category: Category = 'short';

    if (length < norm.mean - norm.sd) category = 'narrow';
    else if (length > norm.mean + norm.sd) category = 'long';

    setResult({ length, category });
  };

  const shoulderMap: Record<Category, string> = {
    narrow: narrowSVG,
    short:  shortSVG,
    long:   longSVG,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-center text-3xl font-bold mb-6">Clavicle Length Calculator</h1>

        <div className="space-y-4">
          <label className="block">
            <span>Age (12–30)</span>
            <input
              type="number" min={12} max={30}
              value={age}
              onChange={e => setAge(+e.target.value)}
              className="mt-1 block w-full rounded border-gray-300"
            />
          </label>

          <label className="block">
            <span>Gender</span>
            <select
              value={gender}
              onChange={e => setGender(e.target.value as Gender)}
              className="mt-1 block w-full rounded border-gray-300"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label className="block">
            <span>Region</span>
            <select
              value={region}
              onChange={e => setRegion(e.target.value as Region)}
              className="mt-1 block w-full rounded border-gray-300"
            >
              <option>Western Europe</option>
              <option>America</option>
              <option>Asia</option>
            </select>
          </label>

          <button
            onClick={calculate}
            className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="mt-6 text-center">
            <p className="text-xl">
              Estimated clavicle length: <strong>{result.length.toFixed(1)} mm</strong><br/>
              Category: <strong className="capitalize">{result.category}</strong>
            </p>
            <img
              src={shoulderMap[result.category]}
              alt={result.category}
              className="mx-auto mt-4 w-48"
            />
          </div>
        )}
      </div>
    </div>
  );
}
