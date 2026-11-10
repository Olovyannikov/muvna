import { reflect } from '@effector/reflect';

import { SiteModel, type NavSection } from '@/entities/site';

import type { Site } from '@/shared/api';
import { useT } from '@/shared/i18n';
import { AppLink, Container, LinkIcon, TelegramIcon, VkIcon, YoutubeIcon } from '@/shared/ui';

import styles from './Footer.module.css';

const socialIcons = { telegram: TelegramIcon, vk: VkIcon, youtube: YoutubeIcon, other: LinkIcon };
const socialNames = { telegram: 'Telegram', vk: 'VK', youtube: 'YouTube', other: 'Link' };

const FooterView = ({ site, sections }: { site: Site | null; sections: NavSection[] | null }) => {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <p className={styles.brand}>MUVNA</p>
          <nav className={styles.catalog} aria-label={t('footer.catalog')}>
            {sections?.map((section) => (
              <div key={section.id}>
                <p className={styles.heading}>{section.title}</p>
                <ul role="list" className={styles.list}>
                  {section.categories.map((category) => (
                    <li key={category.id}>
                      <AppLink href={category.href}>{category.title}</AppLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.info}>
          {site?.about && (
            <section>
              <h2 className={styles.heading}>{t('footer.about')}</h2>
              <p className={styles.text}>{site.about}</p>
            </section>
          )}
          <section>
            <h2 className={styles.heading}>{t('footer.address')}</h2>
            <address className={styles.text}>
              {site?.address && <p>{site.address}</p>}
              {site?.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
              {site?.phone && <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>{site.phone}</a>}
            </address>
          </section>
          {site?.clientService && (
            <section>
              <h2 className={styles.heading}>{t('footer.clientService')}</h2>
              <p className={styles.text}>{site.clientService}</p>
            </section>
          )}
          {site?.socials?.length ? (
            <section>
              <h2 className={styles.heading}>{t('footer.socials')}</h2>
              <ul role="list" className={styles.socials}>
                {site.socials.map((social) => {
                  const Icon = socialIcons[social.network];
                  return (
                    <li key={social.id ?? social.url}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={socialNames[social.network]}
                      >
                        <Icon />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </div>

        <div className={styles.bottom}>
          <p>{site?.copyright || `© ${year} ${site?.companyName ?? 'MUVNA'}`}</p>
          <ul role="list" className={styles.legal}>
            {site?.footerLinks?.map((link) => (
              <li key={link.id ?? link.url}>
                <AppLink href={link.url}>{link.label}</AppLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
};

export const Footer = reflect({ view: FooterView, bind: SiteModel.viewModel });
