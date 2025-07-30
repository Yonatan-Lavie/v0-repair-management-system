"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

interface SearchFiltersProps {
  onSearch: (term: string) => void
  onFilter: (filters: any) => void
  filterOptions: {
    status?: string[]
    priority?: string[]
    technician?: string[]
    dateRange?: string[]
  }
}

export function SearchFilters({ onSearch, onFilter, filterOptions }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<any>({})
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters }
    if (value === "all" || !value) {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    setActiveFilters(newFilters)
    onFilter(newFilters)
  }

  const clearFilter = (key: string) => {
    const newFilters = { ...activeFilters }
    delete newFilters[key]
    setActiveFilters(newFilters)
    onFilter(newFilters)
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    onFilter({})
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="חפש לפי מזהה תיקון, לקוח או תכשיט..." {/* Updated placeholder */}\
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 text-foreground"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="bg-transparent text-muted-foreground hover:text-foreground">
          <Filter className="h-4 w-4 mr-2" />
          סינון
        </Button>
      </div>

      {/* Active Filters */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-muted-foreground">
          <span className="text-sm">פילטרים פעילים:</span>
          {Object.entries(activeFilters).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center gap-1 text-secondary-foreground">
              {key}: {value}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter(key)}
                className="h-4 w-4 p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-foreground">
            נקה הכל
          </Button>
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg"> {/* Changed background to muted */}
          {filterOptions.status && (
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">סטטוס</label>
              <Select
                value={activeFilters.status || "all"}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="text-muted-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  {filterOptions.status.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filterOptions.priority && (
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">עדיפות</label>
              <Select
                value={activeFilters.priority || "all"}
                onValueChange={(value) => handleFilterChange("priority", value)}
              >
                <SelectTrigger className="text-muted-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל העדיפויות</SelectItem>
                  {filterOptions.priority.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filterOptions.technician && (
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">צורף/טכנאי</label> {/* Updated label */}
              <Select
                value={activeFilters.technician || "all"}
                onValueChange={(value) => handleFilterChange("technician", value)}
              >
                <SelectTrigger className="text-muted-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הצורפים/טכנאים</SelectItem> {/* Updated label */}
                  {filterOptions.technician.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filterOptions.dateRange && (
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">תקופה</label>
              <Select
                value={activeFilters.dateRange || "all"}
                onValueChange={(value) => handleFilterChange("dateRange", value)}
              >
                <SelectTrigger className="text-muted-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל התקופות</SelectItem>
                  {filterOptions.dateRange.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
