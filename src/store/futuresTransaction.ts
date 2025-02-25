import {
  entryFormSchema,
  DEFAULT_ENTRY_VALUES,
  EntryFormValues,
  basisFormSchema,
  BasisFormValues,
} from '@/pages/dashboard/futures-transaction-tool/schemas'
import { FuturesTransactionEntryType } from '@/types/futures-transaction/futures-transaction'
import { z } from 'zod'
import { create } from 'zustand'

const TabEnum = z.enum(['basis', 'entry', 'profit'])
export type Tab = z.infer<typeof TabEnum>

const transactionSchema = z
  .object({
    entry: entryFormSchema,
  })
  .merge(basisFormSchema)

type TransactionValues = z.infer<typeof transactionSchema>

type FuturesTransactionStore = {
  formData: TransactionValues
  setEntryType: (type: FuturesTransactionEntryType) => void
  setBasisFormData: (data: BasisFormValues) => void
  setEntryFormData: (data: EntryFormValues) => void
  tab: Tab
  setTab: (tab: Tab) => void
}

const initialState: TransactionValues = {
  futuresId: '',
  futuresMeta: {
    minPriceTick: 0,
    name: '',
    size: 0,
    commission: 0,
  },
  basis: {
    totalCapital: 0,
    capitalRatio: 0,
    margin: 0,
    maxTradableLots: 0,
    usedMargin: 0,
    riskControl: 0,
    actualTickValue: 0,
    tickValue: 0,
  },
  entry: DEFAULT_ENTRY_VALUES,
}

// Todo: 进行Store设计
export const useFuturesTransactionStore = create<FuturesTransactionStore>(
  (set, get) => ({
    formData: { ...initialState },
    tab: 'entry',
    setTab(tab: Tab) {
      set({
        tab,
      })
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

    resetForm: () => {
      set({
        formData: { ...initialState },
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
  })
)
