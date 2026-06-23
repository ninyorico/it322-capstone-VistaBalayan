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

CREATE TABLE public.establishments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL,
  address text NOT NULL,
  contact_number text,
  total_rooms integer DEFAULT 0,
  status text DEFAULT 'active'::text,
  created_at timestamp without time zone DEFAULT now(),
  description text,
  images ARRAY DEFAULT '{}'::text[],
  opening_hours text,
  website_url text,
  email text,
  amenities text,
  featured boolean DEFAULT false,
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT establishments_pkey PRIMARY KEY (id)
);

CREATE TABLE public.visitor_reports (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL,
  submitted_by uuid NOT NULL,
  report_date date NOT NULL,
  total_male integer DEFAULT 0,
  total_female integer DEFAULT 0,
  total_guests integer DEFAULT 0,
  residence_type text,
  place_of_residence text,
  municipality_province text,
  status text DEFAULT 'pending'::text,
  reviewed_by uuid,
  reviewed_at timestamp without time zone,
  notes text,
  created_at timestamp without time zone DEFAULT now(),
  guest_name text,
  CONSTRAINT visitor_reports_pkey PRIMARY KEY (id),
  CONSTRAINT visitor_reports_establishment_id_fkey FOREIGN KEY (establishment_id) REFERENCES public.establishments(id),
  CONSTRAINT visitor_reports_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.profiles(id),
  CONSTRAINT visitor_reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);


CREATE TABLE public.accommodation_reports (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL,
  submitted_by uuid NOT NULL,
  report_date date NOT NULL,
  total_rooms integer NOT NULL,
  total_occupied_rooms integer DEFAULT 0,
  total_check_ins integer DEFAULT 0,
  total_guest_nights integer DEFAULT 0,
  status text DEFAULT 'pending'::text,
  reviewed_by uuid,
  reviewed_at timestamp without time zone,
  notes text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT accommodation_reports_pkey PRIMARY KEY (id),
  CONSTRAINT accommodation_reports_establishment_id_fkey FOREIGN KEY (establishment_id) REFERENCES public.establishments(id),
  CONSTRAINT accommodation_reports_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.profiles(id),
  CONSTRAINT accommodation_reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);

CREATE TABLE public.room_occupancy_details (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  accommodation_report_id uuid,
  room_type text,
  room_code text,
  number_of_rooms integer,
  occupied_rooms integer,
  check_ins integer,
  guest_nights integer,
  is_rent_mode boolean DEFAULT false,
  CONSTRAINT room_occupancy_details_pkey PRIMARY KEY (id),
  CONSTRAINT room_occupancy_details_accommodation_report_id_fkey FOREIGN KEY (accommodation_report_id) REFERENCES public.accommodation_reports(id)
);

CREATE TABLE public.ai_anomalies (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  type text,
  severity text,
  description text,
  establishment_id uuid,
  detected_at timestamp without time zone DEFAULT now(),
  status text DEFAULT 'active'::text,
  recommendation text,
  CONSTRAINT ai_anomalies_pkey PRIMARY KEY (id),
  CONSTRAINT ai_anomalies_establishment_id_fkey FOREIGN KEY (establishment_id) REFERENCES public.establishments(id)
);


CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text,
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);


CREATE TABLE public.ai_insights_cache (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  insight_type text NOT NULL,
  data jsonb NOT NULL,
  period text,
  generated_at timestamp without time zone DEFAULT now(),
  expires_at timestamp without time zone DEFAULT (now() + '24:00:00'::interval),
  is_active boolean DEFAULT true,
  CONSTRAINT ai_insights_cache_pkey PRIMARY KEY (id)
);

CREATE TABLE public.ai_recommendations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  impact text CHECK (impact = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text])),
  category text,
  status text DEFAULT 'active'::text,
  created_at timestamp without time zone DEFAULT now(),
  expires_at timestamp without time zone DEFAULT (now() + '7 days'::interval),
  establishment_id uuid,
  CONSTRAINT ai_recommendations_pkey PRIMARY KEY (id),
  CONSTRAINT ai_recommendations_establishment_id_fkey FOREIGN KEY (establishment_id) REFERENCES public.establishments(id)
);

CREATE TABLE public.ai_anomalies_cache (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  anomaly_type text NOT NULL,
  severity text CHECK (severity = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text])),
  description text NOT NULL,
  recommendation text,
  establishment_id uuid,
  detected_at timestamp without time zone DEFAULT now(),
  status text DEFAULT 'active'::text,
  is_resolved boolean DEFAULT false,
  CONSTRAINT ai_anomalies_cache_pkey PRIMARY KEY (id),
  CONSTRAINT ai_anomalies_cache_establishment_id_fkey FOREIGN KEY (establishment_id) REFERENCES public.establishments(id)
);

import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
//import TourismHome from "./pages/public/TourismHome";


export const router = createBrowserRouter([
  // Public Routes (No login required)
 /* {
    path: "/",
    Component: TourismHome,  // Public tourism website - home page
  },
{
    path: "/explore",
    Component: TourismHome,  // Alias for the tourism page
  },
*/
  // Admin Login
  {
    path: "/admin/login",
    Component: Login,
  },

  // Officer Routes (Admin System)
  {
    path: "/officer",
  },

  // Staff Routes (Admin System)
  {
    path: "/staff",
  },

  // 404 - Not Found
]);