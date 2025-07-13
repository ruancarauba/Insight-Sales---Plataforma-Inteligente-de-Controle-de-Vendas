"use client"

// Inspirado na biblioteca react-hot-toast
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const LIMITE_TOAST = 1
const ATRASO_REMOCAO_TOAST = 1000000

type ToastType = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const tiposAcao = {
  ADICIONAR_TOAST: "ADD_TOAST",
  ATUALIZAR_TOAST: "UPDATE_TOAST",
  FECHAR_TOAST: "DISMISS_TOAST",
  REMOVER_TOAST: "REMOVE_TOAST",
} as const

let contador = 0

function gerarId() {
  contador = (contador + 1) % Number.MAX_SAFE_INTEGER
  return contador.toString()
}

type TipoAcao = typeof tiposAcao

type Acao =
  | {
      type: TipoAcao["ADICIONAR_TOAST"]
      toast: ToastType
    }
  | {
      type: TipoAcao["ATUALIZAR_TOAST"]
      toast: Partial<ToastType>
    }
  | {
      type: TipoAcao["FECHAR_TOAST"]
      toastId?: ToastType["id"]
    }
  | {
      type: TipoAcao["REMOVER_TOAST"]
      toastId?: ToastType["id"]
    }

interface Estado {
  toasts: ToastType[]
}

const timeoutsToast = new Map<string, ReturnType<typeof setTimeout>>()

const adicionarNaFilaRemocao = (toastId: string) => {
  if (timeoutsToast.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    timeoutsToast.delete(toastId)
    dispatch({
      type: "REMOVER_TOAST",
      toastId: toastId,
    })
  }, ATRASO_REMOCAO_TOAST)

  timeoutsToast.set(toastId, timeout)
}

export const reducer = (estado: Estado, acao: Acao): Estado => {
  switch (acao.type) {
    case "ADICIONAR_TOAST":
      return {
        ...estado,
        toasts: [acao.toast, ...estado.toasts].slice(0, LIMITE_TOAST),
      }

    case "ATUALIZAR_TOAST":
      return {
        ...estado,
        toasts: estado.toasts.map((t) =>
          t.id === acao.toast.id ? { ...t, ...acao.toast } : t
        ),
      }

    case "FECHAR_TOAST": {
      const { toastId } = acao

      if (toastId) {
        adicionarNaFilaRemocao(toastId)
      } else {
        estado.toasts.forEach((toast) => {
          adicionarNaFilaRemocao(toast.id)
        })
      }

      return {
        ...estado,
        toasts: estado.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVER_TOAST":
      if (acao.toastId === undefined) {
        return {
          ...estado,
          toasts: [],
        }
      }
      return {
        ...estado,
        toasts: estado.toasts.filter((t) => t.id !== acao.toastId),
      }
  }
}

const ouvintes: Array<(state: Estado) => void> = []

let estadoMemoria: Estado = { toasts: [] }

function dispatch(acao: Acao) {
  estadoMemoria = reducer(estadoMemoria, acao)
  ouvintes.forEach((ouvinte) => {
    ouvinte(estadoMemoria)
  })
}

type ToastPropsOriginais = Omit<ToastType, "id">

function toast({ ...props }: ToastPropsOriginais) {
  const id = gerarId()

  const atualizar = (props: ToastType) =>
    dispatch({
      type: "ATUALIZAR_TOAST",
      toast: { ...props, id },
    })
  const fechar = () => dispatch({ type: "FECHAR_TOAST", toastId: id })

  dispatch({
    type: "ADICIONAR_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) fechar()
      },
    },
  })

  return {
    id: id,
    fechar,
    atualizar,
  }
}

function useToast() {
  const [estado, setEstado] = React.useState<Estado>(estadoMemoria)

  React.useEffect(() => {
    ouvintes.push(setEstado)
    return () => {
      const index = ouvintes.indexOf(setEstado)
      if (index > -1) {
        ouvintes.splice(index, 1)
      }
    }
  }, [estado])

  return {
    ...estado,
    toast,
    fechar: (toastId?: string) => dispatch({ type: "FECHAR_TOAST", toastId }),
  }
}

export { useToast, toast }
