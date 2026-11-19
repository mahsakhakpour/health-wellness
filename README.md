# NurKin

**A family health record platform for children with special needs.**

Parents and caregivers can track medications, appointments, therapy goals and the care team in one centralized dashboard, so nothing important gets lost between doctors, therapists and specialists.

[Live Demo](https://health-wellness-psi.vercel.app/) · [Case Study](https://www.mahsa.website/Health-Wellness_Case_Study.pdf) · [Portfolio](https://www.mahsa.website/projects/health-wellness)

![Dashboard screenshot](public/screenshots/dashboard.png)

---

## The Problem

Families caring for a child with special needs juggle a lot of information: multiple medications, frequent appointments, therapy goals and a large team of providers. That information usually ends up spread across notebooks, calendars and phone notes, which makes it hard to see the full picture or share it with the care team.

## The Solution

NurKin brings everything into one place. I designed the experience from initial sketches and UX research through UI design, then built it as a full-stack application.

## Features

- **Secure authentication**: login with hashed passwords via NextAuth.js, with form validation and clear error feedback
- **Health dashboard**: an at-a-glance overview of active medications, care team size, upcoming appointments and active therapy goals, with statistics that update as data is added
- **Medication tracking**: add and manage medications with dosage, frequency and purpose, updated instantly without a page reload
- **Appointment scheduler**: store appointment type, provider, date and time
- **Therapy goal progress**: interactive sliders and progress bars to track improvement toward target goals
- **Care team directory**: keep every doctor, therapist and specialist in one list
- **Child profile**: an editable health record including birth date, blood type, allergies and diagnoses

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), TypeScript |
| Styling & UI | Tailwind CSS, shadcn/ui, Lucide React |
| Authentication | NextAuth.js |
| Database | Prisma ORM, SQLite |
| Deployment | Vercel |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/mahsakhakpour/health-wellness.git
cd health-wellness

# Install dependencies
npm install

# Set up the database
npx prisma migrate dev
npx prisma db seed

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Demo Account

Try the [live demo](https://health-wellness-psi.vercel.app/) or a local install with the pre-seeded demo account:

- **Email:** `parent@example.com`
- **Password:** `password123`

## Project Structure

```
app/            Routes, pages and API endpoints
components/ui/  Reusable UI components (shadcn/ui)
lib/            Auth config, database client and helpers
prisma/         Database schema and seed script
public/         Static assets
types/          Shared TypeScript types
```

## My Role

I owned this project end to end: UX research, sketches, wireframes and UI design, then front-end and back-end development, database design and deployment.

## Author

**Mahsa Khakpour**, Design Engineer
[mahsa.website](https://www.mahsa.website) · [GitHub](https://github.com/mahsakhakpour)

---

© 2026 Mahsa Khakpour. All rights reserved.
