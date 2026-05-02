// User & Auth
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    full_name: string;
    is_student: boolean;
    is_teacher: boolean;
    learning_goals?: string;
    profile_picture?: string;
}

// Teacher
export interface Teacher {
    id: string;
    user: { full_name: string; username: string; profile_picture?: string };
    biography: string;
    hourly_rate: string;
    specialization: string;
}

// Booking
export interface Booking {
    id: string;
    teacher: string;
    teacher_name?: string | null;
    student_name?: string | null;
    start_at: string;
    end_at: string;
    status: 'REQUESTED' | 'APPROVED' | 'RESERVED' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED' | 'PENDING' | 'EXPIRED' | 'PAID';
    hourly_rate?: string;
    order?: string;
}

// Availability & Slots
export interface Availability {
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    timezone?: string;
    is_active?: boolean;
}

export type Slot = Availability;

// Course
export interface Course {
    id: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    level: string;
    duration_type: string;
    total_weeks: number;
    price: string;
    is_published: boolean;
}

// Notification
export interface NotificationItem {
    id: string;
    title: string;
    body: string;
    is_read: boolean;
    created_at: string;
}

export interface TeacherProfile {
    id: string;
    verification_status?: string;
    specialization?: string;
    teaching_level?: string;
    hourly_rate?: string;
}
