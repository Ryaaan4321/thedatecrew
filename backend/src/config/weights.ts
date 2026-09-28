export interface PreferenceWeights {
  age: number;
  location: number;
  religion: number;
  education: number;
  occupation: number;
  lifestyleDrinking: number;
  lifestyleDiet: number;
  lifestyleChildren: number;
  lifestylePets: number;
}

export const DEFAULT_PREFERENCE_WEIGHTS: PreferenceWeights = {
  age: 20,
  location: 25,
  religion: 10,
  education: 10,
  occupation: 10,
  lifestyleChildren: 10,
  lifestyleDrinking: 5,
  lifestyleDiet: 5,
  lifestylePets: 5,
};

export const HOLD_WINDOW = 8;

export const PATTERN_RISK_BASE_PENALTY = 15;
