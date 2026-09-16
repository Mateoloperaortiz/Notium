"""Renderiza el modelo a SVG, con la misma paleta del diagrama original."""
from xml.sax.saxutils import escape
from model import (CANVAS, PAL, EDGES, SERVER, FRONTEND, PROYECTO, HEADER,
                   LEGEND, STATUS, FOOTER)
from layout import build_modules, legend_box, anchor, route

F = 'Arial, Helvetica, sans-serif'
out = []


def rect(x, y, w, h, fill, stroke, sw=1.5, rx=0, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    out.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="{rx}" '
               f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')


def text(x, y, lines, size, color, weight='normal', anchor_='middle', lh=None):
    lh = lh or size + 6
    if isinstance(lines, str):
        lines = lines.split('\n')
    y0 = y - (len(lines) - 1) * lh / 2
    out.append(f'<text x="{x:.0f}" y="{y0:.1f}" font-family="{F}" font-size="{size}" '
               f'fill="{color}" font-weight="{weight}" text-anchor="{anchor_}" '
               f'dominant-baseline="middle">')
    for i, ln in enumerate(lines):
        dy = 0 if i == 0 else lh
        out.append(f'<tspan x="{x:.0f}" dy="{dy:.1f}">{escape(ln)}</tspan>')
    out.append('</text>')


def polyline(pts, dash=False, double=False):
    d = ' '.join(f'{x:.0f},{y:.0f}' for x, y in pts)
    da = ' stroke-dasharray="8 6"' if dash else ''
    marker = 'url(#a)'
    out.append(f'<polyline points="{d}" fill="none" stroke="{PAL["text"]}" stroke-width="1.8"'
               f'{da} marker-end="{marker}"'
               + (f' marker-start="url(#a0)"' if double else '') + '/>')


def render():
    W, H = CANVAS
    mods = build_modules()
    out.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
               f'viewBox="0 0 {W} {H}">')
    out.append('<defs>'
               f'<marker id="a" markerWidth="12" markerHeight="12" refX="10" refY="5" orient="auto">'
               f'<path d="M0,0 L11,5 L0,10" fill="none" stroke="{PAL["text"]}" stroke-width="1.8"/></marker>'
               f'<marker id="a0" markerWidth="12" markerHeight="12" refX="1" refY="5" orient="auto">'
               f'<path d="M11,0 L0,5 L11,10" fill="none" stroke="{PAL["text"]}" stroke-width="1.8"/></marker>'
               '</defs>')
    rect(0, 0, W, H, PAL['bg'], 'none', 0)

    # ---- cabecera
    rect(40, 30, 320, 52, '#ffffff', PAL['module_stroke'], 2)
    text(200, 56, HEADER['title'], 30, PAL['text'], 'bold')
    text(40, 104, HEADER['subtitle'], 19, PAL['muted'], anchor_='start')
    rect(W - 300, 40, 260, 36, PAL['accent'], 'none')
    text(W - 170, 58, DATE, 17, PAL['text'])

    # ---- contenedores
    rect(PROYECTO['x'], PROYECTO['y'], PROYECTO['w'], PROYECTO['h'], '#ffffff', PAL['module_stroke'], 2, 4)
    text(PROYECTO['x'] + 24, PROYECTO['y'] + 32, PROYECTO['title'], 21, PAL['text'], 'bold', 'start')

    rect(SERVER['x'], SERVER['y'], SERVER['w'], SERVER['h'], PAL['group_fill'], PAL['file_stroke'], 1.5, 6)
    text(SERVER['x'] + 20, SERVER['y'] + 30, SERVER['title'], 19, PAL['text'], 'bold', 'start')
    text(SERVER['x'] + 20, SERVER['y'] + 64, SERVER['sub'], 16, PAL['muted'], anchor_='start')

    rect(FRONTEND['x'], FRONTEND['y'], FRONTEND['w'], FRONTEND['h'], '#ffffff', PAL['module_stroke'], 2, 4)
    text(FRONTEND['x'] + 20, FRONTEND['y'] + 28, FRONTEND['title'], 20, PAL['text'], 'bold', 'start')
    text(FRONTEND['x'] + FRONTEND['w'] - 20, FRONTEND['y'] + 28, FRONTEND['sub'], 16,
         PAL['muted'], anchor_='end')

    # ---- modulos
    for m in mods.values():
        rect(m['x'], m['y'], m['w'], m['h'], PAL['group_fill'], PAL['module_stroke'], 1.5, 8)
        text(m['x'] + m['w'] / 2, m['y'] + 32, m['title'], 19, PAL['text'], 'bold')
        for c in m['children']:
            fill = PAL['highlight'] if c['kind'] == 'high' else '#ffffff'
            if c['kind'] == 'note':
                rect(c['x'], c['y'], c['w'], c['h'], '#ffffff', PAL['file_stroke'], 1.5, 0, '6 5')
                text(c['x'] + c['w'] / 2, c['y'] + c['h'] / 2, c['label'], 15, PAL['muted'])
            else:
                rect(c['x'], c['y'], c['w'], c['h'], fill, PAL['file_stroke'], 1.5)
                lines = c['label'].split('\n')
                text(c['x'] + c['w'] / 2, c['y'] + c['h'] / 2, lines[0], 17, PAL['text'],
                     lh=22) if len(lines) == 1 else _multi(c, lines)
        if m['caption']:
            cp = m['caption']
            text(cp['x'] + cp['w'] / 2, cp['y'] + cp['h'] / 2, cp['label'], 15, PAL['muted'])

    # ---- aristas
    for src, s_side, dst, d_side, label, kind, *rest in EDGES:
        bias = rest[0] if rest else 0
        a = mods.get(src) or _pseudo(src)
        b = mods.get(dst) or _pseudo(dst)
        p0, d0 = anchor(a, s_side)
        p1, d1 = anchor(b, d_side)
        pts = route(p0, d0, p1, d1, bias)
        polyline(pts, dash=(kind == 'dep'), double=(kind == 'http'))
        if label:
            mid = longest_mid(pts)
            lines = label.split('\n')
            bw, bh = label_size(label)
            rect(mid[0] - bw / 2, mid[1] - bh / 2, bw, bh, '#ffffff', 'none', 0)
            text(mid[0], mid[1], lines, 13, PAL['text'], lh=18)

    # ---- leyendas
    for spec, kind in ((LEGEND, 'legend'), (STATUS, 'status')):
        g = legend_box(spec, kind)
        rect(g['x'], g['y'], g['w'], g['h'], '#ffffff', PAL['module_stroke'], 1.5, 8)
        text(g['x'] + g['w'] / 2, g['y'] + 32, g['title'], 18, PAL['text'], 'bold')
        for it in g['items']:
            if kind == 'legend':
                _legend_item(it)
            else:
                text(it['x'], it['y'] + 12, it['head'], 16, PAL['text'], 'bold', 'start')
                text(it['x'], it['y'] + 40, _wrap(it['body'], 34), 14, PAL['muted'], anchor_='start', lh=18)

    text(40, H - 40, FOOTER, 16, PAL['muted'], anchor_='start')
    out.append('</svg>')
    return '\n'.join(out)


