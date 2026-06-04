export type SimulationScenarioId =
  | "successful_call"
  | "failed_call"
  | "disconnected_call"
  | "wrong_customer"
  | "already_paid"
  | "callback_requested"
  | "abusive_user"
  | "multilingual_switching"
  | "payment_commitment";

export type SimulationOutcome =
  | "success"
  | "failed"
  | "disconnected"
  | "wrong_customer"
  | "already_paid"
  | "callback_requested"
  | "abusive_user"
  | "payment_commitment";

export type SimulationScenario = {
  id: SimulationScenarioId;
  title: string;
  expectedOutcome: SimulationOutcome;
  languagePath: string[];
  customerVerified: boolean;
  alreadyPaid: boolean;
  abusive: boolean;
  paymentCommitment?: {
    amount: number;
    promisedFor: string;
  };
  callbackRequested?: {
    requestedFor: string;
  };
  transcript: Array<{
    speaker: "agent" | "customer" | "system";
    language: string;
    text: string;
    sentiment: "positive" | "neutral" | "concerned" | "angry";
  }>;
};

export const simulationScenarios: Record<SimulationScenarioId, SimulationScenario> = {
  successful_call: {
    id: "successful_call",
    title: "Successful EMI reminder",
    expectedOutcome: "success",
    languagePath: ["en"],
    customerVerified: true,
    alreadyPaid: false,
    abusive: false,
    transcript: [
      { speaker: "agent", language: "en", text: "Hello, I am calling about your pending EMI.", sentiment: "neutral" },
      { speaker: "customer", language: "en", text: "Yes, I can discuss it now.", sentiment: "neutral" },
      { speaker: "agent", language: "en", text: "Your EMI is due. Would you like a payment link?", sentiment: "positive" }
    ]
  },
  failed_call: {
    id: "failed_call",
    title: "Provider failed to initiate call",
    expectedOutcome: "failed",
    languagePath: ["en"],
    customerVerified: false,
    alreadyPaid: false,
    abusive: false,
    transcript: [{ speaker: "system", language: "en", text: "Provider returned temporary failure.", sentiment: "neutral" }]
  },
  disconnected_call: {
    id: "disconnected_call",
    title: "Customer disconnected mid-call",
    expectedOutcome: "disconnected",
    languagePath: ["hi"],
    customerVerified: true,
    alreadyPaid: false,
    abusive: false,
    transcript: [
      { speaker: "agent", language: "hi", text: "Namaste, main aapke EMI ke baare mein call kar raha hoon.", sentiment: "neutral" },
      { speaker: "customer", language: "hi", text: "Network issue hai, baad mein call karo.", sentiment: "concerned" },
      { speaker: "system", language: "en", text: "Call disconnected by remote party.", sentiment: "neutral" }
    ]
  },
  wrong_customer: {
    id: "wrong_customer",
    title: "Wrong customer reached",
    expectedOutcome: "wrong_customer",
    languagePath: ["en"],
    customerVerified: false,
    alreadyPaid: false,
    abusive: false,
    transcript: [
      { speaker: "agent", language: "en", text: "May I confirm your name before discussing details?", sentiment: "neutral" },
      { speaker: "customer", language: "en", text: "You have the wrong number.", sentiment: "neutral" },
      { speaker: "agent", language: "en", text: "I will not disclose any account details and will mark this number for review.", sentiment: "neutral" }
    ]
  },
  already_paid: {
    id: "already_paid",
    title: "Customer claims already paid",
    expectedOutcome: "already_paid",
    languagePath: ["en"],
    customerVerified: true,
    alreadyPaid: true,
    abusive: false,
    transcript: [
      { speaker: "agent", language: "en", text: "Your EMI appears overdue in our system.", sentiment: "neutral" },
      { speaker: "customer", language: "en", text: "I already paid yesterday by UPI.", sentiment: "concerned" },
      { speaker: "agent", language: "en", text: "Thank you. Please share the payment reference so we can update records.", sentiment: "positive" }
    ]
  },
  callback_requested: {
    id: "callback_requested",
    title: "Callback requested",
    expectedOutcome: "callback_requested",
    languagePath: ["ta"],
    customerVerified: true,
    alreadyPaid: false,
    abusive: false,
    callbackRequested: { requestedFor: "2026-06-07T12:30:00.000Z" },
    transcript: [
      { speaker: "agent", language: "ta", text: "Ungal EMI pending irukku.", sentiment: "neutral" },
      { speaker: "customer", language: "ta", text: "Na ippo busy. Sunday call pannunga.", sentiment: "neutral" }
    ]
  },
  abusive_user: {
    id: "abusive_user",
    title: "Abusive user escalation",
    expectedOutcome: "abusive_user",
    languagePath: ["en"],
    customerVerified: true,
    alreadyPaid: false,
    abusive: true,
    transcript: [
      { speaker: "customer", language: "en", text: "Stop calling me, this is harassment.", sentiment: "angry" },
      { speaker: "agent", language: "en", text: "I understand you are upset. I will keep this respectful and can arrange a supervisor callback.", sentiment: "concerned" }
    ]
  },
  multilingual_switching: {
    id: "multilingual_switching",
    title: "Hindi-English language switching",
    expectedOutcome: "success",
    languagePath: ["hi", "en", "hi"],
    customerVerified: true,
    alreadyPaid: false,
    abusive: false,
    transcript: [
      { speaker: "agent", language: "hi", text: "Namaste, EMI payment ke baare mein baat karni thi.", sentiment: "neutral" },
      { speaker: "customer", language: "en", text: "Can you explain the exact amount?", sentiment: "neutral" },
      { speaker: "agent", language: "hi", text: "Ji, total due amount 18,400 rupaye hai.", sentiment: "positive" }
    ]
  },
  payment_commitment: {
    id: "payment_commitment",
    title: "Promise to pay captured",
    expectedOutcome: "payment_commitment",
    languagePath: ["en"],
    customerVerified: true,
    alreadyPaid: false,
    abusive: false,
    paymentCommitment: { amount: 5000, promisedFor: "2026-06-14" },
    transcript: [
      { speaker: "agent", language: "en", text: "Can you make a partial payment today?", sentiment: "neutral" },
      { speaker: "customer", language: "en", text: "I will pay 5,000 today and the rest next Friday.", sentiment: "positive" },
      { speaker: "agent", language: "en", text: "I have recorded your promise to pay.", sentiment: "positive" }
    ]
  }
};

export const allSimulationScenarioIds = Object.keys(simulationScenarios) as SimulationScenarioId[];
