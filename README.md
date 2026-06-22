# VistaBalayan: A Web-Based Tourism Data Analytics and Decision Support System for Visitor Monitoring in Balayan, Batangas

## Capstone Project Overview

### Project Information
- **Project Title**: VistaBalayan: A Web-Based Tourism Data Analytics and Decision Support System for Visitor Monitoring in Balayan, Batangas

### Project Team
- **Bancoro, Niño Rico C.**
- **Carbonilla, Marjorie B.**
- **Casanova, John Harry S.**
- **Riosa, Catherine Joy S.**

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Next.js, Tailwind CSS, Chart.js| 
| **Backend** | Node.js, Express.js, Supabase,| 
| **Database** | PostgreSQL |
| **AI** | Google Gemini API |
| **Deployment** | Vercel, Render |
| **Design** | Figma |
| **Development** | VS Code |

---


## Running the Code

1. Install dependencies:
npm install

2. Create a `.env` file with your Supabase credentials:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key

3. Run the development server:
npm run dev



### Database Design 

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['municipal_officer'::text, 'establishment_staff'::text])),
  establishment_id uuid,
  contact_number text,
  position text,
  status text DEFAULT 'active'::text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);





