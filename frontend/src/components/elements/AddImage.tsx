
interface AddImageProps {
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
}

export const AddImage = ({ setPreview }: AddImageProps) => {

  const handleResetImage = () => {
    setPreview(null)
  }
  return (
    <button
      className="inline-block bg-slate-500 hover:bg-slate-800 rounded-sm border border-current px-8
      py-3 text-sm font-medium text-white transition hover:scale-110
      hover:shadow-xl focus:ring-3 focus:outline-hidden cursor-pointer"
      onClick={handleResetImage}
    >
      Reset Image
    </button>
  )
}

