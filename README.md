# Health-Wellness

Complete family health record platform for children with special needs.

## Features

- **Child Profile Management** - Track diagnoses, allergies, blood type, and personal information
- **Medication Tracking** - Log medications with dosage, frequency, and purpose
- **Appointment Scheduler** - Schedule and manage upcoming appointments with providers
- **Therapy Goal Progress** - Track progress with visual sliders and percentage goals
- **Care Team Directory** - Maintain a directory of all healthcare providers
- **Secure Authentication** - Protected access with NextAuth.js
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui, Lucide React icons
- **Authentication:** NextAuth.js with credentials provider
- **Database:** SQLite with Prisma ORM

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Run development server
npm run dev