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
  // Реальный пример: эссе по pie-chart «What field do children in Zetland want to work in?».
  // Текст — работа ученика с ошибками; разметка и оценка — из разбора (EGE_Task38_review).
  essay: {
    task: {
      label: 'Задание 38 · Эссе',
      text: 'Imagine that you are doing a project on what field children in Zetland want to work in. You have found some data on the subject, the results of the survey (see the pie-chart below). Comment on the data in the pie-chart and give your personal opinion on the subject of the project. Write 200–250 words.\n\nДанные опроса (pie-chart): Medicine — 33%, Arts and design — 31%, Police and security — 15%, IT — 12%, Sport — 9%.',
    },
    score: 11,
    max_score: 14,
    segments: [
      {
        t: 'It is widely known that children have a lot of fields they want to work in. While doing a project about what field children in Zetland want to work in, I have found ',
        e: 'none',
      },
      { t: 'a table', e: 'factual' },
      { t: ' containing some ', e: 'none' },
      { t: 'offical', e: 'spelling' },
      { t: ' data.\n\nIf we look at ', e: 'none' },
      { t: 'the table', e: 'factual' },
      { t: ' we can see that ', e: 'none' },
      { t: 'majority', e: 'grammar' },
      {
        t: ' of children want to work in medicine (33%). The least popular answer is sport (9%).\n\nLooking at the details, we can see that ',
        e: 'none',
      },
      { t: 'number', e: 'grammar' },
      {
        t: ' of children who chose police and security (15%) is only six percent more than ',
        e: 'none',
      },
      { t: 'number', e: 'grammar' },
      {
        t: ' of children who chose sport (9%). I think it is related to children’s opinion that, if you become a policeman, you will be cooler than others. Also we can see that ',
        e: 'none',
      },
      { t: 'number', e: 'grammar' },
      { t: ' of answers medicine (33%) is almost 3 times more than ', e: 'none' },
      { t: 'number', e: 'grammar' },
      {
        t: ' of answers IT (12%). In my opinion it is due to the fact that children want to help other people and save lives more than doing ',
        e: 'none',
      },
      { t: 'a monotonous computer work', e: 'grammar' },
      {
        t: '.\n\nThere are some problems that one can face dreaming of a profession in one’s childhood. One of these problems is the fact that childhood dream job ',
        e: 'none',
      },
      { t: 'may not be promising and do not have', e: 'grammar' },
      {
        t: ' a good career ladder or salary. To solve this problem, I think people should find another good job and do their childhood dream job as a hobby. Unfortunately it does not work with all jobs but you still can do sport, IT or arts and design as a hobby.\n\nTo conclude, I think it is really important to have ',
        e: 'none',
      },
      { t: 'dream job', e: 'grammar' },
      {
        t: ' for children, because it becomes their first goal and teaches them to achieve their aims.',
        e: 'none',
      },
    ],
    criteria: [
      { code: 'К1', score: 2, max: 3, errors: 1, comment: 'Решение задачи: все 5 пунктов плана раскрыты, объём в норме. Минус — pie-chart назван «table» (фактическая ошибка).' },
      { code: 'К2', score: 3, max: 3, errors: 0, comment: 'Организация: логичные абзацы и средства связи (While, Also, In my opinion, To conclude), структура по плану.' },
      { code: 'К3', score: 2, max: 3, errors: 2, comment: 'Лексика: хороший запас (promising, career ladder), но ошибки артиклей — «a computer work», «have dream job».' },
      { code: 'К4', score: 2, max: 3, errors: 2, comment: 'Грамматика: «number of» без артикля the; «may not be… and do not have» — нарушено согласование модала.' },
      { code: 'К5', score: 2, max: 2, errors: 0, comment: 'Орфография и пунктуация: серьёзных нарушений нет, лишь опечатка «offical».' },
    ],
    summary:
      'Зрелое эссе: план соблюдён, лексика выше среднего, чёткая структура. Три зоны роста: 1) «table» → «pie-chart»; 2) артикли при неисчисляемых и перед number/majority; 3) согласование «may not be… or have». Исправив их — 13–14/14.',
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
