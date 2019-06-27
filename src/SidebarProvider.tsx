import React, { useEffect, useState } from "react"
import { Group as GroupInterface, Method as MethodInterface } from "./types"

interface SidebarProviderProps {
  children: React.ReactNode
  initialGroups: GroupInterface[]
  searchInput: string
}

interface BaseInput {
  type: "input" | "method" | "nothing"
  method: number | null
  group: number | null
  flagToLastMethod?: boolean
}

interface FocusOnInput extends BaseInput {
  type: "input"
  method: null
  group: null
}

interface FocusOnMethod extends BaseInput {
  type: "method"
  method: number
  group: number
  flagToLastMethod: boolean
}

interface FocusOnNothing extends BaseInput {
  type: "nothing"
  method: null
  group: null
}

export type Focus = FocusOnInput | FocusOnMethod | FocusOnNothing

export interface SidebarContextInterface {
  state: {
    focus: Focus
    filteredGroups: GroupInterface[]
  }
  actions: {
    focusPrevious: () => void
    focusNext: () => void
    focusPreviousGroup: (atIndex: number) => void
    focusNextGroup: () => void
    clearFocus: () => void
    focusInput: () => void
  }
}

export const SidebarContext = React.createContext<SidebarContextInterface | null>(
  null
)

function filterMethod(method: MethodInterface, input: string): boolean {
  return method.node.name.toLowerCase().includes(input.toLowerCase())
}

// TODO: refactor to avoid the weird need for input?
function filterMethods(m: MethodInterface[], input: string): MethodInterface[] {
  return m.filter(method => filterMethod(method, input))
}

// TODO: refactor to avoid the weird need for input?
function filterGroups(g: GroupInterface[], input: string): GroupInterface[] {
  return g.filter(({ edges: groupMethods }) => {
    console.log(filterMethods(groupMethods, input))
    return filterMethods(groupMethods, input).length
  })
}

export function SidebarProvider({
  children,
  initialGroups,
  searchInput,
}: SidebarProviderProps): JSX.Element {
  const [filteredGroups, setFilteredGroups] = useState<GroupInterface[]>([])
  const [focus, setFocus] = useState<Focus>({
    type: "nothing",
    method: null,
    group: null,
  })

  useEffect(() => {
    setFilteredGroups(initialGroups)
  }, [])

  useEffect(() => {
    console.log("this runs")
    console.log(searchInput)
    console.log(filterGroups(initialGroups, searchInput))
    setFilteredGroups(filterGroups(initialGroups, searchInput))
  }, [searchInput])

  function focusPrevious(): void {
    if (focus.type === "method" && focus.method === 0 && focus.group === 0) {
      focusInput()
    } else if (focus.type === "method") {
      focusMethod({ method: focus.method - 1, group: focus.group })
    }
  }

  function focusNext(): void {
    if (focus.type === "nothing" || focus.type === "input") {
      focusMethod({ method: 0, group: 0 })
    } else if (focus.type === "method") {
      focusMethod({ method: focus.method + 1, group: focus.group })
    }
  }

  function focusPreviousGroup(atIndex: number): void {
    focusMethod({
      method: atIndex,
      group: (focus.group as number) - 1,
    })
  }

  function focusNextGroup(): void {
    focusMethod({
      method: 0,
      group: (focus.group as number) + 1,
    })
  }

  function clearFocus(): void {
    setFocus({ type: "nothing", method: null, group: null })
  }

  function focusInput(): void {
    setFocus({ type: "input", method: null, group: null })
  }

  function focusMethod({
    method,
    group,
    flagToLastMethod,
  }: {
    method: number
    group: number
    flagToLastMethod?: boolean
  }): void {
    setFocus({ type: "method", method, group, flagToLastMethod })
  }

  return (
    <SidebarContext.Provider
      value={{
        state: {
          focus,
          filteredGroups,
        },
        actions: {
          focusPrevious,
          focusNext,
          focusPreviousGroup,
          focusNextGroup,
          clearFocus,
          focusInput,
        },
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
