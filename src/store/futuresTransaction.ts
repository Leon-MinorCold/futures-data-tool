import { BasisFormValues } from '@/pages/dashboard/futures-transaction-tool/BasisForm'
import { create } from 'zustand'

// Todo: formData要改成完全形式, 目前暂时用basistype
type FuturesTransactionStore = {
  formData: BasisFormValues
  setBasisFormData: (data: BasisFormValues) => void
}

const initialState: BasisFormValues = {
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
}

// Todo: 进行Store设计
export const useFuturesTransactionStore = create<FuturesTransactionStore>(
  (set, get) => ({
    formData: { ...initialState },

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

    resetForm: () => {
      set({
        formData: { ...initialState },
      })
    },
  })
)
