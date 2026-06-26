```js
function calculateCaffeine(method, yerbaGrams, refills, tempFactor) {
  // Base caffeine content: 1.2% average (12mg per gram)
  const baseCaffeine = yerbaGrams * 12;

  // Extraction depends on method
  const extractionRate = {
    gourd: calculateGourdExtraction(refills),
    french_press: 0.65,  // 5 min steep
    tea_bag: 0.45,       // short steep, fine particles
    terere: 0.50,        // cold = less extraction
    cocido: 0.55         // single brew
  }[method];

  return baseCaffeine * extractionRate * tempFactor;
}

function calculateGourdExtraction(refills) {
  // Logarithmic extraction: each refill extracts less
  // Based on Isolabella et al. (2010) kinetic data
  let total = 0;
  for (let i = 1; i <= refills; i++) {
    total += 0.15 * Math.pow(0.85, i - 1);
  }
  return Math.min(total, 0.90); // Max 90% extraction
}
```