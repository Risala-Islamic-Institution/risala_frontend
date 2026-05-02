# Risala Frontend Redesign Prompt for v0

Use this prompt as the single design brief when rebuilding the Risala frontend from scratch in v0.

You must design a premium, modern, deeply polished Islamic learning marketplace that feels calm, authoritative, intelligent, and alive. The result should not look like a generic SaaS dashboard, a generic course platform, or a normal card-grid website. It should feel purpose-built for Risala.

The current backend is already defined. Do not invent backend capabilities that do not exist. Use the backend reference file as the source of truth:

- backend_reference_for_v0.md
- risala_content.txt
- risala_color_thery.md

## Overall Goal

Redesign the entire frontend so it feels:

- sleek and high-end
- clearly Islamic without looking old-fashioned or decorative for no reason
- emotionally calm and trustworthy
- responsive and mobile-first, but equally strong on desktop
- dynamic enough to show live booking pressure and teacher availability changes
- professional for both students and teachers
- aligned with the actual backend data model and API behavior

The UI should not rely on plain boxed cards and stock dashboard patterns. Instead, use rich composition, layered surfaces, strong typography, subtle motion, and thoughtful empty states.

## Brand and Visual Direction

Follow the color theory guidance exactly:

- Primary: Deep Emerald Serenity, #0F3D2E
- Secondary: Midnight Charcoal Blue, #1C1F26
- Accent: Soft Luminous Gold, #C6A75E
- Background: Warm Pearl White, #F7F8F5
- Support Neutral: Sandstone Grey, #D6D2C4

Semantic colors:

- Success: #2F7D5A
- Warning: #E6B566
- Error: #B5473F

Visual rules:

- Emerald drives identity, navigation, and primary actions.
- Charcoal drives typography, depth, and structural anchors.
- Pearl white should be the reading surface, not plain white.
- Gold should be used sparingly as an accent for importance, progress, and active states.
- Do not overuse gold.
- Do not use loud green.
- Do not make the interface look like a mosque poster.
- Do not make it look like a generic modern purple SaaS app.

Typography direction:

- Use a serious, elegant, modern type system with a strong hierarchy.
- Headlines should feel editorial and authoritative.
- Body text should remain highly readable for long study sessions and scheduling workflows.
- Avoid bland, default, system-looking typography.

Surface and background direction:

- Use layered panels, soft shadows, and subtle border treatments.
- Add geometric or ornamental structure only when it improves the composition.
- Prefer atmospherics, gradients, and light texture over flat single-color backgrounds.
- Make pages feel composed, not boxed.

Motion direction:

- Use meaningful motion, not decorative noise.
- Animate page transitions, active selection states, live slot changes, and approval actions.
- Use subtle pulse, shimmer, and status morphing for time-sensitive elements.
- Motion should clarify state, especially for availability and payment flow.

## Critical Product Principle

The app must visually communicate that time is live, trust matters, and scheduling is dynamic.

That means:

- teacher availability should feel active and breathing
- slot availability should update visibly when another student books
- taken slots must clearly collapse from available to unavailable
- approval and disapproval actions must feel authoritative and immediate
- notifications should feel like state changes, not just static lists

## Backend Constraints the Design Must Respect

Do not design features that the backend does not support.

Important backend realities:

- All custom API routes are authenticated by default.
- Public signup is only for STUDENT and USTAZ roles.
- Teacher directory browsing exists, but it is still authenticated.
- Teacher availability is weekly recurring and timezone-aware.
- Slot generation is backend-driven and should be treated as the source of truth.
- There is no real realtime websocket system yet, only a ping/pong stub.
- Use polling, refresh hints, or short refetch loops for live availability, not websocket-driven UI assumptions.
- Payment is Stripe checkout for booking orders and legacy booking flow, not a public payment CRUD system.
- Quiz questions do not expose the correct answer.
- Notifications are server-side records with a mark-read action.
- Courses, modules, lessons, questions, answers, announcements, enrollments, progress, certificates, and bookings all exist and must be represented.

## Required UX Tone

The product should feel like:

- a premium Islamic learning platform
- a disciplined scheduling system
- a trusted service for adults who value clarity
- a sophisticated teacher workspace

It should never feel childish, cluttered, playful in the wrong way, or too generic.

## Page Families to Design

Design the full experience for both student and teacher sides.

### 1. Public and Entry Pages

Create a strong first impression with these pages:

- landing/home
- login
- register
- password reset related screens if needed by auth flow

The landing page should immediately communicate:

- Islamic learning
- verified teachers
- live scheduling
- flexible booking
- secure payment
- adult beginner support

The entry pages should feel welcoming but serious, not decorative or noisy.

### 2. Student Experience

Design student-facing screens for:

- dashboard
- teacher directory
- teacher profile
- live availability and slot booking
- booking request and booking status tracking
- package booking flow
- payment checkout handoff
- notifications center
- enrolled courses
- lesson progress
- quiz attempt screens
- course reviews
- certificates

The student experience should make it easy to answer:

- Which teachers are available now?
- Which slots are still open?
- What just got taken?
- What do I need to pay for?
- What is pending approval?
- What have I completed?

### 3. Teacher Experience

Design teacher-facing screens for:

- teacher dashboard
- request inbox
- approve and decline actions
- booking calendar
- availability editor
- course creator
- module manager
- lesson manager
- announcements
- question and answer management
- notifications
- profile and verification status

The teacher experience should feel like a command center with calm authority, not a cluttered admin panel.

## Live Availability Page Direction

This page is one of the most important pages in the product.

The backend provides teacher availability and generated slots, but not true websocket realtime. The UI should still feel live and urgent.

Design requirements:

