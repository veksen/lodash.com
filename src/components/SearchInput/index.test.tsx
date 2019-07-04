import { fireEvent, render } from "@testing-library/react"
import React from "react"
import { useSearch } from "../../hooks/useSearch"
import { SearchProvider } from "../../SearchProvider"
import { SidebarProvider } from "../../SidebarProvider"
// import { AllLodashMethodQuery } from "../../types";
import SearchInput from "./"

const WrappedLayout = (props: any): JSX.Element => {
  const { state: searchState } = useSearch()

  return (
    <SidebarProvider initialGroups={[]} searchInput={searchState.input}>
      {props.children}
    </SidebarProvider>
  )
}

const ContextProvider = (props: any): JSX.Element => {
  // const data: AllLodashMethodQuery = useStaticQuery(ALL_LODASH_METHOD_QUERY)

  return (
    <SearchProvider>
      <WrappedLayout {...props } />
    </SearchProvider>
  )
}

it("runs", () => {
  const { getByTestId } = render(
    <ContextProvider>
      <SearchInput />
    </ContextProvider>
  )
  const input = getByTestId("search-input")
  fireEvent.click(input)
  expect(document.activeElement).toEqual(input)
})
