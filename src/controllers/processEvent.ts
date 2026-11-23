export async function handler() {
  const baseUrl = process.env.PATIENT_API_URL || "http://127.0.0.1:3000/";
  const response = await fetch(new URL("/api/patients", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "João Demo", age: 30, gender: "male" }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) {
    throw new Error(`A API de pacientes respondeu com HTTP ${response.status}.`);
  }
  return { status: "success" };
}
