---
paths:
  - app/Http/Middleware/EnsureUserNotBanned.php
---

# Middleware

## Ban enforcement via web middleware + Fortify authenticateUsing
Ban enforcement is two-layered: EnsureUserNotBanned is appended to the global web middleware list (logout + redirect to login with a generic 'account suspended' error for any active session), and Fortify::authenticateUsing in FortifyServiceProvider rejects banned users at login with the generic credentials error (never discloses ban status). User model: banned_at datetime cast + isBanned(); UserFactory has admin()/banned() states.
