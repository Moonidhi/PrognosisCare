// Simulated latency helper for all fake API calls.
const wait = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchAiRecommendations() {
  await wait(800);
  return {
    summary:
      'Based on your symptoms (chest pain, high BP), additional diagnostic tests are recommended to rule out cardiovascular risk.',
    tests: [
      {
        id: 'test-ecg',
        name: 'ECG',
        reason: 'Assess electrical heart activity and identify ischemic changes.',
        priority: 'high',
        cost: 1200,
      },
      {
        id: 'test-cbc',
        name: 'Blood Test (CBC)',
        reason: 'Detect inflammation, infection, or blood health abnormalities.',
        priority: 'medium',
        cost: 750,
      },
      {
        id: 'test-lipid',
        name: 'Lipid Profile',
        reason: 'Evaluate cholesterol risk factors linked to cardiac disease.',
        priority: 'high',
        cost: 1400,
      },
    ],
  };
}

export async function createBooking(bookingPayload) {
  await wait(1100);
  return {
    ...bookingPayload,
    bookingId: `BK-${Date.now().toString().slice(-8)}`,
    status: 'scheduled',
  };
}

export async function processMockPayment(paymentPayload) {
  await wait(1500);

  // Simulate occasional gateway failure for retry UX.
  const failed = Math.random() < 0.2;
  if (failed) {
    return {
      ok: false,
      error: 'Payment authorization failed. Please retry with another method.',
    };
  }

  return {
    ok: true,
    paymentId: `PAY-${Date.now().toString().slice(-9)}`,
    invoiceId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
    paidAt: new Date().toISOString(),
    ...paymentPayload,
  };
}

export async function uploadReportMock({ bookingId, fileName }) {
  await wait(1200);
  return {
    bookingId,
    fileName,
    reportId: `REP-${Date.now().toString().slice(-8)}`,
    uploadedAt: new Date().toISOString(),
    status: 'Available',
  };
}
