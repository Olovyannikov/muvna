import { useT } from '@/shared/i18n';
import { ButtonLink, ErrorState } from '@/shared/ui';

export const NotFoundPage = () => {
  const t = useT();
  return (
    <ErrorState code="404" title={t('errors.notFoundTitle')} text={t('errors.notFoundText')}>
      <ButtonLink href="/">{t('errors.toHome')}</ButtonLink>
    </ErrorState>
  );
};
