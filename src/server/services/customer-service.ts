import { customers as mockCustomers } from "@/lib/mock-data";
import { getServiceSupabase, hasSupabaseConfig } from "@/server/db/supabase";
import type { AuthContext } from "@/server/security/rbac";

export async function listCustomers(auth: AuthContext, query?: string) {
  if (!hasSupabaseConfig()) {
    return query ? mockCustomers.filter((customer) => customer.name.toLowerCase().includes(query.toLowerCase())) : mockCustomers;
  }

  let builder = getServiceSupabase()
    .from("customers")
    .select("*, loans(*)")
    .eq("organization_id", auth.organizationId)
    .order("risk_score", { ascending: false });
  if (query) builder = builder.ilike("full_name", `%${query}%`);
  const { data, error } = await builder;
  if (error) throw error;
  return data;
}

export async function verifyCustomer(auth: AuthContext, input: { customerId: string; phoneLast4?: string; dateOfBirth?: string }) {
  if (!hasSupabaseConfig()) {
    return { verified: true, customerId: input.customerId, confidence: 0.92 };
  }
  const { data, error } = await getServiceSupabase()
    .from("customers")
    .select("id, phone_e164")
    .eq("organization_id", auth.organizationId)
    .eq("id", input.customerId)
    .single();
  if (error) throw error;
  const verified = input.phoneLast4 ? data.phone_e164.endsWith(input.phoneLast4) : true;
  return { verified, customerId: input.customerId, confidence: verified ? 0.95 : 0.2 };
}
