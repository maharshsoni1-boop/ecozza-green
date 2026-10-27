import assert from "node:assert";

// Domain 1: Pricing and GST Calculations
function calculateGst(subtotalInr: number, state: string) {
  const isIntraState = state.trim().toLowerCase() === "gujarat";
  const taxable = Math.round((subtotalInr / 1.05) * 100) / 100;
  const gstTotal = Math.round((subtotalInr - taxable) * 100) / 100;

  if (isIntraState) {
    const half = Math.round((gstTotal / 2) * 100) / 100;
    return {
      taxable,
      gstTotal,
      cgst: half,
      sgst: half,
      igst: 0,
      isIntraState: true,
    };
  } else {
    return {
      taxable,
      gstTotal,
      cgst: 0,
      sgst: 0,
      igst: gstTotal,
      isIntraState: false,
    };
  }
}

function calculatePricePerKg(priceInr: number, weightKg: number) {
  if (weightKg <= 0) return 0;
  return Math.round(priceInr / weightKg);
}

// Domain 2: Cart Math & Shipping
function calculateCartTotals(
  items: Array<{ unitPrice: number; weightKg: number; quantity: number }>,
  freeShippingThreshold = 1499
) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalWeightKg = items.reduce((sum, item) => sum + item.weightKg * item.quantity, 0);
  const isFreeShipping = subtotal >= freeShippingThreshold;

  let shippingFee = 0;
  if (!isFreeShipping) {
    if (totalWeightKg <= 5) shippingFee = 99;
    else if (totalWeightKg <= 10) shippingFee = 149;
    else if (totalWeightKg <= 25) shippingFee = 249;
    else shippingFee = 249 + Math.ceil(totalWeightKg - 25) * 15;
  }

  const grandTotal = subtotal + shippingFee;
  return { subtotal, totalWeightKg, isFreeShipping, shippingFee, grandTotal };
}

// Domain 3: Dose Calculator & Bag Pack Optimization
function computeDosePlan(dosePerUnitGrams: number, unitCount: number) {
  const totalGrams = dosePerUnitGrams * unitCount;
  const totalKg = Math.round((totalGrams / 1000) * 10) / 10;

  let remaining = totalKg;
  let bags25 = 0;
  let bags10 = 0;
  let bags5 = 0;

  if (remaining > 0) {
    bags25 = Math.floor(remaining / 25);
    remaining %= 25;

    bags10 = Math.floor(remaining / 10);
    remaining %= 10;

    bags5 = Math.ceil(remaining / 5);
  }

  return { totalKg, bags25, bags10, bags5 };
}

