-- schema.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
    theme VARCHAR(20) DEFAULT 'dark',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reminder_date DATE NOT NULL,
    reminder_time TIME NOT NULL,
    reminder_datetime TIMESTAMP NOT NULL,
    repeat_type VARCHAR(50) DEFAULT 'one_time',
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending',
    category_id UUID,
    ai_generated BOOLEAN DEFAULT FALSE,
    voice_input BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reminder_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reminder_id UUID REFERENCES reminders(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL
);

CREATE TABLE reminder_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reminder_id UUID REFERENCES reminders(id) ON DELETE CASCADE,
    notification_type VARCHAR(50),
    notification_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMP,
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    meeting_link TEXT,
    event_color VARCHAR(30),
    repeat_type VARCHAR(50),
    ai_scheduled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    attendee_email VARCHAR(255)
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    input_text TEXT,
    generated_schedule JSONB,
    confidence_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    telegram_notifications BOOLEAN DEFAULT FALSE,
    timezone VARCHAR(100),
    theme VARCHAR(20) DEFAULT 'dark',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    status VARCHAR(20),
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    completed_tasks INTEGER DEFAULT 0,
    missed_tasks INTEGER DEFAULT 0,
    productivity_score FLOAT DEFAULT 0,
    tracked_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reminder_datetime ON reminders(reminder_datetime);
CREATE INDEX idx_user_reminders ON reminders(user_id);
CREATE INDEX idx_notification_status ON reminder_notifications(status);
