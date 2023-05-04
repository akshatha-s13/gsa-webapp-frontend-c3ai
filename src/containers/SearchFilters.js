import React from "react"
import SearchFilter from "../components/GrresqQueryBox/SearchFilter";


const SearchFilters = (filters) => {
  return (
    filters.filters.map((filter, i) => {
        return <SearchFilter key={i}
                             idx={i}
                             type={filter.type}
                             name={filter.name}
                             min={filter.min}
                             max={filter.max}
                             value={filter.value}
                             firstName={filter.firstName}
                             lastName={filter.lastName}
                             institution={filter.institution}
        />
      }
    )
  )
}

export default SearchFilters