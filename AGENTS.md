# Architecture rules

- Keep the quiz view security-invoker and read its safe projection through an authenticated security-definer function; the base table stays blocked and answers are returned only by validation.
- Select quiz sessions by shuffling the complete eligible bank before limiting it; never substitute sample questions when a real question query fails.