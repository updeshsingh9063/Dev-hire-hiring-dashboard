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
          first_name: string;
          last_name: string;
          full_name: string;
          email: string;
          phone: string | null;
          whatsapp: string | null;
          college: string | null;
          university: string | null;
          degree: string | null;
          branch: string | null;
          current_year: number | null;
          graduation_year: number | null;
          city: string | null;
          country: string | null;
          linkedin: string | null;
          github: string | null;
          portfolio: string | null;
          resume_url: string | null;
          resume_file_name: string | null;
          about: string | null;
          project_name: string | null;
          project_description: string | null;
          problem_statement: string | null;
          solution: string | null;
          tech_stack: string[] | null;
          project_role: string | null;
          github_repo: string | null;
          live_demo: string | null;
          project_images: string[] | null;
          internships: string | null;
          freelancing: string | null;
          opensource: string | null;
          hackathons: string | null;
          achievements: string | null;
          skills: Record<string, string[]> | null;
          availability: string | null;
          joining_date: string | null;
          employment_status: string | null;
          notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['applicants']['Row'],
          'id' | 'created_at' | 'updated_at' | 'status'
        > & { status?: string };
        Update: Partial<Database['public']['Tables']['applicants']['Row']>;
      };
    };
  };
}
