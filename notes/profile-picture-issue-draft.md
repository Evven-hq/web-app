# Profile picture display uses initials in the app shell

## Problem
The authenticated app layout currently shows only user initials in the sidebar user card, even when the user has a profile picture saved. The profile page already supports a `profile_picture` URL, but that image is not used in the main app shell.

## Current behavior
- `app/(app)/layout.tsx` renders a circular initials badge from `user.name` in the sidebar user section.
- The layout does not check `user.profile_picture` or render an `<img>` / `next/image` avatar.
- `app/(app)/profile/page.tsx` already reads and saves `profile_picture` through `updateCurrentUser({ name, profile_picture })`.
- Google sign-in currently initializes auth with only the credential token, so the app may not always receive a profile image from the provider flow.

## Suggested fix
- Update the app shell/sidebar to render `user.profile_picture` when available.
- Keep initials as the fallback when no image exists or the image fails to load.
- Make the avatar logic reusable so the same display component can be used in the sidebar, profile page, and anywhere else the user avatar appears.
- Optionally normalize the saved profile image field so the frontend always reads the same property.

## Acceptance criteria
- Sidebar shows the profile picture when `user.profile_picture` exists.
- Initials are still shown as fallback.
- Profile page and sidebar use the same avatar behavior.
- No layout shift or broken image UI when the URL is missing or invalid.

## Notes
Relevant files:
- `app/(app)/layout.tsx`
- `app/(app)/profile/page.tsx`
- `components/auth/GoogleSignInButton.tsx`
- auth store / user model
