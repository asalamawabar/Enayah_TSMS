import { create } from 'zustand'
import type { NavPanel, ModalType } from '@/types'

interface UIState {
  panel: NavPanel
  sidebarCollapsed: boolean
  modal: { type: ModalType; editId?: number } | null
  setPanel: (p: NavPanel) => void
  toggleSidebar: () => void
  openModal: (type: NonNullable<ModalType>, editId?: number) => void
  closeModal: () => void
}

export const useUI = create<UIState>(set => ({
  panel: 'dash',
  sidebarCollapsed: false,
  modal: null,
  setPanel: panel => set({ panel }),
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  openModal: (type, editId) => set({ modal: { type, editId } }),
  closeModal: () => set({ modal: null }),
}))
