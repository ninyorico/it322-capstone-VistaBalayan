# VistaBalayan: A Web-Based Tourism Data Analytics and Decision Support System for Visitor Monitoring in Balayan, Batangas

## Capstone Project Overview

### Project Information
- **Project Title**: VistaBalayan: A Web-Based Tourism Data Analytics and Decision Support System for Visitor Monitoring in Balayan, Batangas

### Project Team
- **Bancoro, Niño Rico C.**
- **Carbonilla, Marjorie B.**
- **Casanova, John Harry S.**
- **Riosa, Catherine Joy S.**

## System Overview

### What is the main function of your system?

VistaBalayan is a **web-based tourism data analytics and decision support system** designed to streamline tourism data collection, enhance visitor monitoring, and support data-driven decision-making for the Municipal Tourism and Cultural Affairs Office of Balayan, Batangas. The system also features a public tourism information and recommendation website that allows visitors to discover and explore tourist establishments in the municipality.

### Who are the users?

| User Role | Description |
|-----------|-------------|
| **Municipal Tourism Officer** | Manages tourism data, monitors submissions, reviews reports, analyzes trends, and accesses analytics dashboards and AI insights |
| **Establishment Staff** | Encodes and submits visitor and accommodation reports; manages their establishment's public listing |
| **Tourists / Public Users** | Searches and views tourist establishments; receives AI-assisted recommendations |

### What data needs to be stored?

- Visitor reports (daily tourist arrivals, demographics, residence types)
- Accommodation reports (room occupancy, guest nights, check-ins)
- Establishment profiles (name, type, address, description, images, amenities)
- User profiles (officers, establishment staff)
- AI-generated insights and anomaly detections
- Tourism analytics and trends
- System notifications

### What does the user see?

| User | Dashboard/Page |
|------|----------------|
| **Tourism Officer** | Analytics dashboard with KPIs, charts, visitor monitoring, accommodation monitoring, reports, AI insights |
| **Establishment Staff** | Submission forms, submission history, analytics, AI insights, manage public listing  (establishment description, image, etc.)|
| **Tourists** | Tourism information website with search, categories, establishment details, AI recommendations |

---

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





