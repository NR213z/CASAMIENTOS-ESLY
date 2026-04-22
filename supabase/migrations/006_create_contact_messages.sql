-- Create contact_messages table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_read ON contact_messages(read);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can submit a contact message (public form)
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Only authenticated users can view messages
CREATE POLICY "Only authenticated can view contact messages"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policy: Only authenticated users can update (mark as read)
CREATE POLICY "Only authenticated can update contact messages"
  ON contact_messages FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS Policy: Only authenticated users can delete
CREATE POLICY "Only authenticated can delete contact messages"
  ON contact_messages FOR DELETE
  USING (auth.role() = 'authenticated');
