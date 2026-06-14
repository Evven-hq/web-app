export interface Group {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}
 
export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}