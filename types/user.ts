export interface User {
  id: string;
  user_code: string;
  name: string;
  email: string;
  auth_provider: string;
  profile_picture: string | null;
  preferred_theme: string | null;
  created_at: string;
}
