import { forbidden, unauthorized } from "@/server/lib/errors";
import type { UUID } from "@/server/contracts/api";

export type Role =
  | "owner"
  | "admin"
  | "campaign_manager"
  | "supervisor"
  | "agent_operator"
  | "qa_reviewer"
  | "analyst"
  | "auditor";

export type AuthContext = {
  userId: UUID;
  organizationId: UUID;
  role: Role;
  email?: string;
};

const permissions = {
  "customers:read": ["owner", "admin", "campaign_manager", "supervisor", "agent_operator", "qa_reviewer", "analyst", "auditor"],
  "customers:write": ["owner", "admin", "campaign_manager", "supervisor"],
  "campaigns:write": ["owner", "admin", "campaign_manager"],
  "calls:write": ["owner", "admin", "campaign_manager", "supervisor", "agent_operator"],
  "agent_config:write": ["owner", "admin", "campaign_manager"],
  "redteam:run": ["owner", "admin", "qa_reviewer", "supervisor"],
  "analytics:read": ["owner", "admin", "campaign_manager", "supervisor", "analyst", "auditor"],
  "settings:write": ["owner", "admin"]
} satisfies Record<string, Role[]>;

export type Permission = keyof typeof permissions;

export function assertAuthenticated(auth?: AuthContext): asserts auth is AuthContext {
  if (!auth) throw unauthorized();
}

export function assertPermission(auth: AuthContext | undefined, permission: Permission) {
  assertAuthenticated(auth);
  const allowedRoles: readonly Role[] = permissions[permission];
  if (!allowedRoles.includes(auth.role)) {
    throw forbidden(`Missing permission: ${permission}`);
  }
}

export function authFromHeaders(headers: Headers): AuthContext | undefined {
  const userId = headers.get("x-user-id");
  const organizationId = headers.get("x-organization-id");
  const role = headers.get("x-user-role") as Role | null;
  if (!userId || !organizationId || !role) return undefined;
  return { userId, organizationId, role, email: headers.get("x-user-email") ?? undefined };
}
