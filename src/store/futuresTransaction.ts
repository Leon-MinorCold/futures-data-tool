import {
  entryFormSchema,
  DEFAULT_ENTRY_VALUES,
  EntryFormValues,
  basisFormSchema,
  BasisFormValues,
  profitFormSchema,
  ProfitFormValues,
  DEFAULT_PROFIT_FORM_VALUES,
  DEFAULT_BASIS_FORM_VALUES,
} from '@/pages/dashboard/futures-transaction-tool/schemas'
import {
  FuturesTransactionEntryType,
  FuturesTransactionProfitType,
} from '@/types/futures-transaction/futures-transaction'
import { z } from 'zod'
import { create } from 'zustand'

const TabEnum = z.enum(['basis', 'entry', 'profit'])
export type Tab = z.infer<typeof TabEnum>

const transactionStoreSchema = z
  .object({
    entry: entryFormSchema,
    profit: profitFormSchema,
  })
  .merge(basisFormSchema)

export type TransactionStoreValues = z.infer<typeof transactionStoreSchema>

type FuturesTransactionStore = {
  formData: TransactionStoreValues
  tab: Tab
  tabDisabledStatus: Record<Tab, boolean>
  reset: () => void
  setEntryType: (type: FuturesTransactionEntryType) => void
  setBasisFormData: (data: BasisFormValues) => void
  setEntryFormData: (data: EntryFormValues) => void
  setProfitFormData: (data: ProfitFormValues) => void
  setProfitType: (type: FuturesTransactionProfitType) => void
  setTab: (tab: Tab) => void
  setTabDisabledStatus: (tab: Tab, status: boolean) => void
}

const initialState: TransactionStoreValues = {
  ...DEFAULT_BASIS_FORM_VALUES,
  basis: DEFAULT_BASIS_FORM_VALUES.basis,
  entry: DEFAULT_ENTRY_VALUES,
  profit: DEFAULT_PROFIT_FORM_VALUES,
}

export const useFuturesTransactionStore = create<FuturesTransactionStore>(
  (set, get) => ({
    formData: { ...initialState },
    tab: 'basis',
    tabDisabledStatus: {
      basis: true,
      entry: true,
      profit: true,
    },
    setTab(tab: Tab) {
      set({
        tab,
      })
    },
    setTabDisabledStatus(tab: Tab, status: boolean) {
      set((state) => ({
        tabDisabledStatus: {
          ...state.tabDisabledStatus,
          [tab]: status,
        },
      }))
    },

    // 设置基本风险控制数据
    setBasisFormData: (data: BasisFormValues) => {
      set((state) => ({
        formData: {
          ...state.formData,
          futuresId: data.futuresId,
          futuresMeta: data.futuresMeta,
          basis: data.basis,
        },
      }))
    },

    setEntryFormData: (data: EntryFormValues) => {
      set((state) => ({
        formData: {
          ...state.formData,
          entry: {
            ...state.formData.entry,
            ...data,
          },
        },
      }))
    },

    setProfitFormData: (data: ProfitFormValues) => {
      set((state) => ({
        formData: {
          ...state.formData,
          profit: {
            ...state.formData.profit,
            ...data,
          },
        },
      }))
    },

    reset: () => {
      set({
        formData: { ...initialState },
        tab: 'basis',
        tabDisabledStatus: {
          basis: true,
          entry: true,
          profit: true,
        },
      })
    },

    setEntryType: (type: FuturesTransactionEntryType) => {
      set((state) => ({
        formData: {
          ...state.formData,
          entry: {
            ...state.formData.entry,
            entryType: type,
          },
        },
      }))
    },

    setProfitType(type: FuturesTransactionProfitType) {
      set((state) => ({
        formData: {
          ...state.formData,
          entry: {
            ...state.formData.entry,
            profitType: type,
          },
        },
      }))
    },
  })
)
