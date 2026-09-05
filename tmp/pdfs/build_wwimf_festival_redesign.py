from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageFilter
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
HAND_SOURCE = ASSETS / 'p24_i02.jpg'
HAND_ASSET = ROOT / 'tmp/pdfs/wwimf_exact_hand_festival.png'
INTERIOR = ROOT / 'tmp/pdfs/wwimf_festival_redesign_interior.pdf'
OUTPUT = ROOT / 'output/pdf/wwimf-art-concept-book.pdf'

W, H = letter
M = 42
INK = HexColor('#191919')
PAPER = HexColor('#F7F7F4')
WHITE = HexColor('#FFFFFF')
PINK = HexColor('#ED1D7E')
CYAN = HexColor('#6FCCDD')
YELLOW = HexColor('#FED700')
PURPLE = HexColor('#5D53A3')
ORANGE = HexColor('#F04923')
GREEN = HexColor('#73BF44')
COLORS = [PINK, CYAN, YELLOW, PURPLE, ORANGE, GREEN]

CITYBURN_PATH = next(Path('/Users/jameskordic/Library/Fonts').glob('cityburn-*.ttf'))
pdfmetrics.registerFont(TTFont('Cityburn', str(CITYBURN_PATH)))
pdfmetrics.registerFont(TTFont('CourierNew', '/System/Library/Fonts/Supplemental/Courier New.ttf'))
pdfmetrics.registerFont(TTFont('CourierNew-Bold', '/System/Library/Fonts/Supplemental/Courier New Bold.ttf'))
pdfmetrics.registerFontFamily('CourierNew', normal='CourierNew', bold='CourierNew-Bold', italic='CourierNew', boldItalic='CourierNew-Bold')


def extract_hand():
    source = Image.open(HAND_SOURCE).convert('RGB')
    channels = source.point(lambda v: 255 if v > 245 else 0).split()
    mask = ImageChops.multiply(ImageChops.multiply(channels[0], channels[1]), channels[2])
    bbox = mask.getbbox()
    if bbox is None:
        raise RuntimeError('Exact hand mark could not be extracted')
    mask = mask.crop(bbox).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    out = Image.new('RGBA', mask.size, (255, 255, 255, 0))
    out.putalpha(mask)
    out.save(HAND_ASSET)


extract_hand()


def bg(c, color=PAPER):
    c.setFillColor(color)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def gradient(c, x=0, y=0, w=W, h=H, horizontal=False, steps=180):
    stops = [PINK, ORANGE, YELLOW, GREEN, CYAN, PURPLE, PINK]
    for i in range(steps):
        p = i / (steps - 1)
        idx = min(len(stops) - 2, int(p * (len(stops) - 1)))
        mix = p * (len(stops) - 1) - idx
        a, b = stops[idx], stops[idx + 1]
        col = Color(a.red + (b.red - a.red) * mix, a.green + (b.green - a.green) * mix, a.blue + (b.blue - a.blue) * mix)
        c.setFillColor(col)
        if horizontal:
            c.rect(x + w * i / steps, y, w / steps + 0.6, h, fill=1, stroke=0)
        else:
            c.rect(x, y + h * i / steps, w, h / steps + 0.6, fill=1, stroke=0)


def hand(c, x, y, w, color=WHITE, alpha=1.0):
    mask = Image.open(HAND_ASSET).convert('RGBA')
    a = mask.getchannel('A')
    tint = Image.new('RGBA', mask.size, (
        round(color.red * 255), round(color.green * 255), round(color.blue * 255), 0
    ))
    tint.putalpha(a)
    h = w * mask.height / mask.width
    c.saveState()
    c.setFillAlpha(alpha)
    c.drawImage(ImageReader(tint), x, y, w, h, preserveAspectRatio=True, mask='auto')
    c.restoreState()
    return h


def place(c, path, x, y, w, h, halign='center', valign='middle'):
    path = Path(path)
    im = Image.open(path)
    iw, ih = im.size
    scale = min(w / iw, h / ih)
    rw, rh = iw * scale, ih * scale
    dx = {'left': 0, 'center': (w - rw) / 2, 'right': w - rw}[halign]
    dy = {'bottom': 0, 'middle': (h - rh) / 2, 'top': h - rh}[valign]
    c.drawImage(ImageReader(str(path)), x + dx, y + dy, rw, rh, preserveAspectRatio=True, mask='auto')
    return x + dx, y + dy, rw, rh


