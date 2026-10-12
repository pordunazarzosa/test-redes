import json, re, sys
from docx import Document  # py -m pip install python-docx

doc = Document(sys.argv[1])
preguntas, actual, examen, figura = [], None, None, None
SALTAR = ("—", "[Figura", "Figura original", "Preguntas de este examen", "Páginas", "Página")

for p in doc.paragraphs:
    t = p.text.strip()
    if not t:
        continue
    if m := re.match(r"^Examen (\d+)$", t):
        examen = int(m.group(1))
        continue
    if m := re.match(r"^▶ FIGURA .*Examen (\d+), pregunta (\d+), página (\d+)", t):
        e, q, pg = map(int, m.groups())
        figura = f"img/Examen{e:02d}_P{q:02d}_pag{pg:03d}.png"
        continue
    if m := re.match(r"^(\d+)\.\s+(.*)", t):
        num = int(m.group(1))
        actual = {
            "id": f"E{examen:02d}-P{num:02d}",
            "tema": "sin-tema",
            "enunciado": m.group(2),
            "opciones": [],
            "correcta": None,          # se rellena con el solucionario
            "origen": {"examen": examen, "pregunta": num},
        }
        if figura:
            actual["imagen"], figura = figura, None
        preguntas.append(actual)
        continue
    if actual and (m := re.match(r"^([A-Ha-h])\)\s*(.*)", t)):
        actual["opciones"].append(m.group(2))
        continue
    if actual and not actual["opciones"] and not t.startswith(SALTAR):
        actual["enunciado"] += "\n" + t   # líneas extra del enunciado (datos, fuentes…)

with open("preguntas_sin_tema.json", "w", encoding="utf-8") as f:
    json.dump(preguntas, f, ensure_ascii=False, indent=2)
print(len(preguntas), "preguntas exportadas")