def label_size(label):
    """Caja aproximada de una etiqueta de arista (fuente 13, interlineado 18)."""
    lines = label.split('\n')
    return max(len(l) for l in lines) * 6.8 + 16, len(lines) * 18 + 8


def longest_mid(pts):
    """Centro del tramo mas largo: cae en hueco, no en un codo."""
    best, bl = pts[0], -1
    for a, b in zip(pts, pts[1:]):
        l = abs(b[0] - a[0]) + abs(b[1] - a[1])
        if l > bl:
            bl, best = l, ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    return best


def _multi(c, lines):
    head_h, rest_lh = 22, 17
    rest = lines[1:]
    total = head_h + len(rest) * rest_lh
    top = c['y'] + c['h'] / 2 - total / 2
    cx = c['x'] + c['w'] / 2
    text(cx, top + head_h / 2, [lines[0]], 17, PAL['text'], 'bold')
    text(cx, top + head_h + len(rest) * rest_lh / 2, rest, 14, PAL['muted'], lh=rest_lh)


def _legend_item(it):
    x, y, h = it['x'], it['y'], it['h']
    s = it['style']
    if s in ('module', 'file', 'high'):
        fill = {'module': PAL['group_fill'], 'file': '#ffffff', 'high': PAL['highlight']}[s]
        rect(x, y + 6, 54, h - 12, fill, PAL['module_stroke'] if s == 'module' else PAL['file_stroke'],
             1.5, 6 if s == 'module' else 0)
    else:
        polyline([(x, y + h / 2), (x + 54, y + h / 2)], dash=(s == 'dep'))
    text(x + 68, y + h / 2, it['label'], 15, PAL['text'], anchor_='start')


def _wrap(s, n):
    words, lines, cur = s.split(), [], ''
    for w in words:
        if len(cur) + len(w) + 1 > n:
            lines.append(cur); cur = w
        else:
            cur = f'{cur} {w}'.strip()
    if cur:
        lines.append(cur)
    return lines


def _pseudo(key):
    return {'PROYECTO': dict(x=PROYECTO['x'], y=PROYECTO['y'], w=PROYECTO['w'], h=PROYECTO['h'])}[key]


DATE = ''
