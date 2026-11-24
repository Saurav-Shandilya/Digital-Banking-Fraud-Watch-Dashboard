/**
 * Risk Badge Calculator (Vanilla JS)
 * Lead: Saumya Raghav (Roll No: 2415001444)
 * Calculates Low / Medium / High / Critical risk level based on numerical score.
 */

export const calculateRiskLevel = (score, thresholds) => {
  const { low, medium, high } = thresholds || { low: 25, medium: 50, high: 75 };

  if (score < low) return { level: 'Low', class: 'badge-low' };
  if (score < medium) return { level: 'Medium', class: 'badge-medium' };
  if (score < high) return { level: 'High', class: 'badge-high' };
  return { level: 'Critical', class: 'badge-critical' };
};
