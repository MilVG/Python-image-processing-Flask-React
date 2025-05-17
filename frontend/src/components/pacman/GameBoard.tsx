
import { useEffect, useState } from "react";
import { EmojiPacman } from "./EmojiPacman";

type CellType = "#" | "." | "P" | "G" | " ";
type MapType = CellType[][];
type Position = [number, number];

export default function GameBoard() {
  const [map, setMap] = useState<MapType>([]);
  const [pacmanPos, setPacmanPos] = useState<Position | null>(null);

  useEffect(() => {
    fetch("/map")
      .then((res) => res.json())
      .then((data) => {
        setMap(data.map);
        setPacmanPos(data.entities.pacman);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/ghosts")
        .then((res) => res.json())
        .then((data) => {
          setMap(data.map);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pacmanPos) return;

      const directionMap: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      };

      const dir = directionMap[e.key];
      if (!dir) return;

      const [dx, dy] = dir;
      const [x, y] = pacmanPos;
      const newX = x + dx;
      const newY = y + dy;

      if (
        newY >= 0 &&
        newY < map.length &&
        newX >= 0 &&
        newX < map[0].length &&
        map[newY][newX] !== "#"
      ) {
        setPacmanPos([newX, newY]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pacmanPos, map]);


  const renderCell = (x: number, y: number) => {
    const cell = map[y]?.[x];
    const isPacman = pacmanPos?.[0] === x && pacmanPos?.[1] === y;

    const base = "w-10 h-10 flex items-center justify-center";

    if (isPacman) return <div className={`${base} text-yellow-400`}><EmojiPacman /></div>;
    if (cell === "G") return <div className={`${base} text-red-500`}>👻</div>;
    if (cell === "#") return <div className={`${base} bg-gray-800`} />;
    if (cell === ".") return <div className={`${base} text-orange-500 text-xl`}>•</div>;

    return <div className={`${base} bg-gray-200`} />;
  };


  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${map[0]?.length || 0}, 2.5rem)`, // 10 * 0.25rem = 2.5rem
      }}
    >
      {map.flatMap((row, y) =>
        row.map((_, x) => (
          <div key={`${x}-${y}`}>{renderCell(x, y)}</div>
        ))
      )}
    </div>
  );
}
