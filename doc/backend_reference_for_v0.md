# Risala Backend Reference for Frontend Redesign

This file is the current frontend contract for the Risala backend. It is written for v0 so the UI can be redesigned from scratch without reading backend source code.

The backend is a Django + Django REST Framework app with these important rules:

- All custom API endpoints are authenticated by default.
- The API is mounted under `/api/`.
- CORS is enabled only for `/api/*` routes.
- The frontend should expect token auth and session auth support.
- Public signup is only for learner and instructor roles.
- Admin documentation routes are not public frontend dependencies.
- WebSocket support exists only as a minimal ping/pong stub.

## 1) Global Backend Behavior

- Default DRF authentication classes: session authentication and token authentication.
- Default DRF permission class: authenticated only.
- Login can use email or username.
- Signup requires `username`, `email`, `password1`, `password2`, plus the custom registration fields described below.
- Email verification is mandatory in production-style settings, but disabled in local development.
- Media files are served from `/media/` and include course thumbnails and module files.
- Stripe checkout is used for paid booking packages and legacy single-booking payments.

## 2) Public and Non-API Pages

These are normal Django web pages, not the redesign target for v0:

- `/` home page
- `/about/` about page
- `/users/~redirect/` legacy logged-in redirect page
- `/users/~update/` legacy user update page
- `/users/<username>/` legacy user detail page
- `/accounts/` allauth web auth pages

## 3) API Route Map

### 3.1 Auth and Account Routes

- `/api/auth-token/` legacy DRF token login endpoint.
- `/api/auth/` standard `dj-rest-auth` endpoints such as login, logout, user details, and password change/reset flows.
- `/api/auth/registration/` standard `dj-rest-auth` plus allauth registration endpoints.
- `/api/schema/` OpenAPI schema endpoint, admin-only.
- `/api/docs/` Swagger UI, admin-only.

Frontend note: do not depend on `/api/schema/` or `/api/docs/` from the customer-facing app.

### 3.2 Payments Routes

- `POST /api/payments/create-session/`
- `POST /api/payments/checkout/`
- `POST /api/payments/webhook/`
- `POST /api/payments/verify-session/`

The `create-session` and `checkout` URLs point to the same checkout session view.

### 3.3 Custom DRF API Routes

All of these are under `/api/` and require authentication unless noted otherwise by package behavior.

- `/api/users/`
- `/api/users/<username>/`
- `/api/users/me/`
- `/api/users/profile/`
- `/api/teachers/`
- `/api/teachers/<id>/`
- `/api/availability/`
- `/api/availability/<id>/`
- `/api/availability/slots/`
- `/api/bookings/`
- `/api/bookings/<id>/`
- `/api/bookings/<id>/cancel/`
- `/api/bookings/create-package/`
- `/api/bookings/approve-package/`
- `/api/bookings/<id>/approve/`
- `/api/bookings/<id>/confirm/`
- `/api/bookings/<id>/decline/`
- `/api/notifications/`
- `/api/notifications/<id>/`
- `/api/notifications/<id>/read/`
- `/api/courses/`
- `/api/courses/<slug>/`
- `/api/courses/<slug>/publish/`
- `/api/courses/<slug>/unpublish/`
- `/api/modules/`
- `/api/modules/<id>/`
- `/api/lessons/`
- `/api/lessons/<id>/`
- `/api/enrollments/`
- `/api/enrollments/<id>/`
- `/api/lesson-progress/`
- `/api/lesson-progress/<id>/`
- `/api/certificates/`
- `/api/certificates/<id>/`
- `/api/quiz-questions/`
- `/api/quiz-questions/<id>/`
- `/api/quiz-attempts/`
- `/api/quiz-attempts/<id>/`
- `/api/course-reviews/`
- `/api/course-reviews/<id>/`
- `/api/course-announcements/`
- `/api/course-announcements/<id>/`
- `/api/course-questions/`
- `/api/course-questions/<id>/`
- `/api/course-answers/`
- `/api/course-answers/<id>/`

## 4) Auth, Registration, and Role Rules

### 4.1 Roles That Exist in the Backend

- `STUDENT`
- `USTAZ`
- `ADMIN`
- `FINANCE`
- `SUPPORT`

