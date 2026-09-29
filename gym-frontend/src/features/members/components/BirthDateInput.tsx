import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Calendar } from "@/shared/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const parseDateString = (str: string): Date | null => {
  const parts = str.split("/")
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null
  if (year < 1900 || year > 2100) return null
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  ) {
    return date
  }
  return null
}

const formatDateString = (date?: Date): string => {
  if (!date || isNaN(date.getTime())) return ""
  return format(date, "dd/MM/yyyy")
}

export interface BirthDateInputProps {
  id?: string
  value?: Date
  onChange: (date?: Date) => void
  onBlur?: () => void
  error?: boolean
}

export function BirthDateInput({
  id = "birthDate",
  value,
  onChange,
  onBlur,
  error,
}: BirthDateInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>(() => formatDateString(value))

  const lastSyncTimeRef = useRef<number | undefined>(
    value && !isNaN(value.getTime()) ? value.getTime() : undefined
  )

  useEffect(() => {
    const propTime = value && !isNaN(value.getTime()) ? value.getTime() : undefined
    if (propTime !== lastSyncTimeRef.current) {
      lastSyncTimeRef.current = propTime
      setInputValue(formatDateString(value))
    }
  }, [value])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 8)
    let formatted = rawDigits
    if (rawDigits.length > 2 && rawDigits.length <= 4) {
      formatted = `${rawDigits.slice(0, 2)}/${rawDigits.slice(2)}`
    } else if (rawDigits.length > 4) {
      formatted = `${rawDigits.slice(0, 2)}/${rawDigits.slice(2, 4)}/${rawDigits.slice(4)}`
    }
    setInputValue(formatted)

    if (rawDigits.length === 0) {
      lastSyncTimeRef.current = undefined
      onChange(undefined)
      return
    }

    if (rawDigits.length === 8) {
      const parsed = parseDateString(formatted)
      if (parsed) {
        lastSyncTimeRef.current = parsed.getTime()
        onChange(parsed)
      } else {
        lastSyncTimeRef.current = undefined
        onChange(new Date("invalid"))
      }
    } else {
      lastSyncTimeRef.current = undefined
      onChange(undefined)
    }
  }

  const handleBlur = () => {
    if (inputValue.length > 0 && inputValue.length < 10) {
      lastSyncTimeRef.current = undefined
      onChange(new Date("invalid"))
    } else if (inputValue.length === 10) {
      const parsed = parseDateString(inputValue)
      if (!parsed) {
        lastSyncTimeRef.current = undefined
        onChange(new Date("invalid"))
      }
    }
    if (onBlur) onBlur()
  }

  const handleCalendarSelect = (date?: Date) => {
    if (date) {
      lastSyncTimeRef.current = date.getTime()
      setInputValue(formatDateString(date))
      onChange(date)
    } else {
      lastSyncTimeRef.current = undefined
      setInputValue("")
      onChange(undefined)
    }
    setOpen(false)
    if (onBlur) onBlur()
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen && onBlur) onBlur()
      }}
    >
      <PopoverAnchor asChild>
        <div className="relative flex items-center w-full">
          <Input
            id={id}
            type="text"
            placeholder="dd/mm/aaaa"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength={10}
            className="pr-10"
            aria-invalid={error}
          />
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 size-8 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Abrir calendario"
            >
              <CalendarIcon className="size-4" />
            </Button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={6}
        className="w-auto p-0"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleCalendarSelect}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          captionLayout="dropdown"
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}

export default BirthDateInput
