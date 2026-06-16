import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  countdownParts,
  examViews,
  formatExamDate,
  formatWeekday,
  pluralDays,
} from '../../lib/examDates'
import { useCountUp } from '../../lib/useCountUp'
import { IconCalendar, IconClock, IconTarget } from '../../lib/icons'
import styles from './CounterPage.module.css'

/* Горизонт прогресс-полосы: считаем, какую часть «последних 120 дней» уже прошли. */
const HORIZON_DAYS = 120

export function CounterPage() {
  const reduce = useReducedMotion()
  // Тикаем раз в секунду, чтобы часы/минуты/секунды шли вживую.
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const views = examViews(now)
  const nearest = views[0]
  const parts = countdownParts(nearest.date, now)
  const bigDays = useCountUp(parts.days, 900)

  const progress = Math.max(0, Math.min(1, 1 - parts.days / HORIZON_DAYS))

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>
          <IconCalendar size={15} /> Счётчик до ЕГЭ
        </span>
        <h1 className={styles.h1}>Сколько осталось до экзаменов</h1>
        <p className={styles.lead}>
          Отсчёт идёт до ближайшего экзамена. Даты в этом шаблоне — примерные,
          их легко поменять.
        </p>
      </div>

      {/* Большой счётчик ближайшего экзамена */}
      <motion.div
        className={styles.bigCard}
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      >
        <div className={styles.bigTop}>
          <span className={styles.nearestTag}>
            <IconTarget size={15} /> Ближайший экзамен
          </span>
          <span className={styles.bigSubject}>{nearest.exam.subject}</span>
        </div>

        <div className={styles.bigNumberWrap}>
          <span className={styles.bigNumber}>{bigDays}</span>
          <span className={styles.bigUnit}>{pluralDays(parts.days)}</span>
        </div>

        <div className={styles.bigDate}>
          <IconCalendar size={17} />
          <span>
            {formatWeekday(nearest.date)}, {formatExamDate(nearest.date)}
          </span>
        </div>

        {/* Живые часы/минуты/секунды */}
        <div className={styles.clock}>
          <ClockTile value={parts.hours} label="часов" />
          <span className={styles.colon}>:</span>
          <ClockTile value={parts.minutes} label="минут" />
          <span className={styles.colon}>:</span>
          <ClockTile value={parts.seconds} label="секунд" />
        </div>

        <div className={styles.progress} aria-hidden="true">
          <motion.span
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className={styles.progressNote}>
          <IconClock size={14} /> Финишная прямая ближе, чем кажется
        </p>
      </motion.div>

      {/* Карточки предметов */}
      <h2 className={styles.h2}>Все предметы</h2>
      <div className={styles.grid}>
        {views.map((v, i) => {
          const isNearest = v.exam.id === nearest.exam.id
          const p = Math.max(0, Math.min(1, 1 - v.days / HORIZON_DAYS))
          return (
            <motion.div
              key={v.exam.id}
              className={`${styles.subjectCard} ${isNearest ? styles.subjectHot : ''}`}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.subjectHead}>
                <span className={styles.subjectName}>{v.exam.subject}</span>
                {isNearest && <span className={styles.hotBadge}>Скоро</span>}
              </div>
              <div className={styles.subjectDays}>
                <span className={styles.subjectDaysNum}>{v.days}</span>
                <span className={styles.subjectDaysUnit}>{pluralDays(v.days)}</span>
              </div>
              <div className={styles.subjectDate}>
                <IconCalendar size={15} /> {formatExamDate(v.date)}
              </div>
              <div className={styles.subjectBar} aria-hidden="true">
                <motion.span
                  className={styles.subjectFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${p * 100}%` }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      <p className={styles.editHint}>
        Предметы и даты задаются в файле{' '}
        <code className={styles.code}>src/lib/examDates.ts</code> — меняй в одну строку.
      </p>
    </div>
  )
}

function ClockTile({ value, label }: { value: number; label: string }) {
  return (
    <span className={styles.clockTile}>
      <span className={styles.clockNum}>{String(value).padStart(2, '0')}</span>
      <span className={styles.clockLabel}>{label}</span>
    </span>
  )
}
