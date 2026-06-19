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
import { EXAM_SCALES, chunkRows } from '../../lib/examScales'
import {
  IconArrowRight,
  IconCalendar,
  IconClock,
  IconTarget,
} from '../../lib/icons'
import styles from './CounterPage.module.css'

/* Сколько строк в одной колонке таблицы перевода (длинную шкалу режем на столбцы). */
const ROWS_PER_COLUMN = 14

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

  // Выбранный предмет в таблице разбалловки (переключатель Русский/Английский).
  const [scaleId, setScaleId] = useState(EXAM_SCALES[0].id)
  const scale = EXAM_SCALES.find((s) => s.id === scaleId) ?? EXAM_SCALES[0]
  const columns = chunkRows(scale.rows, ROWS_PER_COLUMN)

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

      {/* Разбалловка: перевод первичных баллов в тестовые (100-балльные) */}
      <section className={styles.scales} aria-labelledby="scales-title">
        <h2 className={styles.h2} id="scales-title">
          Разбалловка ЕГЭ
        </h2>
        <p className={styles.scalesLead}>
          Перевод первичных баллов в тестовые (по 100-балльной шкале). Найди свой
          первичный балл слева — рядом тестовый.
        </p>

        {/* Переключатель предметов */}
        <div className={styles.segmented} role="group" aria-label="Предмет">
          {EXAM_SCALES.map((s) => {
            const active = s.id === scaleId
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={active}
                className={`${styles.segBtn} ${active ? styles.segActive : ''}`}
                onClick={() => setScaleId(s.id)}
              >
                {s.short}
              </button>
            )
          })}
        </div>

        <p className={styles.scaleMeta}>
          <IconArrowRight size={14} /> {scale.subject}: первичный → тестовый (
          {scale.maxPrimaryScore} → {scale.maxTestScore})
        </p>

        <motion.div
          key={scaleId}
          className={styles.scaleGrid}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {columns.map((col, ci) => (
            <table key={ci} className={styles.scaleTable}>
              <thead>
                <tr>
                  <th scope="col">Перв.</th>
                  <th scope="col">Тест</th>
                </tr>
              </thead>
              <tbody>
                {col.map((row) => {
                  const isMax = row.test === scale.maxTestScore
                  return (
                    <tr key={row.primary} className={isMax ? styles.maxRow : ''}>
                      <td>{row.primary}</td>
                      <td className={styles.testCell}>{row.test}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ))}
        </motion.div>
      </section>

      <p className={styles.editHint}>
        Предметы и даты — в файле{' '}
        <code className={styles.code}>src/lib/examDates.ts</code>, таблицы перевода — в{' '}
        <code className={styles.code}>src/data/examScales.json</code>.
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
