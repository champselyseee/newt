import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Button } from '../ui/Button'
import { useCountUp } from '../../lib/useCountUp'
import { WORK_TYPES, WORK_TYPE_ORDER, type WorkType } from '../../lib/workTypes'
import { DEMO_RESULTS } from '../../lib/demo'
import {
  IconArrowRight,
  IconBook,
  IconBolt,
  IconCamera,
  IconCheck,
  IconMail,
  IconPen,
  IconSparkles,
  IconTarget,
  IconUpload,
} from '../../lib/icons'
import type { ToastKind } from '../ui/Toast'
import styles from './CheckPage.module.css'

const WORK_ICONS = { mail: IconMail, pen: IconPen, book: IconBook }

const STATS = [
  { value: 12480, suffix: '', label: 'работ проверено', Icon: IconTarget },
  { value: 96, suffix: '%', label: 'совпадение с экспертом', Icon: IconCheck },
  { value: 60, suffix: ' сек', label: 'средняя проверка', Icon: IconBolt },
  { value: 2, suffix: '', label: 'языка: рус + англ', Icon: IconSparkles },
]

const STEPS = [
  { n: 1, title: 'Выбери тип работы', desc: 'Email, эссе по английскому или сочинение по русскому.' },
  { n: 2, title: 'Вставь текст или фото', desc: 'Напечатай работу или прикрепи скан — распознаем сами.' },
  { n: 3, title: 'Получи разбор', desc: 'Баллы по каждому критерию ЕГЭ и что улучшить.' },
]

export function CheckPage({ onToast }: { onToast: (text: string, kind?: ToastKind) => void }) {
  const reduce = useReducedMotion()
  const [selected, setSelected] = useState<WorkType | null>('essay')
  const [text, setText] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<WorkType | null>(null)
  const checkerRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  function scrollToChecker() {
    checkerRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  function runCheck(demoType?: WorkType) {
    const type = demoType ?? selected
    if (!type) {
      onToast('Сначала выберите тип работы', 'error')
      return
    }
    if (!demoType && text.trim().length < 30) {
      onToast('Добавьте текст работы (это шаблон — можно любой)', 'info')
    }
    setChecking(true)
    setResult(null)
    window.setTimeout(() => {
      setChecking(false)
      setResult(type)
      onToast('Готово! Это демо-разбор — пример вывода', 'success')
      window.setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      }, 80)
    }, 1400)
  }

  return (
    <div>
      {/* ── Геро ── */}
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>
            <IconSparkles size={15} /> Проверка по критериям ЕГЭ
          </span>
          <h1 className={styles.h1}>
            Проверим твоё <span className={styles.markCoral}>эссе</span> и{' '}
            <span className={styles.markIndigo}>сочинение</span> за минуту
          </h1>
          <p className={styles.lead}>
            Загрузи работу по английскому или русскому — получишь баллы по каждому критерию
            и понятные советы, что подтянуть до экзамена.
          </p>
          <div className={styles.heroActions}>
            <Button size="lg" onClick={scrollToChecker} trailing={<IconArrowRight size={20} />}>
              Проверить работу
            </Button>
            <Button size="lg" variant="secondary" onClick={() => runCheck('essay')}>
              Посмотреть пример
            </Button>
          </div>
          <p className={styles.note}>Без регистрации · первая проверка бесплатно</p>
        </div>

        {/* Декоративные «стикеры» */}
        <div className={styles.heroArt} aria-hidden="true">
          <motion.div
            className={`${styles.sticker} ${styles.stickerA}`}
            initial={reduce ? false : { opacity: 0, y: 24, rotate: -10 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.05 }}
          >
            <span className={styles.stickerScore}>11/14</span>
            <span className={styles.stickerCap}>Эссе · English</span>
          </motion.div>
          <motion.div
            className={`${styles.sticker} ${styles.stickerB}`}
            initial={reduce ? false : { opacity: 0, y: 24, rotate: 8 }}
            animate={{ opacity: 1, y: 0, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.15 }}
          >
            <span className={styles.stickerScore}>18/22</span>
            <span className={styles.stickerCap}>Сочинение · Рус</span>
          </motion.div>
          <motion.div
            className={`${styles.sticker} ${styles.stickerC}`}
            initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.25 }}
          >
            <IconCheck size={30} />
          </motion.div>
        </div>
      </section>

      {/* ── Полоса статистики ── */}
      <section className={`container ${styles.statsWrap}`}>
        <div className={styles.stats}>
          {STATS.map((s) => (
            <StatTile key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ── Инструмент проверки ── */}
      <section className={`container ${styles.checkerSection}`} ref={checkerRef}>
        <div className={styles.checkerHead}>
          <h2 className={styles.h2}>Проверить работу</h2>
          <p className={styles.h2sub}>Выбери тип, вставь текст — покажем демо-разбор.</p>
        </div>

        <div className={styles.checkerCard}>
          {/* Шаг 1 — тип работы */}
          <FormStep n={1} title="Тип работы" sub="Что именно проверяем" />
          <div className={styles.typeList}>
            {WORK_TYPE_ORDER.map((type) => {
              const meta = WORK_TYPES[type]
              const Icon = WORK_ICONS[meta.iconKey]
              const isSel = selected === type
              return (
                <button
                  key={type}
                  className={`${styles.typeCard} ${isSel ? styles.typeSel : ''}`}
                  onClick={() => setSelected(type)}
                  aria-pressed={isSel}
                >
                  <span className={styles.typeIcon}>
                    <Icon size={22} />
                  </span>
                  <span className={styles.typeInfo}>
                    <span className={styles.typeTitle}>{meta.title}</span>
                    <span className={styles.typeSub}>{meta.subtitle}</span>
                  </span>
                  <span className={styles.typeCheck}>
                    <IconCheck size={16} />
                  </span>
                </button>
              )
            })}
          </div>

          {/* Шаг 2 — задание (что нужно было выполнить) */}
          <FormStep
            n={2}
            title="Задание"
            sub="Фото или файл с текстом задания"
            style={{ marginTop: 26 }}
          />
          <div className={styles.attachRow}>
            <button
              className={styles.attach}
              onClick={() => onToast('Загрузка фото задания появится в полной версии', 'info')}
            >
              <IconCamera size={18} /> Фото задания
            </button>
            <button
              className={styles.attach}
              onClick={() => onToast('Загрузка файла задания появится в полной версии', 'info')}
            >
              <IconUpload size={18} /> Файл задания
            </button>
          </div>

          {/* Шаг 3 — работа ученика */}
          <FormStep
            n={3}
            title="Работа ученика"
            sub="Текст или фото рукописной работы"
            style={{ marginTop: 26 }}
          />
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Вставь или напечатай работу ученика…"
            rows={6}
            aria-label="Работа ученика — текст"
          />
          <div className={styles.attachRow}>
            <button
              className={styles.attach}
              onClick={() =>
                onToast('Распознавание рукописного текста появится в полной версии', 'info')
              }
            >
              <IconCamera size={18} /> Фото работы (рукопись)
            </button>
          </div>

          <Button
            fullWidth
            size="lg"
            className={styles.submit}
            onClick={() => runCheck()}
            disabled={checking}
            leading={checking ? undefined : <IconCheck size={20} />}
          >
            {checking ? 'Проверяем…' : 'Проверить работу'}
          </Button>
          <p className={styles.disclaimer}>
            Это шаблон интерфейса: проверка демонстрационная, без обращения к серверу.
          </p>
        </div>

        {/* Результат */}
        <div ref={resultRef}>
          <AnimatePresence mode="wait">
            {checking && (
              <motion.div
                key="loading"
                className={styles.resultLoading}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <span className={styles.spinner} aria-hidden="true" />
                <span>Анализируем работу по критериям…</span>
              </motion.div>
            )}
            {!checking && result && <ResultCard key="result" type={result} />}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Как это работает ── */}
      <section className={`container ${styles.steps}`}>
        <h2 className={styles.h2}>Как это работает</h2>
        <div className={styles.stepGrid}>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              className={styles.step}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={styles.stepNum}>{s.n}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

function FormStep({
  n,
  title,
  sub,
  style,
}: {
  n: number
  title: string
  sub: string
  style?: CSSProperties
}) {
  return (
    <div className={styles.formStep} style={style}>
      <span className={styles.formStepNum}>{n}</span>
      <span className={styles.formStepText}>
        <span className={styles.formStepTitle}>{title}</span>
        <span className={styles.formStepSub}>{sub}</span>
      </span>
    </div>
  )
}

function StatTile({
  value,
  suffix,
  label,
  Icon,
}: {
  value: number
  suffix: string
  label: string
  Icon: (p: { size?: number }) => JSX.Element
}) {
  const n = useCountUp(value)
  return (
    <div className={styles.statTile}>
      <span className={styles.statIcon}>
        <Icon size={20} />
      </span>
      <span className={styles.statValue}>
        {n.toLocaleString('ru-RU')}
        {suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

function ResultCard({ type }: { type: WorkType }) {
  const meta = WORK_TYPES[type]
  const res = DEMO_RESULTS[type]
  // Итог и максимум всегда выводим из критериев — так они гарантированно сходятся.
  const total = res.criteria.reduce((s, c) => s + c.score, 0)
  const max = res.criteria.reduce((s, c) => s + c.max, 0)
  const pct = Math.round((total / max) * 100)
  const animated = useCountUp(total, 800)

  return (
    <motion.div
      className={styles.result}
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      <div className={styles.resultTop}>
        <div>
          <span className={styles.resultLabel}>{meta.resultLabel}</span>
          <h3 className={styles.resultTitle}>Разбор готов</h3>
        </div>
        <div className={styles.scoreBadge}>
          <span className={styles.scoreNum}>
            {animated}
            <span className={styles.scoreMax}>/{max}</span>
          </span>
          <span className={styles.scorePct}>{pct}%</span>
        </div>
      </div>

      <p className={styles.resultSummary}>{res.summary}</p>

      <div className={styles.criteria}>
        {res.criteria.map((c, i) => {
          const full = c.score === c.max
          return (
            <motion.div
              key={c.code}
              className={styles.crit}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <span className={`${styles.critCode} ${full ? styles.critFull : ''}`}>{c.code}</span>
              <div className={styles.critBody}>
                <div className={styles.critHead}>
                  <span className={styles.critTitle}>{c.title}</span>
                  <span className={styles.critScore}>
                    {c.score}/{c.max}
                  </span>
                </div>
                <div className={styles.critBar}>
                  <motion.span
                    className={`${styles.critFill} ${full ? styles.fillGood : styles.fillWarn}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.score / c.max) * 100}%` }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <p className={styles.critComment}>{c.comment}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
