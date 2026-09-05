from __future__ import annotations

from pathlib import Path

from PIL import Image
from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path('/Users/jameskordic/JamesKordic')
SOURCE = Path('/Users/jameskordic/Downloads/WorldWide Interactive Music Festival.pdf')
ASSETS = ROOT / 'tmp/pdfs/wwimf_source/assets'
DL = ROOT / 'tmp/pdfs/wwimf_source/downloads'
PUBLIC = ROOT / 'public/projects/wwimf'
INTERIOR = ROOT / 'tmp/pdfs/wwimf_hand_artbook_interior.pdf'
OUTPUT = ROOT / 'output/pdf/wwimf-art-concept-book.pdf'

W, H = letter
M = 38
INK = HexColor('#111111')
PAPER = HexColor('#F5F2EA')
WHITE = HexColor('#FFFFFF')
PINK = HexColor('#ED1D7E')
CYAN = HexColor('#6FCCDD')
YELLOW = HexColor('#FED700')
PURPLE = HexColor('#5D53A3')
ORANGE = HexColor('#F04923')
GREEN = HexColor('#73BF44')
PALETTE = [PINK, CYAN, YELLOW, PURPLE, ORANGE, GREEN]

CITYBURN_PATH = next(Path('/Users/jameskordic/Library/Fonts').glob('cityburn-*.ttf'))
pdfmetrics.registerFont(TTFont('Cityburn', str(CITYBURN_PATH)))
pdfmetrics.registerFont(TTFont('CourierNew', '/System/Library/Fonts/Supplemental/Courier New.ttf'))
pdfmetrics.registerFont(TTFont('CourierNew-Bold', '/System/Library/Fonts/Supplemental/Courier New Bold.ttf'))
pdfmetrics.registerFontFamily('CourierNew', normal='CourierNew', bold='CourierNew-Bold', italic='CourierNew', boldItalic='CourierNew-Bold')


def bg(c, color=PAPER):
    c.setFillColor(color)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def place(c, path, x, y, w, h, halign='center', valign='middle'):
    """Place a complete image at its native aspect ratio, without crop or frame."""
    path = Path(path)
    im = Image.open(path)
    iw, ih = im.size
    scale = min(w / iw, h / ih)
    rw, rh = iw * scale, ih * scale
    dx = {'left': 0, 'center': (w - rw) / 2, 'right': w - rw}[halign]
    dy = {'bottom': 0, 'middle': (h - rh) / 2, 'top': h - rh}[valign]
    c.drawImage(ImageReader(str(path)), x + dx, y + dy, rw, rh, preserveAspectRatio=True, mask='auto')
    return x + dx, y + dy, rw, rh


def label(c, value, x, y, color=INK, size=7.5):
    c.setFillColor(color)
    t = c.beginText(x, y)
    t.setFont('CourierNew-Bold', size)
    t.setCharSpace(0.7)
    t.textLine(value.upper())
    c.drawText(t)


def title(c, value, x, y, size=46, color=INK, max_width=None):
    actual = size
    if max_width:
        while actual > 14 and pdfmetrics.stringWidth(value, 'Cityburn', actual) > max_width:
            actual -= 1
    c.setFillColor(color)
    c.setFont('Cityburn', actual)
    c.drawString(x, y, value.upper())


def body(c, value, x, top, width, size=10.2, leading=14.5, color=INK, bold=False):
    style = ParagraphStyle(
        'body', fontName='CourierNew-Bold' if bold else 'CourierNew',
        fontSize=size, leading=leading, textColor=color, alignment=TA_LEFT,
        splitLongWords=True, allowWidows=0, allowOrphans=0,
    )
    p = Paragraph(value, style)
    _, ph = p.wrap(width, H)
    p.drawOn(c, x, top - ph)
    return top - ph


def folio(c, page, color=INK):
    c.setFillColor(color)
    c.setFont('CourierNew', 7)
    c.drawString(M, 20, f'{page:02d}')
    draw_hand(c, W - 52, 14, 18, 22, color, 1)


