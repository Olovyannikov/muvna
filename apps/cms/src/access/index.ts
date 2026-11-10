import type { Access, FieldAccess } from 'payload';

export const anyone: Access = () => true;

export const authenticated: Access = ({ req }) => Boolean(req.user);

export const authenticatedField: FieldAccess = ({ req }) => Boolean(req.user);

/** Гости видят только опубликованные версии, редакторы — ещё и черновики (для превью). */
export const publishedOrAuthenticated: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } };
