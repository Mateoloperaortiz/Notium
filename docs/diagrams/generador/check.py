"""Verificaciones de layout del diagrama.

Detecta lo que un diagrama generado rompe con facilidad y el ojo perdona mal:
aristas que atraviesan un modulo, etiquetas encima de cajas o de otras
etiquetas, modulos solapados y modulos fuera del contenedor del frontend.
"""
from model import EDGES, FRONTEND, PROYECTO
from layout import anchor, build_modules, route
from render_svg import label_size, longest_mid


def _rects(mods):
    for m in mods.values():
        yield f"módulo {m['key']}", m['key'], (m['x'], m['y'], m['w'], m['h'])
        for ch in m['children']:
            head = ch['label'].splitlines()[0][:26]
            yield f"caja {m['key']}:{head}", m['key'], (ch['x'], ch['y'], ch['w'], ch['h'])


def _overlaps(a, b):
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    return ax < bx + bw and bx < ax + aw and ay < by + bh and by < ay + ah


def _seg_hits(p0, p1, r):
    """Tramo ortogonal contra rectangulo, con 4 px de holgura."""
    (x0, y0), (x1, y1) = p0, p1
    rx, ry, rw, rh = r
    if abs(y1 - y0) < 1:
        lo, hi = sorted((x0, x1))
        return ry + 4 < y0 < ry + rh - 4 and lo < rx + rw - 4 and rx + 4 < hi
    lo, hi = sorted((y0, y1))
    return rx + 4 < x0 < rx + rw - 4 and lo < ry + rh - 4 and ry + 4 < hi


def run_checks():
    mods = build_modules()
    rects = list(_rects(mods))
    problems = []
    labels = []

    for src, ss, dst, ds, label, _kind, *extra in EDGES:
        bias = extra[0] if extra else 0
        a = mods.get(src) or PROYECTO
        b = mods.get(dst) or PROYECTO
        p0, d0 = anchor(a, ss)
        p1, d1 = anchor(b, ds)
        pts = route(p0, d0, p1, d1, bias)

        for s0, s1 in zip(pts, pts[1:]):
            for name, owner, r in rects:
                if owner in (src, dst):
                    continue
                if _seg_hits(s0, s1, r):
                    problems.append(f'arista {src}->{dst} atraviesa {name}')

        if label:
            mx, my = longest_mid(pts)
            lw, lh = label_size(label)
            lr = (mx - lw / 2, my - lh / 2, lw, lh)
            for name, _owner, r in rects:
                if name.startswith('caja') and _overlaps(lr, r):
                    problems.append(f'etiqueta «{label[:24]}» tapa {name}')
            for other, orect in labels:
                if _overlaps(lr, orect):
                    problems.append(f'etiquetas «{label[:18]}» y «{other[:18]}» se solapan')
            labels.append((label, lr))

    fx, fy, fw, fh = FRONTEND['x'], FRONTEND['y'], FRONTEND['w'], FRONTEND['h']
    for m in mods.values():
        if m['key'] == 'cliente':
            continue
        if not (fx <= m['x'] and m['x'] + m['w'] <= fx + fw
                and fy <= m['y'] and m['y'] + m['h'] <= fy + fh):
            problems.append(f"módulo {m['key']} se sale del contenedor Frontend")

    keys = list(mods)
    for i, k1 in enumerate(keys):
        for k2 in keys[i + 1:]:
            m1, m2 = mods[k1], mods[k2]
            if _overlaps((m1['x'], m1['y'], m1['w'], m1['h']),
                         (m2['x'], m2['y'], m2['w'], m2['h'])):
                problems.append(f'módulos {k1} y {k2} se solapan')

    return sorted(set(problems))


if __name__ == '__main__':
    found = run_checks()
    print(f'=== {len(found)} problema(s) ===')
    for p in found:
        print(' -', p)
