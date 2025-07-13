"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const NOME_COOKIE_SIDEBAR = "sidebar_state"
const DURACAO_MAXIMA_COOKIE_SIDEBAR = 60 * 60 * 24 * 7
const LARGURA_SIDEBAR = "16rem"
const LARGURA_SIDEBAR_MOBILE = "18rem"
const LARGURA_SIDEBAR_ICONE = "3rem"
const ATALHO_TECLADO_SIDEBAR = "b"

type ContextoSidebar = {
  estado: "expanded" | "collapsed"
  aberto: boolean
  setAberto: (aberto: boolean) => void
  abertoMobile: boolean
  setAbertoMobile: (aberto: boolean) => void
  isMobile: boolean
  alternarSidebar: () => void
}

const ContextoSidebar = React.createContext<ContextoSidebar | null>(null)

function useSidebar() {
  const contexto = React.useContext(ContextoSidebar)
  if (!contexto) {
    throw new Error("useSidebar deve ser usado dentro de um ProvedorSidebar.")
  }

  return contexto
}

const ProvedorSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    abertoPadrao?: boolean
    aberto?: boolean
    aoMudarAbertura?: (aberto: boolean) => void
  }
>(
  (
    {
      abertoPadrao = true,
      aberto: propAberto,
      aoMudarAbertura: setPropAberto,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [abertoMobile, setAbertoMobile] = React.useState(false)

    // Estado interno da sidebar.
    // Usamos propAberto e setPropAberto para controle externo.
    const [_aberto, _setAberto] = React.useState(abertoPadrao)
    const aberto = propAberto ?? _aberto
    const setAberto = React.useCallback(
      (valor: boolean | ((valor: boolean) => boolean)) => {
        const estadoAberto = typeof valor === "function" ? valor(aberto) : valor
        if (setPropAberto) {
          setPropAberto(estadoAberto)
        } else {
          _setAberto(estadoAberto)
        }

        // Define o cookie para manter o estado da sidebar.
        document.cookie = `${NOME_COOKIE_SIDEBAR}=${estadoAberto}; path=/; max-age=${DURACAO_MAXIMA_COOKIE_SIDEBAR}`
      },
      [setPropAberto, aberto]
    )

    // Função para alternar a sidebar.
    const alternarSidebar = React.useCallback(() => {
      return isMobile
        ? setAbertoMobile((aberto) => !aberto)
        : setAberto((aberto) => !aberto)
    }, [isMobile, setAberto, setAbertoMobile])

    // Adiciona um atalho de teclado para alternar a sidebar.
    React.useEffect(() => {
      const tratarKeyDown = (evento: KeyboardEvent) => {
        if (
          evento.key === ATALHO_TECLADO_SIDEBAR &&
          (evento.metaKey || evento.ctrlKey)
        ) {
          evento.preventDefault()
          alternarSidebar()
        }
      }

      window.addEventListener("keydown", tratarKeyDown)
      return () => window.removeEventListener("keydown", tratarKeyDown)
    }, [alternarSidebar])

    // Adicionamos um estado para fazer data-state="expanded" ou "collapsed".
    // Isso facilita a estilização com classes Tailwind.
    const estado = aberto ? "expanded" : "collapsed"

    const valorContexto = React.useMemo<ContextoSidebar>(
      () => ({
        estado,
        aberto,
        setAberto,
        isMobile,
        abertoMobile,
        setAbertoMobile,
        alternarSidebar,
      }),
      [estado, aberto, setAberto, isMobile, abertoMobile, setAbertoMobile, alternarSidebar]
    )

    return (
      <ContextoSidebar.Provider value={valorContexto}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": LARGURA_SIDEBAR,
                "--sidebar-width-icon": LARGURA_SIDEBAR_ICONE,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </ContextoSidebar.Provider>
    )
  }
)
ProvedorSidebar.displayName = "ProvedorSidebar"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    lado?: "left" | "right"
    variante?: "sidebar" | "floating" | "inset"
    recolher?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      lado = "left",
      variante = "sidebar",
      recolher = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, estado, abertoMobile, setAbertoMobile } = useSidebar()

    if (recolher === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={abertoMobile} onOpenChange={setAbertoMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": LARGURA_SIDEBAR_MOBILE,
              } as React.CSSProperties
            }
            side={lado}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={estado}
        data-collapsible={estado === "collapsed" ? recolher : ""}
        data-variant={variante}
        data-side={lado}
      >
        {/* Espaçamento da sidebar no desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variante === "floating" || variante === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            lado === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Ajusta o padding para as variantes floating e inset.
            variante === "floating" || variante === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const GatilhoSidebar = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { alternarSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(evento) => {
        onClick?.(evento)
        alternarSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Alternar Sidebar</span>
    </Button>
  )
})
GatilhoSidebar.displayName = "GatilhoSidebar"

const TrilhoSidebar = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { alternarSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Alternar Sidebar"
      tabIndex={-1}
      onClick={alternarSidebar}
      title="Alternar Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
TrilhoSidebar.displayName = "TrilhoSidebar"

const LayoutInterno = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
LayoutInterno.displayName = "LayoutInterno"

const InputSidebar = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
InputSidebar.displayName = "InputSidebar"

const CabecalhoSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
CabecalhoSidebar.displayName = "CabecalhoSidebar"

const RodapeSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
RodapeSidebar.displayName = "RodapeSidebar"

const SeparadorSidebar = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SeparadorSidebar.displayName = "SeparadorSidebar"

const ConteudoSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
ConteudoSidebar.displayName = "ConteudoSidebar"

const GrupoSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
GrupoSidebar.displayName = "GrupoSidebar"

const LabelGrupoSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
LabelGrupoSidebar.displayName = "LabelGrupoSidebar"

const AcaoGrupoSidebar = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Aumenta a área de toque no mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
AcaoGrupoSidebar.displayName = "AcaoGrupoSidebar"

const ConteudoGrupoSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
ConteudoGrupoSidebar.displayName = "ConteudoGrupoSidebar"

const MenuSidebar = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
MenuSidebar.displayName = "MenuSidebar"

const ItemMenuSidebar = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
ItemMenuSidebar.displayName = "ItemMenuSidebar"

const variantesBotaoMenuSidebar = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const BotaoMenuSidebar = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof variantesBotaoMenuSidebar>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, estado } = useSidebar()

    const botao = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(variantesBotaoMenuSidebar({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return botao
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{botao}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={estado !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
BotaoMenuSidebar.displayName = "BotaoMenuSidebar"

const AcaoMenuSidebar = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    mostrarAoPassarMouse?: boolean
  }
>(({ className, asChild = false, mostrarAoPassarMouse = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Aumenta a área de toque no mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        mostrarAoPassarMouse &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
AcaoMenuSidebar.displayName = "AcaoMenuSidebar"

const BadgeMenuSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
BadgeMenuSidebar.displayName = "BadgeMenuSidebar"

const EsqueletoMenuSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    mostrarIcone?: boolean
  }
>(({ className, mostrarIcone = false, ...props }, ref) => {
  // Largura aleatória entre 50% e 90%.
  const largura = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {mostrarIcone && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": largura,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
EsqueletoMenuSidebar.displayName = "EsqueletoMenuSidebar"

const SubMenuSidebar = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SubMenuSidebar.displayName = "SubMenuSidebar"

const ItemSubMenuSidebar = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
ItemSubMenuSidebar.displayName = "ItemSubMenuSidebar"

const BotaoSubMenuSidebar = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
BotaoSubMenuSidebar.displayName = "BotaoSubMenuSidebar"

export {
  Sidebar,
  ConteudoSidebar,
  RodapeSidebar,
  GrupoSidebar,
  AcaoGrupoSidebar,
  ConteudoGrupoSidebar,
  LabelGrupoSidebar,
  CabecalhoSidebar,
  InputSidebar,
  LayoutInterno,
  MenuSidebar,
  AcaoMenuSidebar,
  BadgeMenuSidebar,
  BotaoMenuSidebar,
  ItemMenuSidebar,
  EsqueletoMenuSidebar,
  SubMenuSidebar,
  BotaoSubMenuSidebar,
  ItemSubMenuSidebar,
  ProvedorSidebar,
  TrilhoSidebar,
  SeparadorSidebar,
  GatilhoSidebar,
  useSidebar,
}
