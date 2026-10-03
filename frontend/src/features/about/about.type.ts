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

export interface Member {
  id: string;
  name: string;
  role?: string;
  linkedIn?: string;
}

export interface Team {
  title: string;
  count: number;
  members: Member[];
}

export interface Meta {
  teamCount: number;
  memberCount: number;
}

export interface TeamsData {
  meta: Meta;
  data: Team[];
}

export interface MeetOurTeamProps {
  teams: TeamsData;
}