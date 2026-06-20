/* Демо-результаты проверки. На сайте-шаблоне обращения к серверу нет —
   кнопка «Проверить» / «Посмотреть пример» показывает эти заготовки, чтобы
   продемонстрировать вид разбора (как в реальном фронте бота).

   ВАЖНО: это ВРЕМЕННЫЕ примеры. Позже текст работ и их разметку ошибок
   заменим на готовые — структура (StructuredResult) при этом не меняется.

   Как устроен один разбор (StructuredResult):
   - score / max_score — итоговый балл и максимум;
   - segments[]        — текст работы кусочками; у каждого кусочка тип ошибки
                         (e), которым он подсвечивается. Сумма кусочков = весь текст;
   - criteria[]        — баллы по критериям ЕГЭ + число ошибок и комментарий;
   - summary           — общий вывод и рекомендации. */

import type { WorkType } from './workTypes'
import type { StructuredResult } from './result'

export const DEMO_RESULTS: Record<WorkType, StructuredResult> = {
  // ── Английский email (задание 37), максимум 6 ──
  // Реальный пример: письмо ученицы Camille в ответ на письмо Oscar (тема Food).
  // Текст — оригинал ученицы с ошибками; разметка и оценка — из вывода бота.
  email: {
    task: {
      label: 'Задание 37 · Письмо',
      from: 'Oscar@mail.uk',
      subject: 'Food',
      text: '…My mom decided that now we have to eat only healthy food, and I totally agree with her! What do you eat for breakfast? What is your favourite food? What do you think about fast food?\nYesterday I started reading a book about happiness…',
    },
    score: 5,
    max_score: 6,
    segments: [
      {
        t: 'Hi Oscar!\n\nThank you for your email. I’m always happy to get emails from you.\n\nIn your email you asked me some questions. Now I’ll answer them with pleasure. Actually, I like to eat ',
        e: 'none',
      },
      { t: 'a porridge', e: 'grammar' },
      {
        t: ', it’s my daily breakfast. To be honest, I like Italian food so much. I’d say that spaghetti is my favourite meal. As for me, fast food is ',
        e: 'none',
      },
      { t: 'unhealthy and not delicious food', e: 'speech' },
      {
        t: '.\n\nI’d like to know more about the book that you started reading. Tell me, who is the author of this book? What is ',
        e: 'none',
      },
      { t: 'name', e: 'grammar' },
      {
        t: ' of this book? How many pages are there in this book?\n\nThat’s all for now. Drop me a line.\n\nYours,\nCamille',
        e: 'none',
      },
    ],
    criteria: [
      { code: 'К1', score: 2, max: 2, errors: 0, comment: 'Все 6 аспектов выполнены: три ответа на вопросы (завтрак — porridge; любимая еда — спагетти; фастфуд — нездоровая еда) и три вопроса о книге; нормы вежливости и неофициальный стиль соблюдены (Hi Oscar! / Yours, Camille).' },
      { code: 'К2', score: 2, max: 2, errors: 0, comment: 'Текст логично структурирован: приветствие → ответы с дискурсными маркерами (Actually, To be honest, As for me) → вопросы → завершение; абзацное членение и связность соблюдены.' },
      { code: 'К3', score: 1, max: 2, errors: 3, comment: 'Грамматические ошибки: «a porridge» (неисчисляемое существительное без артикля) и «What is name» (пропущен артикль the). Речевая ошибка: «unhealthy and not delicious food» — повтор слова food, неудачная конструкция.' },
    ],
    summary:
      'Хорошо: письмо полностью решает коммуникативную задачу, все шесть аспектов К1 закрыты, текст логично организован, стиль неофициальный. Три причины потери балла: 1) «a porridge» — porridge неисчисляемо, артикль a недопустим; 2) «What is name of this book?» — пропущен артикль the; 3) «unhealthy and not delicious food» — слово food повторяется, лучше перефразировать («unhealthy and not very tasty»). Чтобы выйти на 6/6 — исправить эти три ошибки.',
  },

  // ── Английское эссе (задание 38), максимум 14 ──
  essay: {
    score: 11,
    max_score: 14,
    segments: [
      {
        t: 'Nowadays many people believe that studying abroad is the best way to get a good education. In my opinion, this statement is partly true.\n\nOn the one hand, studying in a foreign country gives students a unique experience. They can improve their language skills and become more independent. This is a very ',
        e: 'none',
      },
      { t: 'important', e: 'speech' },
      { t: ' advantage.\n\n', e: 'none' },
      { t: 'However', e: 'punctuation' },
      {
        t: ' some people think that education at home is better. They argue that it is cheaper and that students feel more comfortable. ',
        e: 'none',
      },
      { t: 'In a modern world', e: 'grammar' },
      {
        t: ', online courses also make local education stronger.\n\nIn conclusion, I think that studying abroad has more advantages, although it is expensive. It is ',
        e: 'none',
      },
      { t: 'a important', e: 'grammar' },
      { t: ' step for a future career.', e: 'none' },
    ],
    criteria: [
      { code: 'К1', score: 3, max: 3, errors: 0, comment: 'Решение коммуникативной задачи: тема раскрыта, формат opinion essay соблюдён.' },
      { code: 'К2', score: 3, max: 3, errors: 0, comment: 'Организация текста: структура и логические связки выдержаны.' },
      { code: 'К3', score: 2, max: 3, errors: 1, comment: 'Лексика: повтор слова «important» — стоит варьировать словарь.' },
      { code: 'К4', score: 2, max: 3, errors: 2, comment: 'Грамматика: ошибки в артиклях («In a modern world», «a important»).' },
      { code: 'К5', score: 1, max: 2, errors: 1, comment: 'Орфография и пунктуация: пропущена запятая после вводного «However».' },
    ],
    summary:
      'Хорошее эссе с чёткой позицией и структурой. Зоны роста — лексическое разнообразие, артикли и пунктуация при вводных словах.',
  },

  // ── Русское сочинение (задание 27), максимум 22 ──
  composition: {
    score: 18,
    max_score: 22,
    segments: [
      {
        t: 'В предложенном тексте автор поднимает важную проблему милосердия. Размышляя над ней, писатель ',
        e: 'none',
      },
      { t: 'расскзывает', e: 'spelling' },
      { t: ' историю о простом человеке, который, ', e: 'none' },
      { t: 'конечно', e: 'punctuation' },
      {
        t: ' помог незнакомцу в беде.\n\nЭтот поступок показывает, что доброта живёт в каждом человеке. ',
        e: 'none',
      },
      { t: 'Человек', e: 'speech' },
      {
        t: ' способен на сострадание даже тогда, когда ему самому тяжело.\n\nАвторская позиция выражена ясно: милосердие делает нас людьми. Я полностью согласен с этим мнением, потому что без сострадания общество не может существовать.',
        e: 'none',
      },
    ],
    criteria: [
      { code: 'К1', score: 1, max: 1, errors: 0, comment: 'Проблема исходного текста сформулирована верно.' },
      { code: 'К2', score: 4, max: 5, errors: 1, comment: 'Комментарий: оба примера-иллюстрации есть, но связь между ними пояснена слабо.' },
      { code: 'К3', score: 1, max: 1, errors: 0, comment: 'Позиция автора отражена корректно.' },
      { code: 'К4', score: 1, max: 1, errors: 0, comment: 'Отношение к позиции автора заявлено и обосновано.' },
      { code: 'К5', score: 2, max: 2, errors: 0, comment: 'Логичность и связность: текст логичен, абзацное членение выдержано.' },
      { code: 'К6–К12', score: 9, max: 12, errors: 3, comment: 'Грамотность: опечатка «расскзывает», пропущена запятая при вводном «конечно», повтор слова «человек».' },
    ],
    summary:
      'Сочинение раскрывает проблему и авторскую позицию, своё мнение обосновано. Зоны роста: усилить связь между примерами в комментарии, убрать речевые повторы и проверить пунктуацию при вводных словах.',
  },
}