def image_row(c, paths, x, y, width, max_height, gap=4):
    """Build a flush image row while preserving every image's native ratio."""
    aspects = []
    for path in paths:
        im = Image.open(path)
        aspects.append(im.width / im.height)
    row_h = min(max_height, (width - gap * (len(paths) - 1)) / sum(aspects))
    row_w = row_h * sum(aspects) + gap * (len(paths) - 1)
    cursor = x + (width - row_w) / 2
    for path, aspect in zip(paths, aspects):
        iw = row_h * aspect
        c.drawImage(ImageReader(str(path)), cursor, y, iw, row_h, preserveAspectRatio=True, mask='auto')
        cursor += iw + gap
    return row_h, row_w


def label(c, value, x, y, color=INK, size=7.5):
    c.setFillColor(color)
    t = c.beginText(x, y)
    t.setFont('CourierNew-Bold', size)
    t.setCharSpace(0.65)
    t.textLine(value.upper())
    c.drawText(t)


def title(c, value, x, y, size=42, color=INK, max_width=None):
    actual = size
    if max_width:
        while actual > 13 and pdfmetrics.stringWidth(value.upper(), 'Cityburn', actual) > max_width:
            actual -= 1
    c.setFillColor(color)
    c.setFont('Cityburn', actual)
    c.drawString(x, y, value.upper())


def body(c, value, x, top, width, size=9.5, leading=13.5, color=INK, bold=False):
    style = ParagraphStyle(
        'body', fontName='CourierNew-Bold' if bold else 'CourierNew',
        fontSize=size, leading=leading, textColor=color, alignment=TA_LEFT,
        splitLongWords=True, allowWidows=0, allowOrphans=0,
    )
    p = Paragraph(value, style)
    _, ph = p.wrap(width, H)
    p.drawOn(c, x, top - ph)
    return top - ph


def rule(c, x1, y1, x2, y2, color=INK, width=0.5):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)


def folio(c, page, color=INK):
    c.setFillColor(color)
    c.setFont('CourierNew', 7)
    c.drawString(M, 20, f'{page:02d}')
    hand(c, W - 52, 13, 17, color)


def chapter(c, page, name, number, color=PINK, hand_color=WHITE):
    gradient(c)
    c.saveState()
    c.setFillColor(color)
    c.setFillAlpha(0.22)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()
    hand(c, 116, 166, 380, hand_color)
    label(c, f'{number} / {name}', M, H - 40, WHITE, 8.5)
    title(c, name, M, 64, 49, WHITE, W - 2 * M)
    folio(c, page, WHITE)
    c.showPage()


c = canvas.Canvas(str(INTERIOR), pagesize=letter, pageCompression=1)
c.setTitle('WorldWide Interactive Music Festival - Redesigned Edition')
c.setAuthor('James Kordic')
c.setSubject('WWIMF festival art and concept book')

# 02 - opening image
bg(c, INK)
place(c, ASSETS / 'p02_i01.jp2', 0, 0, W, H)
hand(c, W - 152, 62, 104, WHITE)
label(c, 'A FESTIVAL THAT LISTENS BACK', M, H - 38, WHITE)
folio(c, 2, WHITE)
c.showPage()

# 03 - second opening image
bg(c, INK)
place(c, ASSETS / 'p03_i01.jp2', 0, 0, W, H)
title(c, 'MUSIC IS NOT', M, 90, 44, WHITE, W - 2 * M)
title(c, 'A SPECTATOR SPORT.', M, 50, 35, WHITE, W - 2 * M)
folio(c, 3, WHITE)
c.showPage()

# 04 - contents opener
chapter(c, 4, 'CONTENTS', '00', PURPLE)

# 05 - contents list
bg(c, WHITE)
label(c, 'FIELD GUIDE / FOUR SIGNALS', M, H - 40, PINK)
items = [('01', 'INTRODUCTION', '06-07', PINK), ('02', 'CONCEPT ART', '08-13', CYAN), ('03', 'VISUAL IDENTITY', '14-19', PURPLE), ('04', 'APPLICATIONS', '20-26', ORANGE), ('05', 'CLOSING', '27-28', GREEN)]
y = H - 122
for number, name, pages, color in items:
    hand(c, M, y - 20, 44, color)
    label(c, number, 112, y + 25, color, 8)
    title(c, name, 148, y + 7, 25, INK, 310)
    label(c, pages, 514, y + 15, INK, 7.5)
    rule(c, 112, y - 8, W - M, y - 8, HexColor('#D7D7D3'))
    y -= 130