// Domain 4: Order Status State Machine Transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  PLACED: ["PAID", "CANCELLED", "PACKED"],
  PAID: ["PACKED", "CANCELLED", "REFUNDED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "REFUNDED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

function canTransitionOrderStatus(currentStatus: string, nextStatus: string): boolean {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

// ==========================================
// TEST EXECUTION
// ==========================================
async function runTestSuite() {
  console.log("==================================================");
  console.log("🚀 RUNNING ECOZZA GREEN AUTOMATED TEST SUITE");
  console.log("==================================================\n");

  let passedCount = 0;

  // 1. Pricing & GST
  console.log("Test Group 1: Pricing & GST Calculation");
  {
    // Gujarat intra-state: CGST 2.5% + SGST 2.5%
    const resGj = calculateGst(1050, "Gujarat");
    assert.strictEqual(resGj.taxable, 1000, "Taxable value of 1050 with 5% GST should be 1000");
    assert.strictEqual(resGj.gstTotal, 50, "Total GST should be 50");
    assert.strictEqual(resGj.cgst, 25, "CGST should be 25");
    assert.strictEqual(resGj.sgst, 25, "SGST should be 25");
    assert.strictEqual(resGj.igst, 0, "IGST should be 0 for Gujarat intra-state");
    passedCount++;
    console.log("  ✓ Intra-state Gujarat CGST (2.5%) + SGST (2.5%) correctly computed");

    // Maharashtra inter-state: IGST 5%
    const resMh = calculateGst(1050, "Maharashtra");
    assert.strictEqual(resMh.cgst, 0, "CGST should be 0 for inter-state");
    assert.strictEqual(resMh.sgst, 0, "SGST should be 0 for inter-state");
    assert.strictEqual(resMh.igst, 50, "IGST should be 50 for inter-state");
    passedCount++;
    console.log("  ✓ Inter-state IGST (5.0%) correctly computed");

    // Price per kg
    assert.strictEqual(calculatePricePerKg(449, 5), 90, "449 / 5kg rounded should be 90/kg");
    assert.strictEqual(calculatePricePerKg(1749, 25), 70, "1749 / 25kg rounded should be 70/kg");
    passedCount++;
    console.log("  ✓ Dynamic price per kg rounded properly for bag sizes");
  }

  // 2. Cart Math
  console.log("\nTest Group 2: Cart Math & Shipping Tiers");
  {
    // Below threshold, 5kg
    const cart1 = calculateCartTotals([{ unitPrice: 449, weightKg: 5, quantity: 1 }]);
    assert.strictEqual(cart1.subtotal, 449);
    assert.strictEqual(cart1.totalWeightKg, 5);
    assert.strictEqual(cart1.isFreeShipping, false);
    assert.strictEqual(cart1.shippingFee, 99);
    assert.strictEqual(cart1.grandTotal, 548);
    passedCount++;
    console.log("  ✓ 5kg cart below threshold adds ₹99 shipping");

    // Above threshold (> ₹1499)
    const cart2 = calculateCartTotals([
      { unitPrice: 449, weightKg: 5, quantity: 1 },
      { unitPrice: 1749, weightKg: 25, quantity: 1 },
    ]);
    assert.strictEqual(cart2.subtotal, 2198);
    assert.strictEqual(cart2.totalWeightKg, 30);
    assert.strictEqual(cart2.isFreeShipping, true);
    assert.strictEqual(cart2.shippingFee, 0);
    assert.strictEqual(cart2.grandTotal, 2198);
    passedCount++;
    console.log("  ✓ Cart exceeding ₹1499 qualifies for free delivery");
  }

  // 3. Dose Calculator
  console.log("\nTest Group 3: Dose Calculator Formula & Optimal Bag Config");
  {
    // 10 pots @ 100g = 1000g = 1 kg -> one 5kg bag
    const dose1 = computeDosePlan(100, 10);
    assert.strictEqual(dose1.totalKg, 1);
    assert.strictEqual(dose1.bags5, 1);
    assert.strictEqual(dose1.bags10, 0);
    assert.strictEqual(dose1.bags25, 0);
    passedCount++;
    console.log("  ✓ 10 small pots yields 1kg requirement mapped to 1x 5kg bag");

    // 50 fruit trees @ 1500g = 75000g = 75 kg -> three 25kg bags
    const dose2 = computeDosePlan(1500, 50);
    assert.strictEqual(dose2.totalKg, 75);
    assert.strictEqual(dose2.bags25, 3);
    assert.strictEqual(dose2.bags10, 0);
    assert.strictEqual(dose2.bags5, 0);
    passedCount++;
    console.log("  ✓ 50 mature trees (75 kg) optimized into 3x 25kg bags");

    // 35 kg requirement -> one 25kg bag + one 10kg bag
    const dose3 = computeDosePlan(3500, 10);
    assert.strictEqual(dose3.totalKg, 35);
    assert.strictEqual(dose3.bags25, 1);
    assert.strictEqual(dose3.bags10, 1);
    assert.strictEqual(dose3.bags5, 0);
    passedCount++;
    console.log("  ✓ 35 kg requirement seamlessly distributed into 1x 25kg + 1x 10kg bag");
  }

  // 4. Order Status State Machine
  console.log("\nTest Group 4: Order Status Transitions State Machine");
  {
    // Valid transitions
    assert.strictEqual(canTransitionOrderStatus("PLACED", "PAID"), true);
    assert.strictEqual(canTransitionOrderStatus("PAID", "PACKED"), true);
    assert.strictEqual(canTransitionOrderStatus("PACKED", "SHIPPED"), true);
    assert.strictEqual(canTransitionOrderStatus("SHIPPED", "DELIVERED"), true);
    passedCount++;
    console.log("  ✓ Happy path PLACED -> PAID -> PACKED -> SHIPPED -> DELIVERED verified");

    // Invalid transitions
    assert.strictEqual(canTransitionOrderStatus("DELIVERED", "PLACED"), false);
    assert.strictEqual(canTransitionOrderStatus("CANCELLED", "SHIPPED"), false);
    assert.strictEqual(canTransitionOrderStatus("PLACED", "DELIVERED"), false);
    passedCount++;
    console.log("  ✓ Invalid backwards/skipping transitions correctly disallowed");
  }

  console.log("\n==================================================");
  console.log(`✅ ALL ${passedCount} TEST SUITE ASSERTIONS PASSED SUCCESSFULLY!`);
  console.log("==================================================");
}

runTestSuite().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
