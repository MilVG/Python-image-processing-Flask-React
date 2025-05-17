def parse_map(level_map):
    pacman_pos = None
    ghost_positions = []
    food_positions = []
    walls = set()

    for y, row in enumerate(level_map):
        for x, cell in enumerate(row):
            if cell == "P":
                pacman_pos = (x, y)
            elif cell == "G":
                ghost_positions.append((x, y))
            elif cell == ".":
                food_positions.append((x, y))
            elif cell == "#":
                walls.add((x, y))

    return {
        "pacman": pacman_pos,
        "ghosts": ghost_positions,
        "food": food_positions,
        "walls": walls,
    }

