/* Разделы сайта и пункты верхней навигации. */

export type Page =
  | 'check'
  | 'knowledge'
  | 'pricing'
  | 'checkout'
  | 'projects'
  | 'counter'
  | 'profile'
  | 'auth'

export interface NavItem {
  id: Page
  label: string
  iconKey: 'check' | 'book' | 'star' | 'grid' | 'calendar' | 'user'
}

/* Основные пункты в шапке (без «Войти» — он отдельной кнопкой справа).
   `checkout` сюда не входит — на него попадают только из потока покупки. */
export const NAV_ITEMS: NavItem[] = [
  { id: 'check', label: 'Проверка', iconKey: 'check' },
  { id: 'knowledge', label: 'База аргументов', iconKey: 'book' },
  { id: 'pricing', label: 'Тарифы', iconKey: 'star' },
  { id: 'projects', label: 'Проекты', iconKey: 'grid' },
  { id: 'counter', label: 'Счётчик ЕГЭ', iconKey: 'calendar' },
  { id: 'profile', label: 'Профиль', iconKey: 'user' },
]
