<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS

- Admin access is checked via `public.has_role` + `user_roles`, granted by trigger for the owner's verified email; never trust client state for roles.
- Public briefing form inserts directly from the browser under an insert-only RLS policy; DB CHECK constraints are the server-side validation.