### 4.2 Public Signup Rules

- Self-registration is allowed only for `STUDENT` and `USTAZ`.
- `ADMIN`, `FINANCE`, and `SUPPORT` are internal-only roles.
- Registration accepts an optional `full_name` field and a `role` field.
- If a new user registers as `STUDENT`, the backend auto-creates a student profile.
- If a new user registers as `USTAZ`, the backend auto-creates a teacher profile.

### 4.3 Login Rules

- Login accepts either email or username.
- The backend currently supports token auth and session auth.
- The frontend should not assume JWT.

## 5) User API Surface

### 5.1 `/api/users/` and `/api/users/<username>/`

Behavior:

- Authenticated only.
- The queryset is self-only, so a user can only see their own user record.
- `lookup_field` is `username`, but the queryset still filters to the current user.

Returned user fields:

- `id`
- `username`
- `email`
- `full_name`
- `phone_number`
- `gender`
- `date_of_birth`
- `country`
- `user_timezone`
- `preferred_language`
- `is_active`
- `roles`
- `primary_role`
- `created_at`

### 5.2 `/api/users/me/`

Behavior:

- Returns the current authenticated user.
- This is the most direct profile bootstrap endpoint for the frontend.

### 5.3 `/api/users/profile/`

Behavior:

- Returns the current user profile type.
- Response shape is one of:
  - `{ type: "teacher", profile: ... }`
  - `{ type: "student", profile: ... }`
- If the user has no role profile yet, the backend returns 404.

## 6) Teacher Directory and Availability

### 6.1 `/api/teachers/` and `/api/teachers/<id>/`

Behavior:

- Authenticated only.
- Lists only teachers whose profiles have `profile_visibility = true`.
- Supports query filtering by `specialization`.
- Supports `verified=true` to return only verified teachers.
- Current backend behavior does not add a separate teacher-owner lock for updates, so the frontend should still treat editing as a privileged action even if the backend is permissive.

Teacher profile fields:

- `id`
- `user`
- `biography`
- `qualifications`
- `years_of_experience`
- `teaching_languages`
- `teaching_level`
- `specialization`
- `hourly_rate`
- `rating_average`
- `total_students`
- `verification_status`
- `profile_visibility`
- `created_at`

### 6.2 `/api/availability/`

Behavior:

- Authenticated only.
- Teachers manage their own recurring weekly availability.
- `teacher` is read-only in the serializer and is filled from the authenticated teacher on create.
- If a `teacher_id` query parameter is provided, the endpoint returns active availability for that teacher.

Availability fields:

- `id`
- `teacher`
- `day_of_week`
- `start_time`
- `end_time`
- `timezone`
- `is_active`
- `created_at`

### 6.3 `/api/availability/slots/`

Behavior:

- Authenticated only.
- Generates upcoming bookable slots for one teacher.
- Required query parameter: `teacher_id`.
- Optional query parameters:
  - `days` defaults to `14`
  - `slot_minutes` defaults to `60`
- Response shape: `{ slots: [{ start_at, end_at }, ...] }`
- Returned datetimes are ISO strings.

Frontend use case:

- Use this endpoint to build the booking calendar and to avoid showing blocked times.

## 7) Booking and Session Scheduling

### 7.1 `/api/bookings/`

Behavior:

- Authenticated only.
- Students see their own bookings.
- Teachers see bookings for their own teacher profile.
- Students can create single bookings.
- The booking serializer requires `teacher`, `start_at`, and `end_at`.
- The backend auto-fills `student` from the authenticated user.
- The backend defaults new bookings to `REQUESTED`.

Session booking fields:

- `id`
- `teacher`
- `student`
- `start_at`
- `end_at`
- `status`
- `hourly_rate`
- `created_at`
- `teacher_name`
- `student_name`
- `order`

### 7.2 `/api/bookings/<id>/cancel/`

Behavior:

- Student-only action for the owning booking.
- Cannot cancel if the booking has already started or passed.
- Returns the updated booking.
- Creates a teacher notification when the cancel succeeds.

### 7.3 `/api/bookings/create-package/`

Behavior:

- Authenticated only.
- Student-only action.
- Creates a recurring booking package and a `BookingOrder` in one transaction.

