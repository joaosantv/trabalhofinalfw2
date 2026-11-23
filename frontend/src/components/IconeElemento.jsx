// Icones dos 7 elementos
export default function IconeElemento({ nome, className = 'h-4 w-4', style }) {
  const key = (nome || '').trim().toLowerCase()

  switch (key) {
    case 'pyro':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path
            d="M12.5 2.5C12.5 2.5 17.5 6.8 17.5 12.2C17.5 15.8 14.9 19 12 20.5C9.1 19 6.5 15.8 6.5 12.2C6.5 9.6 8 7.5 8 7.5C8 7.5 8.5 9.7 10 10.3C10 7.1 12.5 2.5 12.5 2.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.18"
          />
          <path
            d="M12 12.5C13.4 13.7 14 15.1 13.3 16.5C12.8 17.5 11.2 17.5 10.7 16.5C10 15.1 10.6 13.7 12 12.5Z"
            fill="currentColor"
          />
        </svg>
      )

    case 'hydro':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path
            d="M12 2.8C12 2.8 18 10 18 14.4C18 17.8 15.3 20.5 12 20.5C8.7 20.5 6 17.8 6 14.4C6 10 12 2.8 12 2.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.18"
          />
          <path
            d="M9.5 14.5C9.5 16.1 10.7 17.3 12.3 17.3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'anemo':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path
            d="M4 9.5H15.2C16.9 9.5 18 8.4 18 6.9C18 5.4 16.8 4.4 15.4 4.4C14.1 4.4 13.1 5.3 13 6.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M3.5 13.5H18.5C20 13.5 21 14.5 21 15.9C21 17.3 19.9 18.4 18.5 18.4C17.2 18.4 16.3 17.5 16.2 16.3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M6.5 17.2H12.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'electro':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path
            d="M13.5 2.5L5.8 13.2H11.6L10.5 21.5L18.2 10.8H12.4L13.5 2.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.18"
          />
        </svg>
      )

    case 'dendro':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path
            d="M19.5 4.5C11.5 4.5 5.5 8.8 5.5 16.5C5.5 17.6 5.7 18.6 6 19.5C13.8 19.5 19.5 13.5 19.5 4.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.18"
          />
          <path
            d="M4.5 20C8.5 16 12.2 12.2 16 8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'cryo':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M12 2.5V21.5M3.8 7.2L20.2 16.8M20.2 7.2L3.8 16.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9.8 4.8L12 7L14.2 4.8M9.8 19.2L12 17L14.2 19.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )

    case 'geo':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path
            d="M12 2.8L20 9.5L16.8 20.2H7.2L4 9.5L12 2.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.18"
          />
          <path d="M12 7.2L15.6 10.8L14 16H10L8.4 10.8L12 7.2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )

    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M12 3L14.8 9.2L21 12L14.8 14.8L12 21L9.2 14.8L3 12L9.2 9.2L12 3Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
  }
}
