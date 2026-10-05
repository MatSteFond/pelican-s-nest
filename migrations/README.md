# Database changes

This folder is empty because a new app has no database tables yet.

Each change to the database is one numbered `.sql` file in this folder, for
example `001_create_notes.sql`, then `002_add_tags.sql`. The files run once
each, in name order, every time the app starts: in your preview and on the
server.

To change the database, add a new file with the next number. Never edit a
file that has already run.