Request shape:

- `teacher_id`
- `weekly_slots`
- `duration_weeks`
- `start_date` optional

Each `weekly_slots` item contains:

- `day_of_week`
- `start_time`
- `end_time`

Response:

- Returns a `BookingOrder` payload.

Important frontend note:

- The order serializer does not include the generated bookings list, so the frontend should refetch bookings if it needs to render every session in the package.

### 7.4 `/api/bookings/approve-package/`

Behavior:

- Teacher-only for the teacher that owns the order.
- Requires `order_id`.
- The order must be in `REQUESTED` status.
- On approval, the order becomes `APPROVED` and the linked bookings become `APPROVED`.
- A notification is created for the student.

### 7.5 `/api/bookings/<id>/approve/`

Behavior:

- Teacher-only for the booking owner.
- Approves a single booking request.
- Allowed from `REQUESTED` and `PENDING` only.
- Creates a student notification.

### 7.6 `/api/bookings/<id>/confirm/`

Behavior:

- Backward-compatible alias for approve.
- Use it only if the frontend needs to support an older flow.

### 7.7 `/api/bookings/<id>/decline/`

Behavior:

- Teacher-only for the booking owner.
- Marks the booking `DECLINED`.
- Creates a student notification.

### 7.8 Booking and Order Statuses

Booking order statuses:

- `REQUESTED`
- `APPROVED`
- `PENDING`
- `PAID`
- `FAILED`
- `EXPIRED`

Session booking statuses:

- `PENDING`
- `REQUESTED`
- `RESERVED`
- `APPROVED`
- `CONFIRMED`
- `DECLINED`
- `EXPIRED`
- `CANCELLED`

Frontend implication:

- Treat `APPROVED` and `CONFIRMED` as the paid/accepted path for package bookings.
- Treat `REQUESTED` as the initial student request state.
- Treat `RESERVED` as the legacy payment-hold state.

## 8) Notifications

### 8.1 `/api/notifications/` and `/api/notifications/<id>/`

Behavior:

- Authenticated only.
- The queryset is always scoped to the current user.
- Notifications are ordered newest first.

Notification fields:

- `id`
- `title`
- `body`
- `is_read`
- `created_at`
- `related_booking`

### 8.2 `/api/notifications/<id>/read/`

Behavior:

- Marks a notification as read.
- Returns the updated notification.

### 8.3 Notifications the backend currently creates

- New booking request to the teacher.
- Booking cancelled to the teacher.
- Booking approved or declined to the student.
- New course enrollment to the teacher.
- Course completion to the student and teacher.
- Package approved to the student.
- Package paid and confirmed to the teacher.

Frontend note:

- There is no real notification websocket fanout yet, so polling or refetching is still required.

## 9) Courses, Modules, Lessons, and Learning Progress

### 9.1 `/api/courses/` and `/api/courses/<slug>/`

Behavior:

- Authenticated only.
- `slug` is the lookup field.
- Teachers see only their own courses.
- Students see published courses and any courses they are already enrolled in.
- Other authenticated users see only published courses.

Course fields:

- `id`
- `title`
- `slug`
- `description`
- `category`
- `level`
- `duration_type`
- `total_weeks`
- `syllabus`
- `prerequisites`
- `created_by`
- `thumbnail`
- `is_published`
- `price`
- `modules`
- `created_at`

### 9.2 `/api/courses/<slug>/publish/` and `/api/courses/<slug>/unpublish/`

Behavior:

- Teacher-only for the course owner.
- Toggles the course publish state.

### 9.3 Course enums

Categories:

- `QURAN`
- `TAJWEED`
- `ARABIC`
- `TAFSIR`
- `HIFZ`
- `FIQH`
- `AQEEDAH`

Levels:

- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`

Duration types:

- `FIXED`
- `SUBSCRIPTION`

### 9.4 `/api/modules/` and `/api/modules/<id>/`

Behavior:

- Authenticated only.
- Teachers can manage modules for their own courses.
- Students can view modules for published courses or courses they are enrolled in.
- Query parameter support: `course_id`.

Module fields:

- `id`
- `title`
- `order_index`
- `learning_objectives`
- `estimated_duration`
- `is_mandatory`
- `file`
- `lessons`

### 9.5 `/api/lessons/` and `/api/lessons/<id>/`

Behavior:

- Authenticated only.
- Teachers can manage lessons for their own courses.
- Students can view lessons for published or enrolled courses.
- Query parameter support: `module_id`.

Lesson fields:

- `id`
- `title`
- `lesson_type`
- `content_reference`
- `duration_minutes`
- `requires_attendance`
- `is_free_preview`
- `order`
- `start_marker`
- `end_marker`

### 9.6 Lesson enums

Lesson types:

- `VIDEO`
- `LIVE`
- `READING`
- `QUIZ`

### 9.7 `/api/enrollments/` and `/api/enrollments/<id>/`

Behavior:

- Authenticated only.
- Students can create and list their own enrollments.
- Teachers can view enrollments for their own courses.
- Create expects `course_id`.
- Duplicate enrollments are blocked by the model layer.

Enrollment fields:

- `id`
- `course`
- `course_id`
- `status`
- `progress_percent`
- `created_at`

### 9.8 `/api/lesson-progress/` and `/api/lesson-progress/<id>/`

Behavior:

- Authenticated only.
- Students can create and update their own progress.
- Teachers can read progress for their own courses.
- Create/update uses `enrollment_id` and `lesson_id`.
- Upsert behavior exists in create: if the record already exists, it is updated.

Lesson progress fields:

- `id`
- `enrollment_id`
- `lesson_id`
- `is_completed`
- `completed_at`
- `score`
- `time_spent_minutes`

### 9.9 `/api/certificates/` and `/api/certificates/<id>/`

Behavior:

- Read-only.
- Students see their own certificates.
- Teachers see certificates for their own courses.

Certificate fields:

- `id`
- `enrollment`
- `issued_at`
- `code`
- `course_title`
- `course_slug`

### 9.10 Course reviews, announcements, questions, and answers

- `/api/course-reviews/` is student-facing review creation and listing for the student or teacher context.
- `/api/course-announcements/` is teacher-posted course news.
- `/api/course-questions/` is student question posting and viewing.
- `/api/course-answers/` is teacher answer posting and viewing.

Course review fields:

- `id`
- `enrollment`
- `rating`
- `comment`
- `created_at`

Course announcement fields:

- `id`
- `course`
- `title`
- `body`
- `created_at`

Course question fields:

- `id`
- `course`
- `student`
- `body`
- `created_at`

Course answer fields:

- `id`
- `question`
- `teacher`
- `body`
- `created_at`

Frontend note on quiz questions:

- The quiz question serializer does not expose the correct answer.
- The frontend must not expect answer keys from the API.

### 9.11 `/api/quiz-questions/` and `/api/quiz-questions/<id>/`

Behavior:

- Authenticated CRUD is exposed.
- Query parameter support: `lesson_id`.
- Current backend behavior does not add a separate teacher-only guard in the view, so the frontend should still treat it as privileged content management.

Quiz question fields:

- `id`
- `text`
- `option_a`
- `option_b`
- `option_c`
- `option_d`

### 9.12 `/api/quiz-attempts/` and `/api/quiz-attempts/<id>/`

Behavior:

- Authenticated only.
- Students can submit attempts for their own enrollments.
- Teachers can inspect attempts for their own courses.
- The frontend submits an `answers` array with question ids and selected options.

Quiz attempt fields:

- `id`
- `enrollment`
- `lesson`
- `score`
- `is_passed`
- `submitted_at`
- `answers`

Quiz attempt rules:

- The lesson must be of type `QUIZ`.
- The backend calculates score and pass/fail.
- Passing a quiz marks the lesson complete.

## 10) Payments

### 10.1 Payment Route Purpose

The backend does not expose public Payment CRUD.

Instead, payments are created and updated internally through Stripe checkout and webhook processing.

### 10.2 `POST /api/payments/create-session/` or `POST /api/payments/checkout/`

Behavior:

- Authenticated only.
- Accepts either `order_id` or `booking_id`.
- `order_id` is the preferred package-payment flow.
- `booking_id` is a legacy single-booking flow.
- Returns `sessionId` and `checkout_url` on success.

Important authorization rule:

- The current user must own the booking order or booking being paid for.

Response on success:

- `sessionId`
- `checkout_url`

### 10.3 `POST /api/payments/verify-session/`

Behavior:

- Authenticated only.
- Accepts `session_id`.
- Queries Stripe to confirm payment status.
- If Stripe says the session is paid, the backend replays the completion flow idempotently.

### 10.4 `POST /api/payments/webhook/`

Behavior:

- Stripe calls this endpoint directly.
- It is CSRF-exempt and signature-verified.
- It handles `checkout.session.completed`.
- `checkout.session.expired` is currently a no-op.

### 10.5 Stripe Checkout Flow

Current flow:

1. Student creates a booking package.
2. Teacher approves the package.
3. Frontend calls `create-session` with `order_id`.
4. Stripe redirects to the configured success URL.
5. Webhook or session verification marks the order paid.
6. Linked bookings become `CONFIRMED`.

Legacy flow:

1. Student uses a single booking.
2. Backend wraps the booking into a booking order if needed.
3. Frontend still pays through Stripe checkout.

### 10.6 Payment Model Statuses

- `PENDING`
- `COMPLETED`
- `FAILED`
- `REFUNDED`
- `EXPIRED`

Frontend note:

- Show payment state from the order or the booking flow, not from a public payment dashboard, because there is no public payment CRUD.

## 11) Realtime and WebSocket Support

- The ASGI app routes websocket scopes to `config.websocket.websocket_application`.
- The current websocket implementation is only a stub.
- Any websocket connection is accepted.
- If the client sends `ping`, the server replies `pong!`.
- There is no auth, no channels consumer layer, and no event-based notifications.

Frontend implication:

- Use polling, refetching, or manual refresh for now.
- Do not design the UI around real-time pushed booking or notification events.

## 12) Environment and Deployment Assumptions

The frontend does not need these values directly, but they explain backend behavior and redirects:

- `DATABASE_URL` is required.
- `REDIS_URL` is used for Celery and cache in production.
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are required for payments.
- `STRIPE_SUCCESS_URL` and `STRIPE_CANCEL_URL` control post-checkout redirection.
- Local CORS allows `http://localhost:3333`, `http://127.0.0.1:3333`, and `http://localhost:3000`.
- Production security settings force HTTPS and secure cookies.
- Production requires `DJANGO_ADMIN_URL`, `SENDGRID_API_KEY`, and `SENTRY_DSN`.

