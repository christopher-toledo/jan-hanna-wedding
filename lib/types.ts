// Database result types
export interface GuestRow {
  id: string
  name: string
  email: string
  phone: string
  rsvp_status: string
  invitation_sent: number
  created_at: string
}

export interface AdditionalGuestRow {
  id: string
  primary_guest_id: string
  name: string
  email: string
  phone: string
  rsvp_status: string
  created_at: string
}

export interface GalleryImageRow {
  id: string
  filename: string
  original_name: string
  uploader: string
  uploaded_at: string
  caption: string
  visible: number
  blob_url: string
}

export interface RSVPResponseRow {
  id: string
  guest_id: string
  guest_name: string
  attending: string
  dietary_restrictions: string | null
  message: string | null
  submitted_at: string
}

export interface RSVPAdditionalGuestRow {
  id: string
  rsvp_response_id: string
  name: string
  email: string
  created_at: string
}

export interface PreviewSettingsRow {
  id: number
  count: number
  use_latest: number
  updated_at: string
}

export interface PreviewSelectedImageRow {
  image_id: string
  created_at: string
}

export interface RSVPSettingsRow {
  id: number
  enabled: number
  deadline: string | null
  custom_message: string
  updated_at: string
}

export interface UploadSettingsRow {
  id: number
  enabled: number
  max_photos: number
  message: string
  schedule_start: string | null
  schedule_end: string | null
  updated_at: string
}

// Application types (transformed from database)
export interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  rsvpStatus: "pending" | "attending" | "not-attending"
  invitationSent: boolean
  createdAt: string
}

export interface AdditionalGuest {
  id: string
  primaryGuestId: string
  name: string
  email?: string
  phone?: string
  rsvpStatus: "pending" | "attending" | "not-attending"
  createdAt: string
}

export interface GalleryImage {
  id: string
  filename: string
  originalName: string
  uploader: string
  uploadedAt: string
  caption?: string
  visible: boolean
  blobUrl: string
}

export interface RSVPResponse {
  id: string
  guestId: string
  guestName: string
  attending: "yes" | "no"
  additionalGuests: Array<{
    name: string
    email: string
  }>
  dietaryRestrictions?: string
  message?: string
  submittedAt: string
}

export interface PreviewSettings {
  count: number
  selectedImages: string[]
  useLatest: boolean
}

export interface RSVPSettings {
  enabled: boolean
  deadline?: string
  customMessage?: string
}

export interface UploadSettings {
  enabled: boolean
  maxPhotos: number
  message?: string
  scheduleStart?: string
  scheduleEnd?: string
}

// Type transformation helpers
export function transformGuestRow(row: GuestRow): Guest {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    rsvpStatus: row.rsvp_status as "pending" | "attending" | "not-attending",
    invitationSent: Boolean(row.invitation_sent),
    createdAt: row.created_at,
  }
}

export function transformAdditionalGuestRow(row: AdditionalGuestRow): AdditionalGuest {
  return {
    id: row.id,
    primaryGuestId: row.primary_guest_id,
    name: row.name,
    email: row.email || undefined,
    phone: row.phone || undefined,
    rsvpStatus: row.rsvp_status as "pending" | "attending" | "not-attending",
    createdAt: row.created_at,
  }
}

export function transformGalleryImageRow(row: GalleryImageRow): GalleryImage {
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.original_name,
    uploader: row.uploader,
    uploadedAt: row.uploaded_at,
    caption: row.caption || undefined,
    visible: Boolean(row.visible),
    blobUrl: row.blob_url,
  }
}

export function transformRSVPResponseRow(row: RSVPResponseRow): Omit<RSVPResponse, "additionalGuests"> {
  return {
    id: row.id,
    guestId: row.guest_id,
    guestName: row.guest_name,
    attending: row.attending as "yes" | "no",
    dietaryRestrictions: row.dietary_restrictions || undefined,
    message: row.message || undefined,
    submittedAt: row.submitted_at,
  }
}

export function transformPreviewSettingsRow(row: PreviewSettingsRow): Omit<PreviewSettings, "selectedImages"> {
  return {
    count: Number(row.count),
    useLatest: Boolean(row.use_latest),
  }
}

export function transformRSVPSettingsRow(row: RSVPSettingsRow): RSVPSettings {
  return {
    enabled: Boolean(row.enabled),
    deadline: row.deadline || undefined,
    customMessage: row.custom_message,
  }
}

export function transformUploadSettingsRow(row: UploadSettingsRow): UploadSettings {
  return {
    enabled: Boolean(row.enabled),
    maxPhotos: Number(row.max_photos),
    message: row.message || undefined,
    scheduleStart: row.schedule_start || undefined,
    scheduleEnd: row.schedule_end || undefined,
  }
}
