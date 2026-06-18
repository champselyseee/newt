import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { NAV_ITEMS, type Page } from '../lib/nav'
import {
  IconBook,
  IconCalendar,
  IconCheck,
  IconClose,
  IconGrid,
  IconKey,
  IconMenu,
  IconStar,
  IconUser,
} from '../lib/icons'
import styles from './Header.module.css'

const NAV_ICONS = {
  check: IconCheck,
  book: IconBook,
  star: IconStar,
  grid: IconGrid,
  calendar: IconCalendar,
  user: IconUser,
}

/* «Профиль» выводим отдельным аккаунт-блоком (см. ниже), остальные пункты —
   обычным рядом. */
const SECTION_ITEMS = NAV_ITEMS.filter((i) => i.id !== 'profile')

export function Header({
  current,
  onNavigate,
  isAuthed,
}: {
  current: Page
  onNavigate: (p: Page) => void
  isAuthed: boolean
}) {
  const [open, setOpen] = useState(false)

  function go(p: Page) {
    onNavigate(p)
    setOpen(false)
  }

  const profileActive = current === 'profile'

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Логотип */}
        <button className={styles.brand} onClick={() => go('check')} aria-label="На главную">
          <span className={styles.mark} aria-hidden="true">
            <IconCheck size={20} />
          </span>
          <span className={styles.brandText}>
            ЕГЭ<span className={styles.brandAccent}>-чекер</span>
          </span>
        </button>

        {/* Десктоп-навигация */}
        <nav className={styles.nav} aria-label="Основная навигация">
          {/* Аккаунт: «Профиль» + сегмент «Войти» (пока не авторизован). */}
          {isAuthed ? (
            <button
              className={`${styles.navItem} ${profileActive ? styles.active : ''}`}
              onClick={() => go('profile')}
              aria-current={profileActive ? 'page' : undefined}
            >
              <span className={styles.navIcon}>
                <IconUser size={18} />
              </span>
              <span className={styles.navLabel}>Профиль</span>
            </button>
          ) : (
            <div className={styles.account}>
              <button
                className={`${styles.accountBtn} ${styles.accountProfile} ${
                  profileActive ? styles.accountActive : ''
                }`}
                onClick={() => go('profile')}
                aria-current={profileActive ? 'page' : undefined}
              >
                <IconUser size={18} />
                <span>Профиль</span>
              </button>
              <button
                className={`${styles.accountBtn} ${styles.accountLogin}`}
                onClick={() => go('auth')}
              >
                <IconKey size={18} />
                <span>Войти</span>
              </button>
            </div>
          )}

          {/* Разделы */}
          {SECTION_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.iconKey]
            const active = current === item.id
            return (
              <button
                key={item.id}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
                onClick={() => go(item.id)}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className={styles.pill}
                    transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                  />
                )}
                <span className={styles.navIcon}>
                  <Icon size={18} />
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Кнопка мобильного меню */}
        <div className={styles.right}>
          <button
            className={styles.burger}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          >
            {open ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Мобильное выпадающее меню */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`container ${styles.mobileInner}`}>
              {/* Аккаунт: «Профиль» + сегмент «Войти». */}
              {isAuthed ? (
                <button
                  className={`${styles.mobileItem} ${profileActive ? styles.mobileActive : ''}`}
                  onClick={() => go('profile')}
                  aria-current={profileActive ? 'page' : undefined}
                >
                  <IconUser size={20} />
                  <span>Профиль</span>
                </button>
              ) : (
                <div className={styles.mAccount}>
                  <button
                    className={`${styles.mAccountProfile} ${
                      profileActive ? styles.mAccountActive : ''
                    }`}
                    onClick={() => go('profile')}
                    aria-current={profileActive ? 'page' : undefined}
                  >
                    <IconUser size={20} />
                    <span>Профиль</span>
                  </button>
                  <button className={styles.mAccountLogin} onClick={() => go('auth')}>
                    <IconKey size={20} />
                    <span>Войти</span>
                  </button>
                </div>
              )}

              {/* Разделы */}
              {SECTION_ITEMS.map((item) => {
                const Icon = NAV_ICONS[item.iconKey]
                const active = current === item.id
                return (
                  <button
                    key={item.id}
                    className={`${styles.mobileItem} ${active ? styles.mobileActive : ''}`}
                    onClick={() => go(item.id)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
