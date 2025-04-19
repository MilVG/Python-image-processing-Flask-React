import { Navbar } from "./elements/Navbar"
import { Options } from "./elements/Options"
import { SelectImage } from "./elements/SelectImage"

export default function MainPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <Navbar />
      <main className="flex-1 grid grid-cols-6 max-md:grid-cols-1">
        <Options />
        <SelectImage />
      </main>
    </div>
  )
}

