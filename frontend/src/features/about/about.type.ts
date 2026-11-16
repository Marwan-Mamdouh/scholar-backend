export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export interface ContactsList {
  icon: React.ElementType;
  title: string;
  url: string;
}

export interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface TimelineItem {
  id: string;
  idColor: string;
  title: string;
  description: string;
}

// Shapes returned by GET /api/about/teams
export type TeamKey = "web" | "industry" | "academia";

export interface Member {
  id: number;
  name: string;
  role: string;
  linkedinUrl: string | null;
}

export interface Team {
  key: TeamKey;
  name: string;
  membersCount: number;
  members: Member[];
}

export interface TeamsData {
  stats: {
    totalTeams: number;
    totalMembers: number;
  };
  teams: Team[];
}

export interface MeetOurTeamProps {
  // null when the teams request failed
  teams: TeamsData | null;
}
