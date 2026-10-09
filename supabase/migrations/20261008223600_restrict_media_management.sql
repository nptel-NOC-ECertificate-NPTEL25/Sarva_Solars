drop policy if exists "Authenticated users can upload media" on storage.objects;
drop policy if exists "Authenticated users can update media" on storage.objects;
drop policy if exists "Authenticated users can delete media" on storage.objects;
drop policy if exists "Admins can upload media" on storage.objects;
drop policy if exists "Admins can update media" on storage.objects;
drop policy if exists "Admins can delete media" on storage.objects;

create policy "Admins can upload media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media'
  and (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can update media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'media'
  and (select app_private.current_user_role()) = 'Admin'
)
with check (
  bucket_id = 'media'
  and (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can delete media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'media'
  and (select app_private.current_user_role()) = 'Admin'
);
