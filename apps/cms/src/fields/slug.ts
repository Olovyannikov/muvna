import { slugField } from 'payload';

import { slugify } from '../lib/slugify';

export const slug = (useAsSlug = 'title') =>
  slugField({
    useAsSlug,
    slugify: ({ valueToSlugify }) => slugify(String(valueToSlugify ?? '')),
  });