def draw_hand(c, x, y, w, h, color=INK, alpha=1.0, outline=False, line_width=1.0):
    """Draw the WWIMF hand as a clean vector mark."""
    c.saveState()
    c.setFillAlpha(alpha)
    c.setStrokeAlpha(alpha)
    gap = w * 0.055
    finger_w = (w - gap * 4) / 5
    palm_top = y + h * 0.44
    finger_heights = [0.40, 0.63, 0.79, 0.56, 0.34]
    c.setLineWidth(line_width)
    c.setFillColor(color)
    c.setStrokeColor(color)
    for i, frac in enumerate(finger_heights):
        fx = x + i * (finger_w + gap)
        fh = h * frac
        if outline:
            c.rect(fx, palm_top, finger_w, fh, fill=0, stroke=1)
        else:
            c.rect(fx, palm_top, finger_w, fh, fill=1, stroke=0)
    palm = c.beginPath()
    palm.moveTo(x, palm_top)
    palm.lineTo(x + w, palm_top)
    palm.lineTo(x + w * 0.82, y + h * 0.08)
    palm.lineTo(x + w * 0.66, y)
    palm.lineTo(x + w * 0.34, y)
    palm.lineTo(x + w * 0.18, y + h * 0.08)
    palm.close()
    c.drawPath(palm, fill=0 if outline else 1, stroke=1 if outline else 0)
    c.restoreState()


def rule(c, x1, y1, x2, y2, color=INK, width=0.5):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)


def spread_label(c, section, page, color=INK):
    label(c, section, M, H - 38, color)
    folio(c, page, color)


def show(c):
    c.showPage()


c = canvas.Canvas(str(INTERIOR), pagesize=letter, pageCompression=1)
c.setTitle('WorldWide Interactive Music Festival - Art and Concept Book')
c.setAuthor('James Kordic')
c.setSubject('WWIMF art and concept book')

# 02 - inside cover / the hand enters
bg(c, YELLOW)
draw_hand(c, 86, 104, 440, 560, INK)
label(c, 'WORLDWIDE INTERACTIVE MUSIC FESTIVAL', M, H - 38, INK)
label(c, 'A CONCEPT BOOK / JAMES KORDIC', M, 44, INK)
show(c)

# 03 - title
bg(c)
draw_hand(c, 388, 368, 252, 320, PINK, 0.16)
label(c, 'WWIMF / 2025', M, H - 38, PINK)
title(c, 'A FESTIVAL', M, 596, 66)
title(c, 'YOU SHAPE.', M, 528, 66)
rule(c, M, 482, W - M, 482)
body(c, 'A speculative world where music, visual art, and emerging technology meet through active participation.', M, 445, 300, 11, 16)
draw_hand(c, 412, 66, 150, 190, INK)
folio(c, 3)
show(c)

# 04 - opening image
bg(c)
spread_label(c, 'MANIFESTO / 01', 4, PURPLE)
place(c, ASSETS / 'p02_i01.jp2', M, 138, W - 2 * M, 590)
title(c, 'MUSIC IS ALIVE.', M, 67, 47, INK, W - 2 * M)
show(c)

# 05 - opening image pair
bg(c)
spread_label(c, 'MANIFESTO / 02', 5, PURPLE)
place(c, ASSETS / 'p03_i01.jp2', M, 178, 310, 540, 'left')
draw_hand(c, 399, 374, 172, 220, PINK)
title(c, 'THE CROWD', 377, 278, 36)
title(c, 'COMPLETES IT.', 377, 238, 36)
body(c, 'The audience is not a backdrop. It is part of the instrument.', 377, 196, 197, 9.5, 13.5)
show(c)

# 06 - premise
bg(c, WHITE)
draw_hand(c, -55, 328, 300, 382, CYAN, 0.13)
spread_label(c, 'THE PREMISE', 6, PINK)
title(c, 'WHAT IF THE CROWD', M, 646, 46, INK, W - 2 * M)
title(c, 'COULD SHAPE THE SHOW?', M, 596, 46, INK, W - 2 * M)
body(c, '<b>WWIMF is a conceptual global music festival where music, visual art, and emerging technology converge through active participation.</b>', M, 512, 240, 10.3, 15)
body(c, 'Traditional festivals place the audience at the edge of the experience. WWIMF imagines a different relationship: the event listens back. Light, sound, space, and image respond to presence, gesture, and movement.', 330, 512, 244, 10.3, 15)
rule(c, M, 115, W - M, 115, PINK, 4)
folio(c, 6)
show(c)

# 07 - atmosphere
bg(c)
place(c, DL / 'stage-03.png', M, 178, W - 2 * M, 520)
draw_hand(c, 398, 51, 164, 142, PINK, 0.92)
title(c, 'THE STAGE LISTENS BACK.', M, 80, 36, INK, 350)
folio(c, 7)
show(c)

