import {
  DEFAULT_PREFERENCE_WEIGHTS,
  HOLD_WINDOW,
  PATTERN_RISK_BASE_PENALTY,
  PreferenceWeights,
} from "../config/weights.js";
import {
  Candidate,
  Client,
  DimensionBreakdown,
  PatternRiskResult,
  ScoreResult,
} from "../types/index.js";

export function evaluateHardFilter(
  client: Client,
  candidate: Candidate
): { passed: boolean; violations: string[] } {
  const violations: string[] = [];
  const attrs = candidate.attributes;
  const lifestyle = attrs.lifestyle;

  for (const dealbreaker of client.dealbreakers) {
    const db = dealbreaker.toLowerCase().trim();

    if (db === "smoking" || db === "no_smoking") {
      if (lifestyle.smoking !== "never") {
        violations.push(
          `Smoking dealbreaker: Candidate is a ${lifestyle.smoking} smoker (client strictly requires non-smoker).`
        );
      }
    } else if (db === "wants_no_children" || db === "must_want_children") {
      if (lifestyle.wantsChildren === "wants_no_children") {
        violations.push(
          "Family dealbreaker: Candidate does not want children (client requires a partner wanting children)."
        );
      }
    } else if (db === "must_be_childfree" || db === "childfree_only") {
      if (lifestyle.wantsChildren === "wants_children") {
        violations.push(
          "Childfree dealbreaker: Candidate wants children (client is strictly childfree)."
        );
      }
    } else if (db === "long_distance" || db === "local_only") {
      const isLocal = client.preferences.location.some(
        (loc) =>
          loc.toLowerCase() === attrs.location.toLowerCase() ||
          attrs.location.toLowerCase().includes(loc.toLowerCase())
      );
      if (!isLocal) {
        violations.push(
          `Location dealbreaker: Candidate is based in ${attrs.location} (client strictly requires ${client.preferences.location.join(", ")}).`
        );
      }
    } else if (db === "pets_cats" || db === "no_cats") {
      if (lifestyle.pets?.toLowerCase().includes("cat")) {
        violations.push(
          "Pet allergy dealbreaker: Candidate has a cat (client has severe allergy / no-cats dealbreaker)."
        );
      }
    } else if (db === "pets_dogs" || db === "no_dogs") {
      if (lifestyle.pets?.toLowerCase().includes("dog")) {
        violations.push(
          "Pet restriction: Candidate has dogs (client specified no dogs)."
        );
      }
    } else if (db === "heavy_drinking" || db === "no_drinking") {
      if (lifestyle.drinking === "frequently") {
        violations.push(
          "Drinking dealbreaker: Candidate drinks frequently (client requires moderate or non-drinker)."
        );
      }
    } else if (db === "different_religion" || db === "same_religion_only") {
      if (
        client.preferences.religion &&
        client.preferences.religion.length > 0 &&
        !client.preferences.religion.some(
          (r) => r.toLowerCase() === attrs.religion.toLowerCase()
        )
      ) {
        violations.push(
          `Religion dealbreaker: Candidate is ${attrs.religion} (client requires ${client.preferences.religion.join(", ")}).`
        );
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

export function computePreferenceScore(
  client: Client,
  candidate: Candidate,
  weights: PreferenceWeights = DEFAULT_PREFERENCE_WEIGHTS
): { score: number; breakdown: DimensionBreakdown[] } {
  const breakdown: DimensionBreakdown[] = [];
  const attrs = candidate.attributes;
  const prefs = client.preferences;

  const [minAge, maxAge] = prefs.ageRange;
  let ageScore = 0;
  let ageDetail = "";
  if (attrs.age >= minAge && attrs.age <= maxAge) {
    ageScore = 1.0;
    ageDetail = `${attrs.age}y within preferred range (${minAge}-${maxAge})`;
  } else {
    const diff = attrs.age < minAge ? minAge - attrs.age : attrs.age - maxAge;
    if (diff <= 2) {
      ageScore = 0.7;
      ageDetail = `${attrs.age}y is within 2 years of range (${minAge}-${maxAge})`;
    } else if (diff <= 4) {
      ageScore = 0.4;
      ageDetail = `${attrs.age}y is slightly outside range by ${diff} years`;
    } else {
      ageScore = 0.0;
      ageDetail = `${attrs.age}y is well outside preferred range (${minAge}-${maxAge})`;
    }
  }
  breakdown.push({
    label: "Age",
    weight: weights.age,
    score: ageScore,
    detail: ageDetail,
  });

  const locationMatch = prefs.location.some(
    (loc) =>
      loc.toLowerCase() === attrs.location.toLowerCase() ||
      attrs.location.toLowerCase().includes(loc.toLowerCase())
  );
  const locationScore = locationMatch ? 1.0 : 0.4;
  breakdown.push({
    label: "Location",
    weight: weights.location,
    score: locationScore,
    detail: locationMatch
      ? `Exact match (${attrs.location})`
      : `Different metro (${attrs.location} vs preferred ${prefs.location.join(", ")})`,
  });

  let religionScore = 1.0;
  let religionDetail = "Open / No strict requirement";
  if (prefs.religion && prefs.religion.length > 0) {
    const matchesReligion = prefs.religion.some(
      (r) => r.toLowerCase() === attrs.religion.toLowerCase()
    );
    religionScore = matchesReligion ? 1.0 : 0.2;
    religionDetail = matchesReligion
      ? `Matches ${attrs.religion}`
      : `${attrs.religion} (client prefers ${prefs.religion.join(", ")})`;
  }
  breakdown.push({
    label: "Religion",
    weight: weights.religion,
    score: religionScore,
    detail: religionDetail,
  });

  let educationScore = 1.0;
  let educationDetail = attrs.education;
  if (prefs.education && prefs.education.length > 0) {
    const matchesEdu = prefs.education.some(
      (e) => e.toLowerCase() === attrs.education.toLowerCase()
    );
    educationScore = matchesEdu ? 1.0 : 0.6;
    educationDetail = matchesEdu
      ? `Matches ${attrs.education}`
      : `${attrs.education} vs preferred ${prefs.education.join(", ")}`;
  }
  breakdown.push({
    label: "Education",
    weight: weights.education,
    score: educationScore,
    detail: educationDetail,
  });

  let occupationScore = 1.0;
  let occupationDetail = attrs.occupation;
  if (prefs.occupation && prefs.occupation.length > 0) {
    const matchesOcc = prefs.occupation.some(
      (o) =>
        attrs.occupation.toLowerCase().includes(o.toLowerCase()) ||
        o.toLowerCase().includes(attrs.occupation.toLowerCase())
    );
    occupationScore = matchesOcc ? 1.0 : 0.65;
    occupationDetail = matchesOcc
      ? `Aligned field (${attrs.occupation})`
      : `${attrs.occupation} (client prefers ${prefs.occupation.join(", ")})`;
  }
  breakdown.push({
    label: "Occupation",
    weight: weights.occupation,
    score: occupationScore,
    detail: occupationDetail,
  });

  let childrenScore = 1.0;
  let childrenDetail = `Wants children: ${attrs.lifestyle.wantsChildren}`;
  if (prefs.lifestyle.wantsChildren) {
    const cPref = prefs.lifestyle.wantsChildren;
    const cAttr = attrs.lifestyle.wantsChildren;
    if (cPref === cAttr) {
      childrenScore = 1.0;
      childrenDetail = `Direct alignment (${cAttr})`;
    } else if (cAttr === "open" || cPref === "open") {
      childrenScore = 0.75;
      childrenDetail = `Open to discussion (${cAttr} vs ${cPref})`;
    } else {
      childrenScore = 0.0;
      childrenDetail = `Opposite preferences (${cAttr} vs ${cPref})`;
    }
  }
  breakdown.push({
    label: "Family / Kids",
    weight: weights.lifestyleChildren,
    score: childrenScore,
    detail: childrenDetail,
  });

  let drinkScore = 1.0;
  let drinkDetail = `Drinks: ${attrs.lifestyle.drinking}`;
  if (prefs.lifestyle.drinking) {
    if (prefs.lifestyle.drinking === attrs.lifestyle.drinking) {
      drinkScore = 1.0;
      drinkDetail = `Matches ${attrs.lifestyle.drinking}`;
    } else if (
      attrs.lifestyle.drinking === "socially" &&
      prefs.lifestyle.drinking === "never"
    ) {
      drinkScore = 0.5;
      drinkDetail = `Social drinker (client prefers non-drinker)`;
    } else if (attrs.lifestyle.drinking === "frequently") {
      drinkScore = 0.2;
      drinkDetail = `Frequent drinker`;
    }
  }
  breakdown.push({
    label: "Drinking",
    weight: weights.lifestyleDrinking,
    score: drinkScore,
    detail: drinkDetail,
  });

  let dietScore = 1.0;
  let dietDetail = `Diet: ${attrs.lifestyle.diet}`;
  if (prefs.lifestyle.diet && prefs.lifestyle.diet !== "any") {
    if (prefs.lifestyle.diet.toLowerCase() === attrs.lifestyle.diet.toLowerCase()) {
      dietScore = 1.0;
      dietDetail = `Matches ${attrs.lifestyle.diet}`;
    } else {
      dietScore = 0.6;
      dietDetail = `${attrs.lifestyle.diet} (client: ${prefs.lifestyle.diet})`;
    }
  }
  breakdown.push({
    label: "Diet",
    weight: weights.lifestyleDiet,
    score: dietScore,
    detail: dietDetail,
  });

  let petScore = 1.0;
  let petDetail = `Pets: ${attrs.lifestyle.pets || "None"}`;
  if (prefs.lifestyle.pets) {
    if (prefs.lifestyle.pets === "dog_friendly" && attrs.lifestyle.pets.includes("dog")) {
      petScore = 1.0;
      petDetail = "Has dogs (client loves dogs)";
    }
  }
  breakdown.push({
    label: "Pets",
    weight: weights.lifestylePets,
    score: petScore,
    detail: petDetail,
  });

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const weightedSum = breakdown.reduce(
    (sum, item) => sum + item.score * item.weight,
    0
  );

  const rawScore = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
  return {
    score: Math.round(rawScore),
    breakdown,
  };
}

export function evaluatePatternRisk(
  client: Client,
  candidate: Candidate
): PatternRiskResult {
  const tagCounts: Record<string, number> = {};
  for (const record of client.pastRejections) {
    for (const tag of record.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  const attrs = candidate.attributes;
  const flaggedTags: string[] = [];
  const reasons: string[] = [];

  if ((tagCounts["pace_mismatch"] || 0) >= 2) {
    if (attrs.lifestyle.relationshipPace === "fast") {
      flaggedTags.push("pace_mismatch");
      reasons.push(
        `Client has ${tagCounts["pace_mismatch"]} past rejections for rapid pacing; candidate profile indicates a high-intensity/fast relationship pace.`
      );
    }
  }

  if ((tagCounts["career_ambition_gap"] || 0) >= 2) {
    if (attrs.lifestyle.careerAmbition === "relaxed") {
      flaggedTags.push("career_ambition_gap");
      reasons.push(
        `Client repeatedly rejected matches with low professional drive (${tagCounts["career_ambition_gap"]} times); candidate notes reflect a relaxed, low-urgency career phase.`
      );
    }
  }

  if ((tagCounts["communication_style"] || 0) >= 2) {
    if (attrs.lifestyle.communicationStyle === "intense") {
      flaggedTags.push("communication_style");
      reasons.push(
        `Client has had ${tagCounts["communication_style"]} past drop-offs due to abrasive/intense communication; candidate is noted as very forceful/intense.`
      );
    }
  }

  if ((tagCounts["values_mismatch"] || 0) >= 2) {
    if (
      attrs.personalityNotes &&
      /contrarian|hyper-traditional|dogmatic/i.test(attrs.personalityNotes)
    ) {
      flaggedTags.push("values_mismatch");
      reasons.push(
        `Client has ${tagCounts["values_mismatch"]} past values mismatches; candidate profile highlights strong contrarian ideological stances.`
      );
    }
  }

  const flagged = flaggedTags.length > 0;
  const penalty = flagged ? PATTERN_RISK_BASE_PENALTY : 0;

  return {
    flagged,
    matchedTags: flaggedTags,
    note: flagged
      ? reasons.join(" ")
      : "No repeated historical rejection patterns detected for this candidate.",
    penalty,
  };
}

export function scoreCandidateForClient(
  client: Client,
  candidate: Candidate,
  thresholdK: number,
  weights: PreferenceWeights = DEFAULT_PREFERENCE_WEIGHTS
): ScoreResult {
  const hardFilter = evaluateHardFilter(client, candidate);

  if (!hardFilter.passed) {
    return {
      candidateId: candidate.id,
      candidateName: candidate.name,
      clientId: client.id,
      clientName: client.name,
      hardFilterPassed: false,
      failedDealbreakers: hardFilter.violations,
      preferenceScore: 0,
      patternRisk: {
        flagged: false,
        matchedTags: [],
        note: "Not evaluated due to hard dealbreaker failure.",
      },
      penaltyApplied: 0,
      finalScore: 0,
      thresholdK,
      recommendation: "reject",
      explanation: `HARD PASS/FAIL: Excluded automatically. Violated ${hardFilter.violations.length} stated client dealbreaker(s): ${hardFilter.violations.join(" ")}`,
      breakdown: [],
      candidate,
    };
  }

  const { score: preferenceScore, breakdown } = computePreferenceScore(
    client,
    candidate,
    weights
  );

  const patternRisk = evaluatePatternRisk(client, candidate);

  const finalScore = Math.max(0, preferenceScore - patternRisk.penalty);

  let recommendation: "send" | "hold" | "reject";
  if (finalScore >= thresholdK) {
    recommendation = "send";
  } else if (finalScore >= thresholdK - HOLD_WINDOW) {
    recommendation = "hold";
  } else {
    recommendation = "reject";
  }

  let explanation = "";
  if (recommendation === "send") {
    if (patternRisk.flagged) {
      explanation = `${finalScore}/100 (Passes threshold ${thresholdK}) — Strong baseline match (${preferenceScore}/100), but flagged for caution: ${patternRisk.note}`;
    } else {
      explanation = `${finalScore}/100 (Passes threshold ${thresholdK}) — High alignment across age, location, and lifestyle with zero historical pattern risks. Recommended to send.`;
    }
  } else if (recommendation === "hold") {
    if (patternRisk.flagged) {
      explanation = `${finalScore}/100 (Hold — near threshold ${thresholdK}) — Preference match was ${preferenceScore}/100, but penalized (-${patternRisk.penalty} pts) due to repeat historical pattern: ${patternRisk.note}`;
    } else {
      explanation = `${finalScore}/100 (Hold — near threshold ${thresholdK}) — Borderline candidate. Moderate preference alignment; review detailed lifestyle breakdown before deciding.`;
    }
  } else {
    if (patternRisk.flagged) {
      explanation = `${finalScore}/100 (Reject — below threshold ${thresholdK}) — Sub-par preference match (${preferenceScore}/100) compounded by a repeat rejection pattern: ${patternRisk.note}`;
    } else {
      explanation = `${finalScore}/100 (Reject — below threshold ${thresholdK}) — Low overall alignment with client's stated core preferences.`;
    }
  }

  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    clientId: client.id,
    clientName: client.name,
    hardFilterPassed: true,
    failedDealbreakers: [],
    preferenceScore,
    patternRisk: {
      flagged: patternRisk.flagged,
      matchedTags: patternRisk.matchedTags,
      note: patternRisk.note,
    },
    penaltyApplied: patternRisk.penalty,
    finalScore,
    thresholdK,
    recommendation,
    explanation,
    breakdown,
    candidate,
  };
}
