"""Emite el .drawio editable, con los archivos agrupados por modulo."""
from xml.sax.saxutils import escape
from model import (CANVAS, PAL, EDGES, SERVER, FRONTEND, PROYECTO, HEADER,
                   LEGEND, STATUS, FOOTER)
from layout import build_modules, legend_box

BASE = ('whiteSpace=wrap;html=0;strokeWidth=1.5;fontFamily=Arial;fontColor=%s;'
        'align=center;verticalAlign=middle;spacing=6;shadow=0;')

S_MODULE = BASE % PAL['text'] + f'fillColor={PAL["group_fill"]};strokeColor={PAL["module_stroke"]};fontSize=19;fontStyle=1;rounded=1;arcSize=8;verticalAlign=top;'
S_FILE = BASE % PAL['text'] + f'fillColor=#ffffff;strokeColor={PAL["file_stroke"]};fontSize=17;fontStyle=0;'
S_HIGH = BASE % PAL['text'] + f'fillColor={PAL["highlight"]};strokeColor={PAL["file_stroke"]};fontSize=17;fontStyle=0;'
S_NOTE = BASE % PAL['muted'] + f'fillColor=#ffffff;strokeColor={PAL["file_stroke"]};fontSize=15;fontStyle=0;dashed=1;'
S_CAP = BASE % PAL['muted'] + 'fillColor=none;strokeColor=none;fontSize=15;fontStyle=0;'
S_BOX = BASE % PAL['text'] + f'fillColor=#ffffff;strokeColor={PAL["module_stroke"]};fontSize=20;fontStyle=1;rounded=1;arcSize=4;verticalAlign=top;'
S_BAND = BASE % PAL['text'] + f'fillColor={PAL["group_fill"]};strokeColor={PAL["file_stroke"]};fontSize=19;fontStyle=1;rounded=1;arcSize=6;verticalAlign=top;'
S_TEXT = BASE % PAL['muted'] + 'fillColor=none;strokeColor=none;fontSize=16;fontStyle=0;align=left;'
S_ACCENT = BASE % PAL['text'] + f'fillColor={PAL["accent"]};strokeColor=none;fontSize=17;fontStyle=0;'

E_FLOW = ('edgeStyle=orthogonalEdgeStyle;rounded=0;html=0;strokeWidth=1.8;'
          f'strokeColor={PAL["text"]};endArrow=open;endFill=0;fontFamily=Arial;fontSize=15;'
          f'fontColor={PAL["text"]};labelBackgroundColor=#ffffff;')
E_DEP = E_FLOW + 'dashed=1;'
E_HTTP = E_FLOW + 'startArrow=open;startFill=0;'


def emit(date):
    c = []
    n = [10]

    def cell(value, style, x, y, w, h, parent='1', vertex=True):
        n[0] += 1
        i = f'n{n[0]}'
        c.append(f'<mxCell id="{i}" value="{escape(value)}" style="{style}" vertex="1" parent="{parent}">'
                 f'<mxGeometry x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" as="geometry"/></mxCell>')
        return i

    def edge(value, style, src, dst):
        n[0] += 1
        c.append(f'<mxCell id="e{n[0]}" value="{escape(value)}" style="{style}" edge="1" parent="1" '
                 f'source="{src}" target="{dst}"><mxGeometry relative="1" as="geometry"/></mxCell>')

    W, H = CANVAS
    cell(HEADER['title'], S_BOX.replace('fontSize=20', 'fontSize=30').replace('verticalAlign=top', 'verticalAlign=middle'), 40, 30, 320, 52)
    cell(HEADER['subtitle'], S_TEXT.replace('fontSize=16', 'fontSize=19'), 40, 88, 1300, 32)
    cell(date, S_ACCENT, W - 300, 40, 260, 36)

    pid = cell(PROYECTO['title'], S_BOX, PROYECTO['x'], PROYECTO['y'], PROYECTO['w'], PROYECTO['h'])
    cell(f"{SERVER['title']}\n{SERVER['sub']}", S_BAND, SERVER['x'], SERVER['y'], SERVER['w'], SERVER['h'])
    cell(f"{FRONTEND['title']}   ·   {FRONTEND['sub']}", S_BOX, FRONTEND['x'], FRONTEND['y'], FRONTEND['w'], FRONTEND['h'])

    ids = {}
    for m in build_modules().values():
        mid = cell(m['title'], S_MODULE, m['x'], m['y'], m['w'], m['h'])
        ids[m['key']] = mid
        for ch in m['children']:
            st = {'high': S_HIGH, 'note': S_NOTE}.get(ch['kind'], S_FILE)
            cell(ch['label'], st, ch['x'] - m['x'], ch['y'] - m['y'], ch['w'], ch['h'], parent=mid)
        if m['caption']:
            cp = m['caption']
            cell(cp['label'], S_CAP, cp['x'] - m['x'], cp['y'] - m['y'], cp['w'], cp['h'], parent=mid)
    ids['PROYECTO'] = pid

    for src, _s, dst, _d, label, kind, *_bias in EDGES:
        st = {'dep': E_DEP, 'http': E_HTTP}.get(kind, E_FLOW)
        edge(label.replace('\n', ' '), st, ids[src], ids[dst])

    for spec, kind in ((LEGEND, 'legend'), (STATUS, 'status')):
        g = legend_box(spec, kind)
        gid = cell(g['title'], S_BOX.replace('fontSize=20', 'fontSize=18'), g['x'], g['y'], g['w'], g['h'])
        for it in g['items']:
            if kind == 'legend':
                cell(it['label'], S_FILE.replace('fontSize=17', 'fontSize=15'),
                     it['x'] - g['x'], it['y'] - g['y'], it['w'], it['h'], parent=gid)
            else:
                cell(f"{it['head']}\n{it['body']}", S_FILE.replace('fontSize=17', 'fontSize=14'),
                     it['x'] - g['x'], it['y'] - g['y'], it['w'], it['h'], parent=gid)

    cell(FOOTER, S_TEXT, 40, H - 58, 1600, 30)

    body = '\n        '.join(c)
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" agent="Claude" version="24.7.17" type="device">
  <diagram id="notium-architecture" name="Arquitectura actual">
    <mxGraphModel dx="1800" dy="1540" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{W}" pageHeight="{H}" math="0" shadow="0" background="#ffffff">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        {body}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
'''