# 08 - section hand
bg(c, PURPLE)
draw_hand(c, 60, 110, 492, 625, WHITE)
title(c, 'ENTER THE SIGNAL.', M, 58, 47, WHITE, W - 2 * M)
show(c)

# 09 - passage
bg(c, WHITE)
spread_label(c, 'PASSAGE / LIGHT AS WAYFINDING', 9, PINK)
place(c, ASSETS / 'p12_i01.jpg', M, 185, W - 2 * M, 510)
body(c, 'Navigation becomes performance. The path into the venue is already part of the show.', M, 146, 355, 10, 14)
show(c)

# 10 - stage studies
bg(c)
spread_label(c, 'ENVIRONMENT STUDIES', 10, PINK)
title(c, 'A WORLD BEFORE A SCHEDULE.', M, 684, 41, INK, W - 2 * M)
place(c, DL / 'stage-02.png', M, 308, 164, 320)
place(c, DL / 'stage-04.png', 224, 308, 164, 320)
place(c, DL / 'stage-01.png', 410, 308, 164, 320)
draw_hand(c, M, 70, 152, 194, CYAN, 0.22, True, 1.2)
body(c, 'Biomorphic structures, theatrical light, and responsive scenery make the architecture feel performed rather than installed.', 224, 236, 350, 10, 14)
show(c)

# 11 - soundstage
bg(c, WHITE)
spread_label(c, 'STAGE / RESPONSIVE ENVIRONMENT', 11, GREEN)
place(c, ASSETS / 'p10_i01.jpg', M, 222, W - 2 * M, 468)
title(c, 'DESIGN THE RESPONSE.', M, 153, 39, INK, W - 2 * M)
body(c, 'The architecture becomes part of the instrument.', M, 114, 310, 10, 14)
show(c)

# 12 - interaction principle
bg(c)
draw_hand(c, 376, 356, 235, 300, PINK, 0.14)
spread_label(c, 'PARTICIPATION / 02', 12, PURPLE)
title(c, 'TOUCH.', M, 625, 63)
title(c, 'MOVE.', M, 558, 63)
title(c, 'TRIGGER.', M, 491, 63)
body(c, 'Smart wearables activate effects. Interactive stages react to movement. Immersive tunnels turn navigation into performance. Each touchpoint makes one promise visible: your presence changes the world around you.', 330, 310, 244, 10.3, 15)
draw_hand(c, M, 83, 178, 226, INK)
show(c)

# 13 - interaction environment
bg(c, WHITE)
spread_label(c, 'INTERACTION / ENVIRONMENT', 13, PINK)
place(c, DL / 'interactive-03.png', M, 160, W - 2 * M, 550)
title(c, 'THE BODY BECOMES AN INTERFACE.', M, 81, 31, INK, W - 2 * M)
show(c)

# 14 - tools, natural proportions
bg(c)
spread_label(c, 'OBJECTS FOR PARTICIPATION', 14, PINK)
place(c, PUBLIC / 'merch-wristband-new.png', M, 390, 250, 300)
place(c, PUBLIC / 'interactive-pen-new.png', 324, 390, 250, 300)
label(c, '01 / RESPONSIVE WRISTBAND', M, 366, PURPLE)
label(c, '02 / GLOW MARK-MAKING TOOL', 324, 366, GREEN)
body(c, 'The technology is deliberately legible. It feels like a tool, a keepsake, and an invitation to participate at the same time.', 324, 292, 250, 10, 14.5)
draw_hand(c, 60, 92, 160, 203, PURPLE, 0.18, True, 1.1)
show(c)

# 15 - wearable in use
bg(c, WHITE)
spread_label(c, 'GESTURE / SIGNAL', 15, PURPLE)
place(c, ASSETS / 'p13_i04.jpg', M, 120, W - 2 * M, 600)
draw_hand(c, 430, 61, 132, 168, PINK)
show(c)

# 16 - identity divider
bg(c, PINK)
draw_hand(c, 86, 122, 440, 560, WHITE)
title(c, 'SOUND, MADE VISIBLE.', M, 64, 42, INK, W - 2 * M)
show(c)