## 13) Model and UX Constraints the Frontend Should Respect

- Teacher booking calendars are weekly recurring availability blocks in a specific timezone.
- Students can only create bookings as authenticated students.
- Teachers own their own courses, modules, lessons, announcements, and answers.
- Students own their own enrollments, lesson progress, quiz attempts, reviews, questions, and bookings.
- Course and teacher directory browsing is authenticated-only in the current backend.
- Certificates are generated from completed enrollments.
- Notifications are simple server-side records, not a full messaging system.

## 14) Current Backend Limitations and Stubs

- Real websocket notifications are not implemented.
- `checkout.session.expired` is not handled yet.
- The payment completion flow has a TODO for meeting-link generation and richer notification handling.
- The legacy HTML user update view is stale and does not match the custom user model cleanly.
- Quiz questions hide the correct answer by design.
- There is no public Payment CRUD endpoint.

## 15) Recommended Frontend Screen Mapping

Use this backend behavior as the source of truth when rebuilding the app:

- Student dashboard: profile, bookings, payments, enrollments, lesson progress, notifications, certificates.
- Teacher dashboard: profile, availability, bookings, courses, modules, lessons, announcements, questions, answers, notifications.
- Public teacher browse flow: authenticated teacher directory with specialization and verification filters.
- Course learning flow: course details, modules, lessons, enrollment, quiz attempts, progress tracking, review submission.
- Booking flow: teacher availability, slot selection, booking request, teacher approval, payment checkout, confirmation.

## 16) Short Version for v0 Prompting

If you only paste one sentence into v0, use this:

Risala is an authenticated-first Islamic learning marketplace with student and teacher roles, teacher availability scheduling, single bookings and recurring booking packages, Stripe checkout for package payments, course enrollment and progress tracking, hidden quiz answers, server-side notifications, and no real websocket layer yet.
