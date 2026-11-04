import { useEffect, useRef } from 'react'

interface UseFocusTrapOptions {
  isOpen: boolean
  onClose?: () => void
  initialFocusRef?: React.RefObject<HTMLElement>
}

/**
 * Custom hook to trap focus within modal dialogs, handle Escape key dismissal,
 * and restore focus to the originating trigger element upon closing.
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>({
  isOpen,
  onClose,
  initialFocusRef
}: UseFocusTrapOptions): React.RefObject<T> {
  const containerRef = useRef<T>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      // Restore focus to the element that was focused before opening the modal
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        const toFocus = previousActiveElementRef.current
        setTimeout(() => {
          try {
            toFocus.focus()
          } catch {}
        }, 30)
        previousActiveElementRef.current = null
      }
      return
    }

    // Save currently focused active element
    previousActiveElementRef.current = document.activeElement as HTMLElement

    // Auto-focus specified element or first focusable element inside modal
    const focusTimer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
      } else if (containerRef.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length > 0) {
          focusable[0].focus()
        } else {
          containerRef.current.focus()
        }
      }
    }, 50)

    // Keyboard trap & Escape handling
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && onClose) {
        e.preventDefault()
        e.stopPropagation()
        onClose()
        return
      }

      if (e.key === 'Tab' && containerRef.current) {
        const focusable = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null) // Only visible elements

        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          // Shift + Tab: if on first element or outside, cycle to last
          if (document.activeElement === first || !containerRef.current.contains(document.activeElement)) {
            e.preventDefault()
            last.focus()
          }
        } else {
          // Tab: if on last element or outside, cycle to first
          if (document.activeElement === last || !containerRef.current.contains(document.activeElement)) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, initialFocusRef])

  return containerRef
}

