create table if not exists public.custody_records (
  id text primary key,
  record_type text not null check (record_type in ('vault', 'shipment')),
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  constraint custody_records_payload_id_matches_id
    check (payload ->> 'id' = id),
  constraint custody_records_payload_type_matches_record_type
    check (payload ->> 'type' = record_type)
);

alter table public.custody_records enable row level security;
