def heuristic(a, b):
    """Calcula la distancia de Manhattan entre dos puntos."""
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def initialize_astar(start, goal):
    open_set = [start]
    closed_set = set()
    parents = {}
    g = {start: 0}
    f = {start: heuristic(start, goal)}

    return open_set, closed_set, parents, g, f


def a_star_search(grid, start, goal):
    open_list, closed_set, g_score, f_score, parents = initialize_astar(start, goal)

    while open_list:
        current = min(open_list, key=lambda x: f_score.get(x, float("inf")))

        if current == goal:
            return parents  # devolvemos el diccionario para reconstruir luego

        open_list.remove(current)
        closed_set.add(current)

        for neighbor in get_neighbors(grid, current):
            if neighbor in closed_set:
                continue

            tentative_g = g_score[current] + 1  # costo de moverse

            if neighbor not in open_list:
                open_list.append(neighbor)
            elif tentative_g >= g_score.get(neighbor, float("inf")):
                continue

            parents[neighbor] = current
            g_score[neighbor] = tentative_g
            f_score[neighbor] = tentative_g + heuristic(neighbor, goal)

    return None  # no se encontró camino


def get_neighbors(node, grid):
    neighbors = []
    x, y = node
    rows = len(grid)
    cols = len(grid[0])

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]  # arriba, abajo, izq, der

    for dx, dy in directions:
        nx, ny = x + dx, y + dy
        if 0 <= nx < rows and 0 <= ny < cols:
            if grid[nx][ny] != 1:  # asumimos que 1 es pared/obstáculo
                neighbors.append((nx, ny))

    return neighbors


def reconstruct_path(parents, current):
    path = [current]
    while current in parents:
        current = parents[current]
        path.append(current)
    path.reverse()
    return path
