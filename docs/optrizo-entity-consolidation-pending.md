# Optrizo entity consolidation — pending

The production Optrizo repository was not available during the kirkorino.com entity-consolidation pass. No Optrizo source, deployment, or production content was modified.

## Structured data change still required

Extend the existing Organization entity at `https://optrizo.com/#organization`; do not create a second Organization entity.

Add:

```json
"founder": {
  "@id": "https://kirkorino.com/#person"
}
```

## Recommended visible About-page change

Add the following sentence to the existing About-page company copy without creating a new section or changing the layout:

> Founded by Kirk Orino.

This work remains pending until the actual production repository is available.
