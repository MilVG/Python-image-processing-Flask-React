interface SeparatorProps {
  title: String
}
export const Separator = ({ title }: SeparatorProps) => {
  return (
    <span className="flex items-center">
      <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>

      <span className="shrink-0 px-4 text-gray-900 dark:text-white">{title}</span>

      <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
    </span>
  )
}

