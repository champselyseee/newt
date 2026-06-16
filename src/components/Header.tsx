import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { NAV_ITEMS, type Page } from '../lib/nav'
import { orderedExamViews, pluralDays } from '../lib/examDates'
import {
  IconBolt,
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

/* Оба предмета (Рус, Англ) для счётчика в шапке. Обновляем раз в минуту. */
function useExams() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60000)
    return () => window.clearInterval(id)
  }, [])
  return orderedExamViews(now)
}

const NAV_ICONS = {
  check: IconCheck,
  book: IconBook,
  star: IconStar,
  grid: IconGrid,
  calendar: IconCalendar,
  user: IconUser,
}

export function Header({
  current,
  onNavigate,
  balance,
}: {
  current: Page
  onNavigate: (p: Page) => void
  balance: number
}) {
  const [open, setOpen] = useState(false)
  const exams = useExams()

  function go(p: Page) {
    onNavigate(p)
    setOpen(false)
  }

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
          {NAV_ITEMS.map((item) => {
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

        <div className={styles.right}>
          {/* Счётчик до ЕГЭ: оба предмета */}
          <button
            className={styles.counter}
            onClick={() => go('counter')}
            aria-label={`До ЕГЭ: ${exams
              .map((e) => `${e.exam.shortName} ${e.days} ${pluralDays(e.days)}`)
              .join(', ')}`}
          >
            <span className={styles.counterHead}>
              <IconCalendar size={15} />
              <span>До ЕГЭ</span>
            </span>
            <span className={styles.counterRows}>
              {exams.map((e) => (
                <span key={e.exam.id} className={styles.counterRow}>
                  <span className={styles.counterAbbr}>{e.exam.abbr}</span> —{' '}
                  <b>{e.days}</b> {pluralDays(e.days)}
                </span>
              ))}
            </span>
          </button>

          {/* Остаток проверок — ведёт на тарифы */}
          <button
            className={styles.balance}
            onClick={() => go('pricing')}
            aria-label={`Осталось ${balance} проверок — открыть тарифы`}
          >
            <IconBolt size={16} />
            <b>{balance}</b>
          </button>

          <button className={styles.login} onClick={() => go('auth')}>
            <IconKey size={18} />
            <span>Войти</span>
          </button>

          {/* Кнопка мобильного меню */}
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
              <button
                className={`${styles.mobileItem} ${styles.mobileCounter}`}
                onClick={() => go('counter')}
              >
                <IconCalendar size={20} />
                <span>
                  До ЕГЭ:{' '}
                  {exams
                    .map((e) => `${e.exam.abbr} — ${e.days} ${pluralDays(e.days)}`)
                    .join(', ')}
                </span>
              </button>
              <button className={styles.mobileItem} onClick={() => go('pricing')}>
                <IconBolt size={20} />
                <span>Осталось проверок: {balance}</span>
              </button>
              {NAV_ITEMS.map((item) => {
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
              <button
                className={`${styles.mobileItem} ${styles.mobileLogin}`}
                onClick={() => go('auth')}
              >
                <IconKey size={20} />
                <span>Войти</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