folio(c, 5)
c.showPage()

# 06 - overview
bg(c)
label(c, '01 / INTRODUCTION', M, H - 40, PINK)
title(c, 'THE FESTIVAL, REWIRED.', M, H - 105, 43, INK, W - 2 * M)
body(c, '<b>WWIMF is a conceptual global music festival where music, visual art, and emerging technology converge through active participation.</b>', M, H - 150, 235, 10, 14, INK, True)
body(c, 'Traditional festivals position the audience as spectators. WWIMF proposes responsive environments, stages, and tools that react to presence, gesture, and movement - turning each attendee into a contributor.', 326, H - 150, 244, 9.7, 14)
place(c, ASSETS / 'p07_i01.jpg', M, 88, 370, 420, 'left', 'bottom')
hand(c, 447, 182, 126, PINK)
body(c, 'THE AUDIENCE IS NOT A BACKDROP.<br/>IT IS PART OF THE INSTRUMENT.', 447, 154, 128, 7.8, 11.5, INK, True)
folio(c, 6)
c.showPage()

# 07 - premise image statement
bg(c, WHITE)
place(c, DL / 'stage-03.png', M, 190, W - 2 * M, 520)
title(c, 'WHAT IF THE CROWD', M, 119, 37, INK, W - 2 * M)
title(c, 'COULD SHAPE THE SHOW?', M, 82, 37, PINK, W - 2 * M)
folio(c, 7)
c.showPage()

# 08 - concept art divider
chapter(c, 8, 'CONCEPT ART', '02', CYAN)

# 09 - AI and design
bg(c)
label(c, 'PROCESS / AI AND DESIGN', M, H - 40, PINK)
title(c, 'IMAGINE WIDELY. EDIT HARD.', M, H - 96, 38, INK, W - 2 * M)
image_row(c, [ASSETS / 'p09_i01.jp2', ASSETS / 'p09_i02.jp2'], M, 365, W - 2 * M, 295, 5)
body(c, 'Artificial intelligence supported the earliest phase of the project as an ideation tool. It accelerated moodboarding, naming, and environment studies, allowing a wider range of directions to be compared quickly.', M, 318, 238, 9.5, 13.5)
body(c, 'The generated references were treated as raw material, not final design. Every idea was filtered through a clear intent and rebuilt through typography, identity, spatial mockups, and motion.', 326, 318, 244, 9.5, 13.5)
hand(c, 430, 60, 130, PURPLE)
folio(c, 9)
c.showPage()

# 10 - hero mockup
bg(c, WHITE)
label(c, 'ENVIRONMENT / HERO WORLD', M, H - 40, GREEN)
title(c, 'A STAGE THAT RESPONDS.', M, H - 96, 40, INK, W - 2 * M)
place(c, ASSETS / 'p10_i01.jpg', M, 306, W - 2 * M, 360)
body(c, 'Architecture, lighting, and digital media converge into a performance environment that extends beyond a traditional stage. The visual world makes interactivity visible before the audience ever touches a device.', M, 258, 355, 9.5, 13.5)
hand(c, 447, 58, 112, PINK)
folio(c, 10)
c.showPage()

# 11 - connected stage studies
bg(c, INK)
image_row(c, [ASSETS / 'p11_i01.png'], 0, 528, W, 264, 0)
image_row(c, [ASSETS / 'p11_i03.jpg'], 0, 264, W, 264, 0)
image_row(c, [ASSETS / 'p11_i02.png'], 0, 0, W, 264, 0)
label(c, 'THREE WORLDS / ONE SYSTEM', M, H - 38, WHITE)
folio(c, 11, WHITE)
c.showPage()

# 12 - passage
bg(c, WHITE)
label(c, 'PASSAGE / LIGHT AS WAYFINDING', M, H - 40, PINK)
place(c, ASSETS / 'p12_i01.jpg', M, 165, W - 2 * M, 545)
title(c, 'THE PATH IS PART OF THE SHOW.', M, 85, 30, INK, W - 2 * M)
hand(c, 480, 45, 80, CYAN)
folio(c, 12)
c.showPage()