- show teachers and their current available windows clearly
- show slot states in a way that feels dynamic
- when a slot becomes taken, it should visibly transition out of the available state
- show a last refreshed indicator and update pulse
- use near-real-time polling behavior with visible refresh rhythm
- visually distinguish available, reserved, taken, and expired states
- make the page feel like a living timetable rather than a static schedule list

Recommended interaction pattern:

- use a top status bar showing current refresh state
- use animated slot chips, timeline bands, or availability ribbons
- use a live pulse indicator on the teacher card or schedule panel
- show a subtle “someone just booked this” style state transition when a slot disappears or becomes unavailable
- surface timezone context prominently
- keep the booking action immediate and clear

Do not build this page as a plain list of cards. It should feel like a live control surface.

## Teacher List Page Direction

The teacher directory should not be a normal grid of portrait cards.

It should feel more like a curated Islamic teaching marketplace with strong visual rhythm.

Design it with:

- powerful filtering for specialization and verification status
- visible teacher credibility markers
- elegant rhythm and hierarchy
- rich hover and focus states
- quick access to availability, hourly rate, and specialization
- clear distinction between visible, verified, and bookable teachers

Useful emphasis:

- teaching level
- specialization
- languages
- hourly rate
- rating average
- total students
- verification status
- current availability snapshot

## Student Dashboard Direction

The student dashboard should feel like a personal learning command center.

It should emphasize:

- next upcoming booking
- live availability shortcuts
- active course progress
- unread notifications
- payment or approval status
- certificates earned

The dashboard should make it obvious what to do next.

## Teacher Dashboard Direction

The teacher dashboard should feel like a high-trust operations workspace.

It should emphasize:

- new booking requests
- package approvals
- upcoming booked sessions
- availability health
- course publishing status
- student questions waiting for answers
- lesson and module progress
- notification backlog

The teacher should be able to scan the page and act immediately.

## Booking and Request Review Experience

Students create booking requests or booking packages. Teachers approve or decline.

Design the request flow with clear emotional states:

- requested
- pending approval
- approved
- declined
- cancelled
- confirmed
- paid

The approval workflow should feel crisp:

- one strong approve action
- one strong decline action
- clear contextual detail about time, teacher, student, and package length
- a compact but expressive status history

## Courses and Learning Experience

The course area should feel structured, spiritual, and educational.

Design the course experience for:

- course catalog
- course detail
- module structure
- lesson detail
- reading/video/live/quiz lesson types
- progress tracking
- certificate completion
- reviews
- announcements
- student questions and teacher answers

Course pages should feel layered and content-rich, not like a generic LMS.

Important visual behavior:

- show course modules as a structured progression rather than flat accordion-only content
- show completion and locked states with dignity
- show quiz progress and lesson completion clearly
- show certificates as something meaningful and celebratory, but still elegant

## Notifications Experience

Notifications are not a side detail. They are part of the operational flow.

Design the notifications UI so that:

- unread items are visually obvious
- booking changes feel urgent but not chaotic
- mark-read actions are clear and satisfying
- notifications can be scanned quickly in a compact list
- the notifications page feels alive even without websocket push

## Payment Flow Direction

Payments are Stripe checkout based.

The frontend should:

- clearly explain what is being paid for
- show order totals, session counts, and teacher context
- hand off smoothly to checkout
- show success and cancelled states clearly
- allow the user to return and verify the result

The payment UI should feel secure and calm.

## Forms and Controls

Forms should not feel standard or generic.

They should be:

- compact
- structured
- easy to scan
- supportive of long-timezone scheduling data entry
- consistent across roles

For availability editing, booking creation, and course creation:

- make time and date controls visually prominent
- show timezone context clearly
- prevent confusion around day-of-week and repeating schedules
- make validation states calm and helpful

## State Design Rules

Every major screen must support these states:

- loading
- refreshing
- empty
- error
- partial data
- stale data
- success

For the live booking page in particular, do not treat loading as blank waiting. Use skeletons, pulses, and soft placeholder rhythms that preserve the feeling of a live system.

## No Generic SaaS Behavior

Avoid these patterns:

- default dashboard cards with weak hierarchy
- flat white pages with tiny accent lines
- generic purple gradients
- overused hero sections
- shallow icon-only visual storytelling
- overly playful microinteractions

Instead:

- use intentional composition
- use strong typographic scale
- use Islamic-inspired structure subtly
- use motion only where it carries meaning
- make each page feel tailored to its purpose

## Responsive Requirements

The design must work well on:

- mobile phones
- tablets
- desktop dashboards

Mobile should not feel like a cramped desktop. It should be a first-class design.

## Accessibility and Usability Requirements

- Maintain readable contrast.
- Make live status not only color-based; use labels, icons, and shape changes too.
- Make approval and booking actions obvious.
- Keep touch targets comfortable on mobile.
- Support long study sessions without visual fatigue.

## What the Design Must Not Assume

Do not assume:

- realtime websocket event streaming
- public anonymous course browsing as a core dependency
- JWT auth
- public payment records
- hidden quiz answers in the frontend
- arbitrary admin-style editing for students

## Suggested Product Personality

The interface should communicate:

- trust
- clarity
- sacred purpose
- discipline
- modern competence
- live responsiveness

## Final Build Instruction for v0

Design the entire frontend from scratch as a polished Islamic learning marketplace and teacher operations system, using the backend reference as the exact source of truth. Make the live teacher availability experience feel animated, urgent, and premium. Make the teacher directory elegant and credible. Make the teacher dashboard powerful and calm. Make the student experience simple, trustworthy, and visually rich. Make every page follow the Risala color theory and avoid generic UI patterns.
