"""Genera el diagrama de arquitectura de Notium.

Un unico modelo (model.py) produce el .drawio editable, el .svg con ese modelo
incrustado y el .png, de modo que los tres no puedan divergir. Antes de escribir
nada se verifica el layout: aristas que atraviesan modulos, etiquetas encima de
cajas o de otras etiquetas, y modulos solapados o fuera del contenedor.

    python3 build.py

Requiere rsvg-convert para el PNG (brew install librsvg).
"""
import pathlib
import subprocess
import sys
from urllib.parse import quote

sys.path.insert(0, str(pathlib.Path(__file__).parent))

import render_drawio
import render_svg
from check import run_checks
from model import CANVAS

DATE = '15 sep 2026'
OUT = pathlib.Path(__file__).resolve().parents[1]


def main() -> int:
    problems = run_checks()
    if problems:
        print(f'{len(problems)} problema(s) de layout:', file=sys.stderr)
        for p in problems:
            print(' -', p, file=sys.stderr)
        return 1

    render_svg.DATE = DATE
    svg = render_svg.render()
    dio = render_drawio.emit(DATE)
    # el SVG lleva el modelo editable incrustado, como el diagrama anterior
    svg = svg.replace('<svg xmlns=', f'<svg content="{quote(dio, safe="")}" xmlns=', 1)

    (OUT / 'notium-arquitectura.drawio').write_text(dio)
    (OUT / 'notium-arquitectura.svg').write_text(svg)
    subprocess.run(['rsvg-convert', '-w', str(CANVAS[0]), '-b', 'white',
                    str(OUT / 'notium-arquitectura.svg'),
                    '-o', str(OUT / 'notium-arquitectura.png')], check=True)
    print(f'generado: .drawio ({len(dio)} B), .svg ({len(svg)} B), .png')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
