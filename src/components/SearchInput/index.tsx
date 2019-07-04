import React from "react"
import { useSearch } from "../../hooks/useSearch"
import { useSidebar } from "../../hooks/useSidebar"
import * as SC from "./styles"

const SearchInput = (): JSX.Element => {
  const { state: searchState, actions: searchActions } = useSearch()
  const { state: sidebarState, actions: sidebarActions } = useSidebar()

  function setFocus(): void {
    sidebarActions.focusInput()
  }

  function clearFocus(): void {
    sidebarActions.clearFocus()
  }

  // @ts-ignore
  function handleOnChange(event: KeyboardEvent<HTMLInputElement>): void {
    searchActions.update(event.target.value)
    clearFocus()
  }

  // @ts-ignore
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "ArrowUp") {
      sidebarActions.focusPrevious()
    }
    if (event.key === "ArrowDown") {
      sidebarActions.focusNext()
    }
  }

  const isFocused = sidebarState.focus.type === "input"

  return (
    <SC.SearchInputWrapper focused={isFocused}>
      <SC.StyledSearchIcon />
      <SC.SearchInput
        data-testid="search-input"
        value={searchState.input}
        onChange={handleOnChange}
        placeholder="Search"
        onFocus={setFocus}
        onBlur={clearFocus}
        onKeyDown={handleKeyDown}
      />
      {!isFocused && <SC.FocusHint>/</SC.FocusHint>}
    </SC.SearchInputWrapper>
  )
}

export default SearchInput
