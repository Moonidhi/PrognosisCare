## 🎬 Demo Video

[![Watch Demo] (https://drive.google.com/file/d/1x4VNd0LudalAU7wD8bwS-CogIKyZRHFM/view?usp=drive_link)
 # Prognosis Care

Responsive React frontend for an AI-powered healthcare triage and medical assistant system with integrated lab test booking, billing, payment simulation, booking confirmation, dashboard updates, and hospital-side report delivery simulation.

## Tech Stack

- React (Hooks)
- React Router
- Context API for global state
- TailwindCSS
- Recharts
- Firebase Authentication (Email/Password)

## Features Implemented

### AI Triage + Test Recommendation

- Symptom-driven recommendation summary
- Recommended tests card with:
	- Test reason
	- Priority level (risk highlight)
	- Cost per test
	- Total estimate
- CTA: Proceed to booking

### Lab Booking + Transparent Billing

- Route: `/lab-booking`
- Hospital selection context
- Location dropdown
- Date/time slot selection
- Insurance toggle with cost impact
- Itemized bill (price, service fee, tax)
- Confirm and pay / cancel actions
- Booking loading state

### Payment Flow

- Route: `/payment`
- Stripe-style mock UI with:
	- Card fields
	- UPI option
	- Net banking option
- Secure payment badge
- Order summary + full billing breakdown
- Simulated payment success/failure
- Retry UX for failures
- Success animation + auto redirect

### Booking Confirmation

- Route: `/booking-confirmation`
- Booking ID + Invoice ID
- Hospital details
- Scheduled date/time
- Payment status: Paid
- Download Invoice button (simulation)
- Add to Calendar button (simulation)

### Dashboard Updates

- Upcoming tests section
- Payment history section
- Lab reports status section
- Notification toast: lab test scheduled
- Vital trend chart using Recharts

### Hospital Panel (Admin Simulation)

- Route: `/admin/hospital`
- View incoming test booking and patient details
- View payment status
- Mark test completed
- Upload report (PDF filename simulation)
- Report status update to Available

### Report Delivery

- Notification on report upload
- Reports visible in medical records
- Download PDF button (simulation)

### Authentication

- Public routes:
	- `/login`
	- `/signup`
- Protected routes:
	- All application routes require authenticated user
- Auth features:
	- Email/password sign up
	- Email/password login
	- Persistent session via Firebase auth state
	- Logout from top navigation

## Routes

- `/login` Login
- `/signup` Sign Up
- `/` Dashboard
- `/triage` AI Assistant
- `/lab-booking` Hospital test booking + billing
- `/payment` Payment
- `/booking-confirmation` Confirmation
- `/medical-records` Patient reports
- `/admin/hospital` Hospital admin simulation

## Firebase Setup

1. Create a Firebase project and enable **Authentication > Email/Password**.
2. Copy `.env.example` to `.env`.
3. Fill required values in `.env` (Firebase, auth accounts, AI keys, backend URL).

```bash
cp .env.example .env
```

Recommended additional values:

- `VITE_GEMINI_API_KEY`
- `VITE_GEMINI_MODEL` (default: `gemini-3-flash-preview`)
- `VITE_BACKEND_URL` (default: `http://localhost:8000`)

## Project Structure

```
src/
	components/
		BillingBreakdown.jsx
		NotificationToast.jsx
		PaymentForm.jsx
		RecommendedTestsCard.jsx
		UrgencyBadge.jsx
	context/
		AppContext.jsx
	pages/
		AdminHospitalPanelPage.jsx
		BookingConfirmationPage.jsx
		DashboardPage.jsx
		LabBookingPage.jsx
		MedicalRecordsPage.jsx
		NotFoundPage.jsx
		PaymentPage.jsx
		TriagePage.jsx
	services/
		mockApi.js
	App.jsx
	index.css
	main.jsx
```

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```


