import { api, type ApiResponse } from "@/src/lib/api-client";
import type { ContactData } from "./contact.schema";
import type { TeamsData } from "./about.type";

export async function fetchTeams(): Promise<TeamsData> {
  const { data } = await api.get<ApiResponse<TeamsData>>("/about/teams");
  return data.data;
}

/** Returns the backend's confirmation message. */
export async function sendContactMessage(contact: ContactData): Promise<string> {
  const { data } = await api.post<ApiResponse<unknown>>(
    "/about/contact",
    contact,
  );
  return data.message ?? "Message sent successfully.";
}
