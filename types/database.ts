export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          created_at?: string;
        };
      };
      applicants: {
        Row: {
          id: string;
          created_at: string;
          // Personal
          full_name: string;
          email: string;
          phone: string;
          whatsapp: string;
          city: string;
          // Education
          college: string;
          university: string;
          degree: string;
          branch: string;
          current_year: number;
          graduation_year: number;
          // Links
          github: string | null;
          linkedin: string | null;
          portfolio: string | null;
          // About
          about: string | null;
          // Project
          project_name: string | null;
          tech_stack: string | null;
          project_description: string | null;
          explain_contribution: string | null;
          // Files
          profile_picture_url: string | null;
          resume_url: string | null;
          // Status
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          email: string;
          phone: string;
          whatsapp: string;
          city: string;
          college: string;
          university: string;
          degree: string;
          branch: string;
          current_year: number;
          graduation_year: number;
          github?: string | null;
          linkedin?: string | null;
          portfolio?: string | null;
          about?: string | null;
          project_name?: string | null;
          tech_stack?: string | null;
          project_description?: string | null;
          explain_contribution?: string | null;
          profile_picture_url?: string | null;
          resume_url?: string | null;
          status?: string;
        };
        Update: Partial<Database['public']['Tables']['applicants']['Row']>;
      };
    };
  };
}
