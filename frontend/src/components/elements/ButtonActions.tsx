interface ButtonActionsProps {
  name: string
  handleEventClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
export const ButtonActions = ({ name, handleEventClick }: ButtonActionsProps) => {
  return (
    <button
      className="group relative inline-block text-sm font-medium text-slate-50 focus:ring-3 focus:outline-hidden cursor-pointer"
      onClick={handleEventClick}
    >
      <span className="absolute inset-0 border border-current"></span>
      <span
        className="block border border-current bg-slate-600 px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
      >{name}</span>
    </button>
  )
}

