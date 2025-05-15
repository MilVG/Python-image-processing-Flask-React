
import { useState, MouseEvent } from "react"

export default function AlgoritmoAView() {
  const rows = 4
  const cols = 6

  const [grid, setGrid] = useState<number[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(0))
  )

  const [start, setStart] = useState<[number, number] | null>(null)
  const [end, setEnd] = useState<[number, number] | null>(null)
  const [path, setPath] = useState<[number, number][]>([])

  const handleClick = (row: number, col: number, event: MouseEvent) => {
    const newGrid = [...grid.map((r) => [...r])]

    if (event.ctrlKey) {
      setStart([row, col])
    } else if (event.shiftKey) {
      setEnd([row, col])
    } else {
      newGrid[row][col] = newGrid[row][col] === 0 ? 1 : 0
      setGrid(newGrid)
    }
  }

  const handleSubmit = async () => {
    if (!start || !end) {
      alert("Debes marcar un punto de inicio (Ctrl+Click) y final (Shift+Click).")
      return
    }

    const data = {
      mapa: grid,
      inicio: start,
      fin: end,
    }

    try {
      const response = await fetch("http://localhost:5000/algoritmoA", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("Camino encontrado:", result.camino)
      setPath(result.camino || [])
    } catch (error) {
      console.error("Error al enviar al backend:", error)
    }
  }

  return (
    <div className="h-[93vh] w-full flex flex-col justify-center items-center">
      <div className="w-full h-full grid grid-cols-4 grid-rows-5 gap-4 p-4">
        <div className="col-span-2 row-span-4  flex justify-center items-center">
          <div className="bg-red-300 w-5/6 h-5/6">
            <div className="w-full h-full bg-green-300 flex flex-wrap gap-2 justify-center items-center">
              {grid.map((row, i) =>
                row.map((cell, j) => {
                  const isStart = start?.[0] === i && start?.[1] === j
                  const isEnd = end?.[0] === i && end?.[1] === j
                  const isPath = path.some(([r, c]) => r === i && c === j)

                  let bgColor = cell === 1 ? "bg-black" : "bg-yellow-300"
                  if (isStart) bgColor = "bg-green-500"
                  else if (isEnd) bgColor = "bg-red-500"
                  else if (isPath) bgColor = "bg-blue-500"

                  return (
                    <button
                      key={`${i}-${j}`}
                      onClick={(e) => handleClick(i, j, e)}
                      className={`w-12 h-20 lg:h-30 lg:w-30 text-lg ${bgColor} border-2 border-black flex items-center justify-center`}
                    >
                      {isStart ? "S" : isEnd ? "F" : cell === 0 ? "0" : ""}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="col-span-2 row-span-5 col-start-3 p-4 border-2 border-dashed">
          <p className="text-lg font-bold mb-2">Resultado:</p>
          {path.length > 0 ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Inicio */}
              <div
                className="absolute top-10 left-10 flex flex-col items-center"
                style={{ zIndex: 10 }}
              >
                <img
                  src="https://www.pngplay.com/wp-content/uploads/2/Cartoon-Man-Transparent-Image.png"
                  alt="Inicio"
                  className="w-40 h-40"
                />
                <p className="text-white text-sm mt-1">Inicio</p>
              </div>

              {/* Fin */}
              <div
                className="absolute bottom-10 right-10 flex flex-col items-center"
                style={{ zIndex: 10 }}
              >
                <img
                  src="https://png.pngtree.com/png-vector/20190119/ourmid/pngtree-2-5d-building-2-5d-bungalow-building-bungalow-png-image_474132.jpg"
                  alt="Fin"
                  className="w-40 h-40 mix-blend-multiply"
                />
                <p className="text-white text-sm mt-1">Fin</p>
              </div>

              {/* Línea de conexión */}
              <svg
                className="top-50 absolute w-[38vw] h-[60vh]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline
                  points={path
                    .map(([row, col]) => `${col * 140 + 20},${row * 165 + 20}`)
                    .join(" ")}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              </svg>
            </div>
          ) : (
            <p className="text-sm">El camino Algoritmo</p>
          )}
        </div>

        <div className="col-span-2 row-start-5 border-2 border-dashed flex justify-center items-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg cursor-pointer hover:bg-blue-800"
          >
            Analizar Ruta
          </button>
        </div>
      </div>
    </div>
  )
}

