"""Motor de layout: convierte el modelo en geometria absoluta."""
from model import MODULES, LEGEND, STATUS

PAD = 16
TITLE_H = 34
GAP = 12
ROW_H = 44
CAP_H = 26


def build_modules():
    boxes = {}
    for key, x, y, w, title, rows, caption in MODULES:
        cy = y + PAD + TITLE_H + 10
        children = []
        for label, kind, extra in rows:
            h = ROW_H + extra
            children.append(dict(label=label, kind=kind, x=x + PAD, y=cy, w=w - 2 * PAD, h=h))
            cy += h + GAP
        cy -= GAP
        cap = None
        if caption:
            cy += 8
            cap = dict(label=caption, x=x + PAD, y=cy, w=w - 2 * PAD, h=CAP_H)
            cy += CAP_H
        total = cy + PAD - y
        boxes[key] = dict(key=key, x=x, y=y, w=w, h=total, title=title,
                          children=children, caption=cap)
    return boxes


def legend_box(spec, kind):
    y = spec['y'] + PAD + TITLE_H + 6
    items = []
    for item in spec['items']:
        if kind == 'legend':
            label, style = item
            items.append(dict(label=label, style=style, x=spec['x'] + PAD, y=y, w=spec['w'] - 2 * PAD, h=38))
            y += 38 + 8
        else:
            head, body = item
            items.append(dict(head=head, body=body, x=spec['x'] + PAD, y=y, w=spec['w'] - 2 * PAD, h=64))
            y += 64 + 8
    y -= 8
    return dict(x=spec['x'], y=spec['y'], w=spec['w'], h=y + PAD - spec['y'],
                title=spec['title'], items=items)


def anchor(box, side):
    """side puede ser 'r', 'l:0.3', 't', 'b:0.7'."""
    if ':' in side:
        s, f = side.split(':')
        f = float(f)
    else:
        s, f = side, 0.5
    if s == 'r':
        return (box['x'] + box['w'], box['y'] + box['h'] * f), (1, 0)
    if s == 'l':
        return (box['x'], box['y'] + box['h'] * f), (-1, 0)
    if s == 't':
        return (box['x'] + box['w'] * f, box['y']), (0, -1)
    return (box['x'] + box['w'] * f, box['y'] + box['h']), (0, 1)


def route(p0, d0, p1, d1, bias=0):
    """Camino ortogonal entre dos anclas."""
    x0, y0 = p0
    x1, y1 = p1
    if d0[0] and d1[0]:                       # horizontal -> horizontal
        if abs(y1 - y0) <= 14:                # desnivel minimo: linea recta
            return [p0, (x1, y0)]
        mx = (x0 + x1) / 2 + bias
        return [p0, (mx, y0), (mx, y1), p1]
    if d0[1] and d1[1]:                       # vertical -> vertical
        if abs(x1 - x0) <= 14:
            return [p0, (x0, y1)]
        my = (y0 + y1) / 2 + bias
        return [p0, (x0, my), (x1, my), p1]
    if d0[0]:                                 # horizontal -> vertical
        return [p0, (x1, y0), p1]
    return [p0, (x0, y1), p1]                 # vertical -> horizontal