# 17 - mark system
bg(c)
spread_label(c, 'THE MARK / A CHOREOGRAPHY', 17, PINK)
place(c, PUBLIC / 'visual-identity-logos.png', M, 286, W - 2 * M, 430)
body(c, 'The identity begins as a visualizer. Bars stretch into letterforms, then reorganize into a hand - sound and interaction held inside one modular structure.', M, 250, 340, 10, 14.5)
draw_hand(c, 434, 66, 128, 162, PURPLE, 0.95, True, 1.2)
show(c)

# 18 - hand anatomy
bg(c, WHITE)
spread_label(c, 'THE HAND / PRIMARY GESTURE', 18, CYAN)
draw_hand(c, 102, 118, 408, 520, INK)
label(c, 'VISUALIZER', 100, 680, PINK)
rule(c, 166, 678, 270, 678, PINK)
label(c, 'GESTURE', 430, 680, PINK)
rule(c, 394, 678, 426, 678, PINK)
body(c, 'FIVE BARS BECOME A BODY. SOUND BECOMES A SIGNAL. THE SIGNAL BECOMES A HAND.', 110, 92, 390, 8.5, 12, INK, True)
show(c)

# 19 - color system
bg(c)
spread_label(c, 'COLOR / ENERGY MAP', 19, PINK)
title(c, 'COLOR IS TEMPO.', M, 682, 44, INK, W - 2 * M)
sw = (W - 2 * M) / 6
for i, color in enumerate(PALETTE):
    c.setFillColor(color)
    c.rect(M + i * sw, 300, sw, 300, fill=1, stroke=0)
    draw_hand(c, M + i * sw + 17, 380, sw - 34, 130, WHITE, 0.88)
codes = ['#ED1D7E', '#6FCCDD', '#FED700', '#5D53A3', '#F04923', '#73BF44']
for i, code in enumerate(codes):
    label(c, code, M + i * sw + 5, 280, INK, 6)
body(c, 'Color is not decoration. It carries orientation, intensity, memory, and motion through every part of the festival world.', M, 220, 410, 10, 14)
show(c)

# 20 - identity in space
bg(c, WHITE)
spread_label(c, 'IDENTITY / IN SPACE', 20, PINK)
place(c, PUBLIC / 'visual-identity-exhibition.png', M, 164, W - 2 * M, 548)
title(c, 'A MARK LARGE ENOUGH TO BECOME ARCHITECTURE.', M, 83, 28, INK, W - 2 * M)
show(c)

# 21 - applications divider
bg(c, CYAN)
draw_hand(c, 65, 120, 482, 612, INK, 0.96, True, 4)
title(c, 'THE WORLD LEAVES THE STAGE.', M, 57, 38, INK, W - 2 * M)
show(c)

# 22 - poster series, full artwork
bg(c)
spread_label(c, 'LINEUP / POSTER SERIES', 22, PINK)
poster_w = 160
poster_h = 440
place(c, DL / 'poster-01.png', M, 210, poster_w, poster_h)
place(c, DL / 'poster-02.png', 226, 210, poster_w, poster_h)
place(c, DL / 'poster-03.png', 414, 210, poster_w, poster_h)
body(c, 'The lineup becomes a field of signals: repeatable, responsive, and readable at different scales.', 226, 150, 348, 10, 14)
draw_hand(c, M, 70, 110, 140, PINK)
show(c)

# 23 - poster detail
bg(c, WHITE)
spread_label(c, 'PRINT / DETAIL', 23, PURPLE)
place(c, ASSETS / 'p23_i01.png', M, 86, 360, 640, 'left')
draw_hand(c, 440, 430, 122, 155, GREEN)
title(c, 'A LINEUP', 430, 350, 30)
title(c, 'AS SIGNAL.', 430, 318, 30)
body(c, 'PRINT<br/>DIGITAL<br/>ENVIRONMENT', 430, 268, 144, 8.5, 14, PINK, True)
show(c)

# 24 - merchandise
bg(c)
spread_label(c, 'OBJECTS / MERCHANDISE', 24, PINK)
place(c, PUBLIC / 'Totebag-cooler.png', M, 410, 250, 300)
place(c, PUBLIC / 'person_wearing_back_of_shirt.png', 324, 410, 250, 300)
place(c, PUBLIC / 'wristband_on_someones_wrist.png', M, 86, W - 2 * M, 280)
draw_hand(c, 484, 48, 76, 96, PINK)
show(c)

