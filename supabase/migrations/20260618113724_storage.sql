insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('simplify', 'simplify', true, 5242880, ARRAY['image/*']);

create policy "Authenticated users can view their private files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'simplify'
  and (storage.foldername(name))[1] = 'private'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Authenticated users can upload to their private folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'simplify'
  and (storage.foldername(name))[1] = 'private'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Authenticated users can update their private files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'simplify'
  and (storage.foldername(name))[1] = 'private'
  and (storage.foldername(name))[2] = auth.uid()::text
)
with check (
  bucket_id = 'simplify'
  and (storage.foldername(name))[1] = 'private'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Authenticated users can delete their private files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'simplify'
  and (storage.foldername(name))[1] = 'private'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Public can view public files"
on storage.objects
for select
to public
using (
  bucket_id = 'simplify'
  and (storage.foldername(name))[1] != 'private'
);
