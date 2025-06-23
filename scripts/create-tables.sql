-- Create all tables for the wedding application

-- Primary guests table
CREATE TABLE IF NOT EXISTS guests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'not-attending')),
    invitation_sent BOOLEAN DEFAULT FALSE,
    created_at TEXT NOT NULL
);

-- Additional guests linked to primary guests
CREATE TABLE IF NOT EXISTS additional_guests (
    id TEXT PRIMARY KEY,
    primary_guest_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'not-attending')),
    created_at TEXT NOT NULL,
    FOREIGN KEY (primary_guest_id) REFERENCES guests(id) ON DELETE CASCADE
);

-- RSVP responses
CREATE TABLE IF NOT EXISTS rsvp_responses (
    id TEXT PRIMARY KEY,
    guest_id TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    attending TEXT NOT NULL CHECK (attending IN ('yes', 'no')),
    dietary_restrictions TEXT,
    message TEXT,
    submitted_at TEXT NOT NULL,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE
);

-- Additional guests from RSVP responses (guests brought by primary guests)
CREATE TABLE IF NOT EXISTS rsvp_additional_guests (
    id TEXT PRIMARY KEY,
    rsvp_response_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (rsvp_response_id) REFERENCES rsvp_responses(id) ON DELETE CASCADE
);

-- Gallery images metadata
CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    uploader TEXT NOT NULL,
    uploaded_at TEXT NOT NULL,
    caption TEXT,
    visible BOOLEAN DEFAULT TRUE,
    blob_url TEXT NOT NULL
);

-- Application settings tables
CREATE TABLE IF NOT EXISTS preview_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    count INTEGER DEFAULT 10,
    use_latest BOOLEAN DEFAULT TRUE,
    updated_at TEXT NOT NULL,
    CHECK (id = 1) -- Ensure only one row
);

CREATE TABLE IF NOT EXISTS preview_selected_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (image_id) REFERENCES gallery_images(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rsvp_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    enabled BOOLEAN DEFAULT TRUE,
    deadline TEXT,
    custom_message TEXT,
    updated_at TEXT NOT NULL,
    CHECK (id = 1) -- Ensure only one row
);

CREATE TABLE IF NOT EXISTS upload_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    enabled BOOLEAN DEFAULT TRUE,
    max_photos INTEGER DEFAULT 5,
    message TEXT,
    schedule_start TEXT,
    schedule_end TEXT,
    updated_at TEXT NOT NULL,
    CHECK (id = 1) -- Ensure only one row
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name);
CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status);
CREATE INDEX IF NOT EXISTS idx_additional_guests_primary ON additional_guests(primary_guest_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_guest ON rsvp_responses(guest_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_uploader ON gallery_images(uploader);
CREATE INDEX IF NOT EXISTS idx_gallery_images_visible ON gallery_images(visible);
CREATE INDEX IF NOT EXISTS idx_gallery_images_uploaded_at ON gallery_images(uploaded_at);

-- Insert default settings if they don't exist
INSERT OR IGNORE INTO preview_settings (id, count, use_latest, updated_at) 
VALUES (1, 10, TRUE, datetime('now'));

INSERT OR IGNORE INTO rsvp_settings (id, enabled, custom_message, updated_at) 
VALUES (1, TRUE, 'RSVP submissions are currently closed.', datetime('now'));

INSERT OR IGNORE INTO upload_settings (id, enabled, max_photos, message, updated_at) 
VALUES (1, TRUE, 5, '', datetime('now'));