# 13 - interaction collage
bg(c, INK)
image_row(c, [ASSETS / 'p13_i04.jpg'], 0, 528, W, 264, 0)
image_row(c, [ASSETS / 'p13_i02.jpg'], 0, 264, W, 264, 0)
image_row(c, [ASSETS / 'p13_i03.jpg'], 0, 0, W, 264, 0)
label(c, 'TOUCH / MOVE / TRIGGER', M, H - 38, WHITE)
folio(c, 13, WHITE)
c.showPage()

# 14 - identity divider
chapter(c, 14, 'VISUAL IDENTITY', '03', PINK)

# 15 - logos
bg(c, WHITE)
label(c, 'THE LOGOS / SOUND MADE VISIBLE', M, H - 40, PINK)
place(c, PUBLIC / 'visual-identity-logos.png', M, 260, W - 2 * M, 455)
body(c, 'The primary wordmark begins as a music visualizer. The secondary mark turns that same structure into a hand - one system joining sound, interaction, rhythm, and gesture.', M, 220, 360, 9.5, 13.5)
hand(c, 445, 60, 112, PURPLE)
folio(c, 15)
c.showPage()

# 16 - exact hand study
bg(c)
label(c, 'SECONDARY LOGO / THE HAND', M, H - 40, PURPLE)
hand(c, M, 165, 350, INK)
title(c, 'ONE GESTURE.', 416, 575, 25, PINK, 155)
title(c, 'ENDLESS SIGNALS.', 416, 546, 25, INK, 155)
body(c, 'The hand is intentional: it is both interface and invitation. Its visualizer bars can shift in rhythm while the silhouette stays recognizable.', 416, 492, 155, 8.5, 12)
for i, color in enumerate(COLORS):
    hand(c, 410 + (i % 2) * 82, 252 - (i // 2) * 83, 62, color)
folio(c, 16)
c.showPage()

# 17 - typography
bg(c, WHITE)
label(c, 'TYPOGRAPHY / VOICE', M, H - 40, PINK)
title(c, 'LOUD / HUMAN / DIRECT', M, H - 96, 42, INK, W - 2 * M)
title(c, 'Aa', M, 450, 145, INK)
title(c, 'CITYBURN REGULAR', M, 405, 24, PINK)
body(c, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>abcdefghijklmnopqrstuvwxyz<br/>0123456789', 326, 540, 244, 10, 17, INK, True)
rule(c, M, 355, W - M, 355, HexColor('#D7D7D3'))
c.setFillColor(INK)
c.setFont('CourierNew-Bold', 116)
c.drawString(M, 198, 'Aa')
label(c, 'COURIER NEW BOLD / INFORMATION', M, 166, CYAN)
body(c, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>abcdefghijklmnopqrstuvwxyz<br/>0123456789', 326, 284, 244, 10, 17)
folio(c, 17)
c.showPage()

# 18 - color system
bg(c)
label(c, 'COLOR / ENERGY SYSTEM', M, H - 40, PINK)
title(c, 'COLOR IS TEMPO.', M, H - 96, 42, INK, W - 2 * M)
sw = (W - 2 * M) / 6
for i, color in enumerate(COLORS):
    c.setFillColor(color)
    c.rect(M + i * sw, 245, sw, 390, fill=1, stroke=0)
    hand(c, M + i * sw + 15, 374, sw - 30, WHITE)
codes = ['#ED1D7E', '#6FCCDD', '#FED700', '#5D53A3', '#F04923', '#73BF44']
for i, code in enumerate(codes):
    label(c, code, M + i * sw + 4, 224, INK, 5.7)
body(c, 'Bold, vibrant, and abstract. The palette is designed to carry movement across environments, screens, printed matter, and objects.', M, 172, 410, 9.5, 13.5)
folio(c, 18)
c.showPage()

# 19 - gradient field
gradient(c)
c.saveState()
c.setFillColor(WHITE)
c.setFillAlpha(0.18)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.restoreState()
hand(c, 132, 148, 348, WHITE)
title(c, 'A FIELD OF ENERGY.', M, 65, 40, WHITE, W - 2 * M)
folio(c, 19, WHITE)
c.showPage()

# 20 - applications divider
chapter(c, 20, 'APPLICATIONS', '04', ORANGE)

# 21 - merchandise grid
bg(c, WHITE)
label(c, 'MERCHANDISE / OBJECTS', M, H - 40, PURPLE)
image_row(c, [ASSETS / 'p21_i01.jpg', ASSETS / 'p21_i02.jpg'], M, 400, W - 2 * M, 300, 12)
place(c, ASSETS / 'p21_i03.jpg', M, 76, W - 2 * M, 300)
folio(c, 21)
c.showPage()

# 22 - social system
bg(c, WHITE)
label(c, 'SOCIAL / PROGRAMMING', M, H - 40, PINK)
top_h, _ = image_row(c, [ASSETS / 'p22_i01.jpg', ASSETS / 'p22_i03.jpg'], M, 432, W - 2 * M, 255, 10)
c.setFillColor(INK)
c.rect(M, 350, W - 2 * M, 62, fill=1, stroke=0)
title(c, 'INSTAGRAM POSTS', M + 62, 366, 28, WHITE, W - 2 * M - 124)
image_row(c, [ASSETS / 'p22_i02.jpg', ASSETS / 'p22_i04.jpg'], M, 76, W - 2 * M, 255, 10)
folio(c, 22)
c.showPage()

# 23 - posters as a system
bg(c)
label(c, 'LINEUP / POSTER SYSTEM', M, H - 40, PINK)
image_row(c, [DL / 'poster-01.png', DL / 'poster-02.png', DL / 'poster-03.png'], M, 156, W - 2 * M, 530, 10)
hand(c, M, 50, 76, GREEN)
body(c, 'One lineup. Three colorways. A visualizer that scales from a social post to a city wall.', 150, 118, 420, 9.5, 13.5)
folio(c, 23)
c.showPage()

# 24 - motion sequence
bg(c, WHITE)
label(c, 'MOTION / SEQUENCE A', M, H - 40, PURPLE)
place(c, ASSETS / 'p24_i01.jpg', M, 522, W - 2 * M, 205)
place(c, ASSETS / 'p24_i02.jpg', M, 292, W - 2 * M, 205)
place(c, ASSETS / 'p24_i03.jpg', M, 62, W - 2 * M, 205)
folio(c, 24)
c.showPage()

# 25 - motion sequence and QR
bg(c)
label(c, 'MOTION / SEQUENCE B', M, H - 40, PINK)
place(c, ASSETS / 'p25_i02.jpg', M, 480, W - 2 * M, 220)
place(c, ASSETS / 'p25_i04.jpg', M, 236, W - 2 * M, 220)
place(c, ASSETS / 'p25_i05.png', M, 62, 140, 140, 'left', 'bottom')
body(c, 'SCAN TO WATCH THE MOTION SYSTEM IN CONTEXT.', 220, 156, 335, 9, 13, INK, True)
hand(c, 452, 50, 104, PINK)
folio(c, 25)
c.showPage()

# 26 - physical exhibition
bg(c, WHITE)
label(c, 'FUSION / RIT CAPSTONE SHOW', M, H - 40, PINK)
title(c, 'THE FICTION BECOMES PHYSICAL.', M, H - 96, 35, INK, W - 2 * M)
image_row(c, [DL / 'show-01.png', DL / 'show-02.png'], M, 252, W - 2 * M, 370, 10)
body(c, 'Moving screens, printed matter, identity panels, environmental graphics, and the book itself gathered into one final installation.', 326, 204, 244, 9.5, 13.5)
hand(c, M, 55, 115, CYAN)
folio(c, 26)
c.showPage()

# 27 - closing
gradient(c)
hand(c, 112, 154, 388, WHITE)
label(c, '05 / CLOSING', M, H - 40, WHITE)
title(c, 'THE SIGNAL CONTINUES.', M, 64, 41, WHITE, W - 2 * M)
folio(c, 27, WHITE)
c.showPage()

c.save()

# Preserve the original cover and back cover exactly.
source = PdfReader(str(SOURCE))
interior = PdfReader(str(INTERIOR))
writer = PdfWriter()
writer.add_page(source.pages[0])
for page in interior.pages:
    writer.add_page(page)
writer.add_page(source.pages[27])
writer.add_metadata({
    '/Title': 'WorldWide Interactive Music Festival - Redesigned Edition',
    '/Author': 'James Kordic',
    '/Subject': 'WWIMF festival art and concept book',
})
with OUTPUT.open('wb') as stream:
    writer.write(stream)

assert len(PdfReader(str(OUTPUT)).pages) == 28
print(OUTPUT)
