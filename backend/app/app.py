import io
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
import base64
from PIL import Image
import heapq


base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
template_dir = os.path.join(base_dir, "templates")
static_dir = os.path.join(base_dir, "static")

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
CORS(app)

app.config.update(TEMPLATES_AUTO_RELOAD=True)


@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "No se recibió imagen"}), 400

    # Leer imagen con OpenCV
    in_memory_file = file.read()
    npimg = np.frombuffer(in_memory_file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Procesar imagen (por ejemplo: convertir a gris)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Codificar imagen procesada para devolverla como base64
    _, buffer = cv2.imencode(".png", gray)
    img_str = base64.b64encode(buffer).decode("utf-8")

    return jsonify({"processed_image": img_str})


@app.route("/resize", methods=["POST"])
def resize():
    file = request.files["image"]
    width = int(request.form.get("width", 256))
    height = int(request.form.get("height", 256))

    in_memory_file = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(in_memory_file, cv2.IMREAD_COLOR)

    resized = cv2.resize(img, (width, height))

    _, buffer = cv2.imencode(".png", resized)
    processed_image = base64.b64encode(buffer).decode("utf-8")

    return jsonify({"processed_image": processed_image})


@app.route("/rotate", methods=["POST"])
def rotate():
    file = request.files["image"]

    image = Image.open(file.stream).convert("RGB")

    direction = request.form.get("direction")
    if direction == "left":
        rotated = image.rotate(90, expand=True)
    elif direction == "right":
        rotated = image.rotate(-90, expand=True)
    else:
        rotated = image

    # Codificar imagen con PIL
    buffered = io.BytesIO()
    rotated.save(buffered, format="PNG")
    encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return jsonify({"processed_image": encoded_image})


@app.route("/flip", methods=["POST"])
def flip():
    file = request.files["image"]
    image = Image.open(file.stream).convert("RGB")

    # Aplicar flip horizontal (versión correcta para Pillow moderno)
    flipped = image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)

    # Codificar imagen
    buffered = io.BytesIO()
    flipped.save(buffered, format="PNG")
    encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return jsonify({"processed_image": encoded_image})


@app.route("/algoritmoA", methods=["POST"])
def algoritmo_a():
    data = request.get_json()

    mapa = data["mapa"]
    inicio = tuple(data["inicio"])  # (fila, columna)
    fin = tuple(data["fin"])  # (fila, columna)

    camino = a_estrella(mapa, inicio, fin)

    return jsonify({"camino": camino})


def a_estrella(mapa, inicio, fin):
    filas, columnas = len(mapa), len(mapa[0])
    movimientos = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    def heuristica(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])  # Manhattan

    frontera = []
    heapq.heappush(frontera, (0, inicio))
    de_donde = {inicio: None}
    costo_hasta = {inicio: 0}

    while frontera:
        _, actual = heapq.heappop(frontera)

        if actual == fin:
            # reconstruir camino
            camino = []
            while actual:
                camino.append(actual)
                actual = de_donde[actual]
            camino.reverse()
            return camino

        for dx, dy in movimientos:
            nx, ny = actual[0] + dx, actual[1] + dy
            vecino = (nx, ny)

            if 0 <= nx < filas and 0 <= ny < columnas and mapa[nx][ny] == 0:
                nuevo_costo = costo_hasta[actual] + 1
                if vecino not in costo_hasta or nuevo_costo < costo_hasta[vecino]:
                    costo_hasta[vecino] = nuevo_costo
                    prioridad = nuevo_costo + heuristica(fin, vecino)
                    heapq.heappush(frontera, (prioridad, vecino))
                    de_donde[vecino] = actual

    return []  # No se encontró camino


@app.route("/")
def serve_index():
    return send_from_directory(static_dir, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(static_dir, path)


# 🔵 Este bloque reemplaza el anterior
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5500))
    app.run(debug=True, host="0.0.0.0", port=port)
