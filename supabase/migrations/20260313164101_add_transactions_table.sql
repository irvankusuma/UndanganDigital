-- Add plan columns to profiles if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'plan') THEN
        ALTER TABLE profiles ADD COLUMN plan text DEFAULT 'free';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'plan_expires_at') THEN
        ALTER TABLE profiles ADD COLUMN plan_expires_at timestamptz;
    END IF;
END $$;

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL,
    proof_url text, -- For manual bank transfer/QRIS proof uploads
    status text DEFAULT 'pending' NOT NULL, -- pending, paid, rejected
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS) for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own transactions
CREATE POLICY "Users can insert own transactions"
ON transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for payment proofs if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment_proofs', 'payment_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment proofs (authenticated users can upload to their own folder)
CREATE POLICY "Users can upload their own payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'payment_proofs' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Public can read payment proofs (needed for admin dashboard display)
CREATE POLICY "Public can view payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment_proofs');