# 25 - social portraits
bg(c, WHITE)
spread_label(c, 'PORTRAITS / PROGRAMMING', 25, CYAN)
tiles = [ASSETS / 'p22_i01.jpg', ASSETS / 'p22_i02.jpg', ASSETS / 'p22_i03.jpg', ASSETS / 'p22_i04.jpg']
positions = [(M, 408), (314, 408), (M, 132), (314, 132)]
for p, (x, y) in zip(tiles, positions):
    place(c, p, x, y, 260, 248)
draw_hand(c, 255, 337, 102, 130, PINK)
show(c)

# 26 - out of home
bg(c)
spread_label(c, 'CITY / OUT OF HOME', 26, PINK)
place(c, DL / 'ooh-04.jpg', M, 156, W - 2 * M, 558)
title(c, 'THE CITY BECOMES MEDIA.', M, 78, 34, INK, W - 2 * M)
show(c)

# 27 - motion
bg(c, WHITE)
spread_label(c, 'MOTION / SEQUENCE', 27, PURPLE)
place(c, ASSETS / 'p24_i01.jpg', M, 472, W - 2 * M, 220)
place(c, ASSETS / 'p25_i02.jpg', M, 220, 255, 210)
place(c, ASSETS / 'p25_i04.jpg', 319, 220, 255, 210)
draw_hand(c, M, 64, 122, 155, PINK)
body(c, 'The visualizer animates as a living signature: expanding, collapsing, and gathering into the hand.', 319, 156, 255, 10, 14)
show(c)

# 28 - process
bg(c)
spread_label(c, 'PROCESS / RAPID WORLD BUILDING', 28, PINK)
title(c, 'IMAGINE WIDELY. EDIT PRECISELY.', M, 684, 34, INK, W - 2 * M)
place(c, ASSETS / 'p09_i01.jp2', M, 315, 250, 320)
place(c, ASSETS / 'p09_i02.jp2', 324, 315, 250, 320)
body(c, 'AI accelerated early moodboarding and environment studies. The generated references remained raw material - each direction was filtered, redrawn, and rebuilt through a consistent design intent.', 324, 260, 250, 9.5, 13.5)
draw_hand(c, M, 67, 130, 165, CYAN, 0.32, True, 1)
show(c)

# 29 - exhibition
bg(c, WHITE)
spread_label(c, 'FUSION / RIT CAPSTONE SHOW', 29, PINK)
title(c, 'THE FICTION BECOMES PHYSICAL.', M, 684, 36, INK, W - 2 * M)
place(c, DL / 'show-01.png', M, 250, 258, 385)
place(c, DL / 'show-02.png', 316, 250, 258, 385)
body(c, 'Moving screens, printed matter, identity panels, and environmental graphics gathered into one final installation.', 316, 194, 258, 9.5, 13.5)
draw_hand(c, M, 55, 118, 150, PINK)
show(c)

# 30 - final image
bg(c)
spread_label(c, 'ONE WORLD / MANY SIGNALS', 30, CYAN)
place(c, ASSETS / 'p07_i01.jpg', M, 148, W - 2 * M, 566)
title(c, 'THE CROWD COMPLETES', M, 88, 26, INK, 390)
title(c, 'THE PICTURE.', M, 59, 26, INK, 300)
draw_hand(c, 478, 28, 82, 104, PINK)
show(c)

# 31 - closing hand
bg(c, PINK)
draw_hand(c, 58, 110, 496, 630, WHITE)
title(c, 'THE SIGNAL CONTINUES.', M, 54, 41, INK, W - 2 * M)
show(c)

# 32 - back cover
bg(c, WHITE)
place(c, ASSETS / 'p28_i01.jpg', 0, 0, W, H)
label(c, 'WWIMF / JAMES KORDIC / 2025', M, 30, WHITE)
show(c)

c.save()

source_reader = PdfReader(str(SOURCE))
interior_reader = PdfReader(str(INTERIOR))
writer = PdfWriter()
writer.add_page(source_reader.pages[0])
for page in interior_reader.pages:
    writer.add_page(page)
writer.add_metadata({
    '/Title': 'WorldWide Interactive Music Festival - Art and Concept Book',
    '/Author': 'James Kordic',
    '/Subject': 'WWIMF art and concept book',
})
with OUTPUT.open('wb') as stream:
    writer.write(stream)

assert len(PdfReader(str(OUTPUT)).pages) == 32
print(OUTPUT)
