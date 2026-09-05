from __future__ import annotations

import hashlib
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps
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
CACHE = ROOT / 'tmp/pdfs/wwimf_artbook_cache'
INTERIOR = ROOT / 'tmp/pdfs/wwimf_artbook_interior.pdf'
OUTPUT = ROOT / 'output/pdf/wwimf-art-concept-book.pdf'

CACHE.mkdir(parents=True, exist_ok=True)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

W, H = letter
BLACK = HexColor('#080808')
WHITE = HexColor('#FFFFFF')
PAPER = HexColor('#F3F1EC')
PINK = HexColor('#ED1D7E')
CYAN = HexColor('#6FCCDD')
YELLOW = HexColor('#FED700')
PURPLE = HexColor('#5D53A3')
ORANGE = HexColor('#F04923')
GREEN = HexColor('#73BF44')

SANS = '/System/Library/Fonts/Supplemental/Arial.ttf'
SANS_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
MONO = '/System/Library/Fonts/Supplemental/Courier New.ttf'
MONO_BOLD = '/System/Library/Fonts/Supplemental/Courier New Bold.ttf'
CITYBURN = next(Path('/Users/jameskordic/Library/Fonts').glob('cityburn-*.ttf'))

pdfmetrics.registerFont(TTFont('Cityburn', str(CITYBURN)))
pdfmetrics.registerFont(TTFont('Arial', SANS))
pdfmetrics.registerFont(TTFont('Arial-Bold', SANS_BOLD))
pdfmetrics.registerFont(TTFont('CourierNew', MONO))
pdfmetrics.registerFont(TTFont('CourierNew-Bold', MONO_BOLD))


def fit_image(path: Path, width: int, height: int, anchor=(0.5, 0.5), mono=False, contrast=1.0) -> Path:
    key = hashlib.sha1(f'{path}:{width}:{height}:{anchor}:{mono}:{contrast}'.encode()).hexdigest()[:18]
    out = CACHE / f'{key}.jpg'
    if not out.exists():
        im = Image.open(path).convert('RGB')
        im = ImageOps.fit(im, (max(2, width), max(2, height)), Image.Resampling.LANCZOS, centering=anchor)
        if mono:
            im = ImageOps.grayscale(im).convert('RGB')
        if contrast != 1.0:
            im = ImageEnhance.Contrast(im).enhance(contrast)
        im.save(out, quality=95, subsampling=0)
    return out


def image_cover(c, path, x, y, w, h, anchor=(0.5, 0.5), mono=False, contrast=1.0):
    """Place the complete source image without cropping or distorting it."""
    path = Path(path)
    im = Image.open(path)
    iw, ih = im.size
    scale = min(w / iw, h / ih)
    rw, rh = iw * scale, ih * scale
    c.setFillColor(BLACK)
    c.rect(x, y, w, h, fill=1, stroke=0)
    c.drawImage(
        ImageReader(str(path)),
        x + (w - rw) / 2,
        y + (h - rh) / 2,
        rw,
        rh,
        preserveAspectRatio=True,
        mask='auto',
    )


def image_contain(c, path, x, y, w, h, pad=0):
    im = Image.open(path)
    iw, ih = im.size
    scale = min((w - 2 * pad) / iw, (h - 2 * pad) / ih)
    rw, rh = iw * scale, ih * scale
    c.drawImage(ImageReader(str(path)), x + (w - rw) / 2, y + (h - rh) / 2, rw, rh, mask='auto')


def fill(c, color):
    c.setFillColor(color)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def overlay(c, color=BLACK, alpha=0.42):
    c.saveState()
    c.setFillColor(color)
    c.setFillAlpha(alpha)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()


def para(c, text, x, top, width, font='Bodoni', size=13, leading=17, color=BLACK, align=TA_LEFT):
    if font.startswith('Bodoni'):
        font = 'Cityburn' if size >= 20 else 'CourierNew'
    elif font.startswith('Arial'):
        font = 'CourierNew-Bold' if font.endswith('Bold') else 'CourierNew'
    style = ParagraphStyle(
        'p', fontName=font, fontSize=size, leading=leading, textColor=color,
        alignment=align, splitLongWords=True, allowWidows=0, allowOrphans=0,
    )
    p = Paragraph(text, style)
    _, ph = p.wrap(width, H)
    p.drawOn(c, x, top - ph)
    return top - ph


def text(c, value, x, y, font='Bodoni', size=28, color=BLACK, tracking=None):
    if font.startswith('Bodoni'):
        font = 'Cityburn'
    c.setFillColor(color)
    c.setFont(font, size)
    if tracking is None:
        c.drawString(x, y, value)
    else:
        t = c.beginText(x, y)
        t.setFont(font, size)
        t.setCharSpace(tracking)
        t.textLine(value)
        c.drawText(t)


def text_right(c, value, x, y, font='CourierNew', size=7.5, color=BLACK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawRightString(x, y, value)


def label(c, value, x, y, color=BLACK, size=7.5):
    text(c, value.upper(), x, y, 'CourierNew-Bold', size, color, 0.5)


def rule(c, x1, y1, x2, y2, color=BLACK, width=0.45):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)


def folio(c, page, color=BLACK):
    text(c, f'{page:02d}', 34, 24, 'CourierNew', 7.5, color)


def bars(c, x, y, w, h, color=WHITE, count=8, seed=0):
    values = [0.34, 0.66, 0.93, 0.48, 0.76, 0.57, 0.86, 0.39, 0.71]
    gap = w * 0.024
    bw = (w - gap * (count - 1)) / count
    for i in range(count):
        bh = h * values[(i + seed) % len(values)]
        c.setFillColor(color)
        c.rect(x + i * (bw + gap), y, bw, bh, fill=1, stroke=0)


def gradient(c, x, y, w, h, horizontal=True, steps=180):
    stops = [PINK, ORANGE, YELLOW, GREEN, CYAN, PURPLE, PINK]
    for i in range(steps):
        pos = i / (steps - 1)
        idx = min(len(stops) - 2, int(pos * (len(stops) - 1)))
        mix = pos * (len(stops) - 1) - idx
        a, b = stops[idx], stops[idx + 1]
        col = Color(a.red + (b.red - a.red) * mix, a.green + (b.green - a.green) * mix, a.blue + (b.blue - a.blue) * mix)
        c.setFillColor(col)
        if horizontal:
            c.rect(x + w * i / steps, y, w / steps + 0.5, h, fill=1, stroke=0)
        else:
            c.rect(x, y + h * i / steps, w, h / steps + 0.5, fill=1, stroke=0)


def show(c):
    c.showPage()


c = canvas.Canvas(str(INTERIOR), pagesize=letter, pageCompression=1)
c.setTitle('WorldWide Interactive Music Festival - Art and Concept Book')
c.setAuthor('James Kordic')
c.setSubject('WWIMF art and concept book')

# 02 - inside cover
fill(c, BLACK)
bars(c, 418, 54, 154, 122, PINK, 7, 1)
label(c, 'A SPECULATIVE FESTIVAL WORLD', 38, H - 44, WHITE)
text(c, 'WWIMF', 38, 78, 'Bodoni-Italic', 38, WHITE)
text(c, 'WORLDWIDE INTERACTIVE MUSIC FESTIVAL', 38, 56, 'CourierNew', 7.5, WHITE, 0.4)
show(c)

# 03 - title page
fill(c, PAPER)
label(c, 'WORLDWIDE / 2025', 38, H - 45, PINK)
text(c, 'A festival', 38, 504, 'Bodoni-Italic', 60, BLACK)
text(c, 'you do not', 38, 435, 'Bodoni-Italic', 60, BLACK)
text(c, 'simply attend.', 38, 366, 'Bodoni-Italic', 60, BLACK)
rule(c, 38, 318, 574, 318, BLACK, 0.7)
para(c, 'A concept book by James Kordic<br/>RIT Graphic Design Capstone', 38, 286, 260, 'CourierNew', 9, 14, BLACK)
bars(c, 370, 58, 204, 205, BLACK, 7, 3)
folio(c, 3)
show(c)

# 04 - manifesto left
image_cover(c, ASSETS / 'p02_i01.jp2', 0, 0, W, H, (0.45, 0.5))
overlay(c, BLACK, 0.18)
label(c, 'MANIFESTO / 01', 38, H - 44, WHITE)
text(c, 'MUSIC', 38, 110, 'Bodoni-Bold', 102, WHITE)
folio(c, 4, WHITE)
show(c)

# 05 - manifesto right
image_cover(c, ASSETS / 'p03_i01.jp2', 0, 0, W, H, (0.55, 0.5))
overlay(c, BLACK, 0.18)
text(c, 'IS ALIVE.', 38, 110, 'Bodoni-Bold', 86, WHITE)
para(c, 'It changes when bodies gather. It becomes larger than the stage.', 330, H - 50, 242, 'Bodoni-Italic', 16, 20, WHITE)
folio(c, 5, WHITE)
show(c)

# 06 - premise essay
fill(c, PAPER)
label(c, 'THE PREMISE', 38, H - 44, PINK)
text(c, 'What if the crowd', 38, H - 128, 'Bodoni-Italic', 47, BLACK)
text(c, 'could shape the show?', 38, H - 181, 'Bodoni-Italic', 47, BLACK)
para(c, '<b>WWIMF is a conceptual global music festival where music, visual art, and emerging technology converge through active participation.</b>', 38, H - 256, 250, 'Arial-Bold', 11.5, 17, BLACK)
para(c, 'Traditional festivals often place the audience at the edge of the experience. WWIMF imagines a different relationship: the event listens back. Light, sound, space, and image respond to presence, gesture, and movement.', 324, H - 256, 250, 'Bodoni', 13, 18, BLACK)
gradient(c, 38, 65, 536, 11)
folio(c, 6)
show(c)

# 07 - premise image
image_cover(c, DL / 'stage-03.png', 0, 0, W, H, (0.5, 0.5))
overlay(c, BLACK, 0.10)
para(c, 'The audience is not a backdrop.<br/><i>It is part of the instrument.</i>', 38, H - 64, 330, 'Bodoni', 23, 29, WHITE)
folio(c, 7, WHITE)
show(c)

# 08 - threshold
fill(c, BLACK)
text(c, 'ENTER', 38, 520, 'Bodoni-Bold', 126, WHITE)
text(c, 'THE', 38, 394, 'Bodoni-Italic', 84, PINK)
text(c, 'SIGNAL.', 38, 250, 'Bodoni-Bold', 126, WHITE)
label(c, 'WORLD BUILDING / ATMOSPHERE', 38, 58, CYAN)
folio(c, 8, WHITE)
show(c)

# 09 - world study
image_cover(c, ASSETS / 'p12_i01.jpg', 0, 0, W, H, (0.5, 0.5))
overlay(c, PURPLE, 0.13)
label(c, 'PASSAGE / LIGHT AS WAYFINDING', 38, H - 44, WHITE)
folio(c, 9, WHITE)
show(c)

# 10 - environmental triptych
fill(c, PAPER)
label(c, 'ENVIRONMENT STUDIES', 38, H - 44, PINK)
text(c, 'A WORLD BEFORE', 38, H - 108, 'Bodoni-Bold', 43, BLACK)
text(c, 'A SCHEDULE.', 38, H - 156, 'Bodoni-Italic', 43, BLACK)
image_cover(c, DL / 'stage-02.png', 38, 330, 166, 270, (0.44, 0.5))
image_cover(c, DL / 'stage-04.png', 223, 330, 166, 270, (0.5, 0.5))
image_cover(c, DL / 'stage-01.png', 408, 330, 166, 270, (0.58, 0.5))
para(c, 'Biomorphic structures, theatrical light, and responsive scenery make the architecture feel performed rather than installed.', 223, 275, 351, 'Bodoni', 13, 18, BLACK)
folio(c, 10)
show(c)

# 11 - soundstage
image_cover(c, ASSETS / 'p10_i01.jpg', 0, 0, W, H, (0.5, 0.5))
overlay(c, BLACK, 0.10)
text(c, 'THE STAGE', 38, 92, 'Bodoni-Bold', 65, WHITE)
text(c, 'LISTENS BACK.', 38, 43, 'Bodoni-Italic', 45, WHITE)
folio(c, 11, WHITE)
show(c)

# 12 - interaction essay
fill(c, WHITE)
label(c, 'PARTICIPATION / 02', 38, H - 44, PURPLE)
text(c, 'Touch.', 38, 590, 'Bodoni-Italic', 70, BLACK)
text(c, 'Move.', 38, 508, 'Bodoni-Italic', 70, BLACK)
text(c, 'Trigger.', 38, 426, 'Bodoni-Italic', 70, BLACK)
para(c, 'Smart wearables activate effects. Interactive stages react to movement. Immersive tunnels turn navigation into performance. Each touchpoint makes one promise visible: your presence changes the world around you.', 330, 610, 242, 'Bodoni', 13, 19, BLACK)
gradient(c, 330, 80, 242, 18, False)
label(c, 'THE BODY BECOMES AN INTERFACE', 38, 80, PINK)
folio(c, 12)
show(c)

# 13 - interaction full bleed
image_cover(c, DL / 'interactive-03.png', 0, 0, W, H, (0.5, 0.5))
overlay(c, BLACK, 0.24)
para(c, 'Design the response,<br/><i>not just the object.</i>', 38, 160, 400, 'Bodoni', 34, 39, WHITE)
folio(c, 13, WHITE)
show(c)

# 14 - tools collage
fill(c, PAPER)
label(c, 'OBJECTS FOR PARTICIPATION', 38, H - 44, PINK)
image_cover(c, PUBLIC / 'merch-wristband-new.png', 38, 385, 256, 310, (0.5, 0.5))
image_cover(c, PUBLIC / 'interactive-pen-new.png', 318, 385, 256, 310, (0.5, 0.5))
label(c, '01 / RESPONSIVE WRISTBAND', 38, 362, PURPLE)
label(c, '02 / GLOW MARK-MAKING TOOL', 318, 362, GREEN)
para(c, 'The technology is deliberately legible. It feels like a tool, a keepsake, and an invitation to participate at the same time.', 318, 314, 256, 'Bodoni-Italic', 15, 20, BLACK)
folio(c, 14)
show(c)

# 15 - interactive crowd
image_cover(c, ASSETS / 'p13_i04.jpg', 0, 0, W, H, (0.5, 0.5))
overlay(c, BLACK, 0.13)
label(c, 'THE GESTURE BECOMES VISIBLE', 38, H - 44, WHITE)
folio(c, 15, WHITE)
show(c)

# 16 - identity divider
fill(c, PINK)
bars(c, 38, 246, 536, 356, WHITE, 8, 0)
text(c, 'SOUND,', 38, 150, 'Bodoni-Bold', 80, BLACK)
text(c, 'MADE VISIBLE.', 38, 82, 'Bodoni-Italic', 61, BLACK)
folio(c, 16, BLACK)
show(c)

# 17 - mark system
fill(c, PAPER)
label(c, 'THE MARK / A CHOREOGRAPHY', 38, H - 44, PINK)
image_contain(c, PUBLIC / 'visual-identity-logos.png', 38, 318, 536, 390, 0)
para(c, 'The identity begins as a visualizer. Bars stretch into letterforms, then reorganize into a hand - sound and interaction held inside one modular structure.', 38, 260, 350, 'Bodoni', 14, 20, BLACK)
text(c, '01', 500, 246, 'Bodoni-Italic', 54, PURPLE)
folio(c, 17)
show(c)

# 18 - hand abstraction
gradient(c, 0, 0, W, H, False)
c.setFillColor(BLACK)
c.setFillAlpha(0.74)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillAlpha(1)
bars(c, 102, 190, 408, 420, WHITE, 7, 2)
text(c, 'A HAND.', 38, 82, 'Bodoni-Italic', 54, WHITE)
text_right(c, 'A VISUALIZER. A WAVE. A CROWD.', 574, 43, 'CourierNew-Bold', 7.5, WHITE)
folio(c, 18, WHITE)
show(c)

# 19 - color field
gradient(c, 0, 0, W, H, False)
text(c, 'COLOR IS', 38, 646, 'Bodoni-Bold', 63, WHITE)
text(c, 'NOT DECORATION.', 38, 580, 'Bodoni-Italic', 55, BLACK)
para(c, 'It is tempo, orientation, heat, memory, and motion.', 38, 518, 300, 'Bodoni', 17, 23, BLACK)
label(c, '#ED1D7E  #6FCCDD  #FED700', 38, 62, WHITE)
label(c, '#5D53A3  #F04923  #73BF44', 38, 45, WHITE)
folio(c, 19, WHITE)
show(c)

# 20 - visual identity in space
image_cover(c, PUBLIC / 'visual-identity-exhibition.png', 0, 0, W, H, (0.5, 0.5))
overlay(c, BLACK, 0.12)
label(c, 'IDENTITY / IN SPACE', 38, H - 44, WHITE)
text(c, 'A system large enough', 38, 88, 'Bodoni-Italic', 32, WHITE)
text(c, 'to become architecture.', 38, 51, 'Bodoni-Italic', 32, WHITE)
folio(c, 20, WHITE)
show(c)

# 21 - applications divider
fill(c, BLACK)
label(c, 'ARTIFACTS / 03', 38, H - 44, YELLOW)
text(c, 'THE WORLD', 38, 516, 'Bodoni-Bold', 92, WHITE)
text(c, 'LEAVES', 38, 424, 'Bodoni-Bold', 92, WHITE)
text(c, 'THE STAGE.', 38, 332, 'Bodoni-Italic', 84, PINK)
gradient(c, 38, 78, 536, 12)
folio(c, 21, WHITE)
show(c)

# 22 - posters
fill(c, PAPER)
label(c, 'LINEUP / POSTER SERIES', 38, H - 44, PINK)
image_cover(c, DL / 'poster-01.png', 38, 118, 168, 560, (0.5, 0.5))
image_cover(c, DL / 'poster-02.png', 222, 118, 168, 560, (0.5, 0.5))
image_cover(c, DL / 'poster-03.png', 406, 118, 168, 560, (0.5, 0.5))
folio(c, 22)
show(c)

# 23 - poster detail
fill(c, WHITE)
image_cover(c, ASSETS / 'p23_i01.png', 0, 0, 420, H, (0.5, 0.5))
text(c, 'A lineup', 448, 570, 'Bodoni-Italic', 30, BLACK)
text(c, 'as signal.', 448, 536, 'Bodoni-Italic', 30, BLACK)
label(c, 'PRINT / DIGITAL / ENVIRONMENT', 448, 100, PINK, 6.8)
folio(c, 23)
show(c)

# 24 - merchandise
fill(c, PAPER)
label(c, 'OBJECTS / MERCHANDISE', 38, H - 44, PINK)
image_cover(c, PUBLIC / 'Totebag-cooler.png', 38, 395, 256, 300, (0.5, 0.5))
image_cover(c, PUBLIC / 'person_wearing_back_of_shirt.png', 318, 395, 256, 300, (0.5, 0.5))
image_cover(c, PUBLIC / 'wristband_on_someones_wrist.png', 38, 83, 536, 275, (0.5, 0.5))
folio(c, 24)
show(c)

# 25 - social tiles
fill(c, BLACK)
label(c, 'PORTRAITS / PROGRAMMING', 38, H - 44, CYAN)
tiles = [ASSETS / 'p22_i01.jpg', ASSETS / 'p22_i02.jpg', ASSETS / 'p22_i03.jpg', ASSETS / 'p22_i04.jpg']
positions = [(38, 401), (310, 401), (38, 129), (310, 129)]
for p, (x, y) in zip(tiles, positions):
    image_cover(c, p, x, y, 264, 250, (0.5, 0.5))
text(c, 'FOUR VOICES.', 38, 81, 'Bodoni-Italic', 32, WHITE)
folio(c, 25, WHITE)
show(c)

# 26 - OOH diptych
image_cover(c, DL / 'ooh-04.jpg', 0, 0, W, H, (0.5, 0.5))
overlay(c, BLACK, 0.16)
text(c, 'THE CITY', 38, 110, 'Bodoni-Bold', 69, WHITE)
text(c, 'BECOMES MEDIA.', 38, 56, 'Bodoni-Italic', 48, WHITE)
folio(c, 26, WHITE)
show(c)

# 27 - motion sequence
fill(c, PAPER)
label(c, 'MOTION / SEQUENCE', 38, H - 44, PINK)
image_cover(c, ASSETS / 'p24_i01.jpg', 38, 446, 536, 220, (0.5, 0.5))
image_cover(c, ASSETS / 'p25_i02.jpg', 38, 203, 260, 208, (0.5, 0.5))
image_cover(c, ASSETS / 'p25_i04.jpg', 314, 203, 260, 208, (0.5, 0.5))
para(c, 'The visualizer animates as a living signature: expanding, collapsing, and gathering into the hand.', 314, 168, 260, 'Bodoni-Italic', 13, 18, BLACK)
folio(c, 27)
show(c)

# 28 - process
fill(c, WHITE)
label(c, 'PROCESS / RAPID WORLD BUILDING', 38, H - 44, PINK)
text(c, 'Imagine widely.', 38, 650, 'Bodoni-Italic', 47, BLACK)
text(c, 'Edit precisely.', 38, 598, 'Bodoni-Italic', 47, BLACK)
image_cover(c, ASSETS / 'p09_i01.jp2', 38, 223, 255, 320, (0.5, 0.5))
image_cover(c, ASSETS / 'p09_i02.jp2', 319, 223, 255, 320, (0.5, 0.5))
para(c, 'AI accelerated early moodboarding and environment studies. The generated references remained raw material - each direction was filtered, redrawn, and rebuilt through a consistent design intent.', 319, 180, 255, 'Bodoni', 11.5, 16.5, BLACK)
folio(c, 28)
show(c)

# 29 - exhibition
fill(c, PAPER)
label(c, 'FUSION / RIT CAPSTONE SHOW', 38, H - 44, PINK)
text(c, 'THE FICTION', 38, H - 110, 'Bodoni-Bold', 49, BLACK)
text(c, 'BECOMES PHYSICAL.', 38, H - 160, 'Bodoni-Italic', 47, BLACK)
image_cover(c, DL / 'show-01.png', 38, 250, 260, 370, (0.5, 0.5))
image_cover(c, DL / 'show-02.png', 316, 250, 258, 370, (0.5, 0.5))
para(c, 'Moving screens, printed matter, identity panels, and environmental graphics gathered into one final installation.', 316, 205, 258, 'Bodoni', 12.5, 18, BLACK)
folio(c, 29)
show(c)

# 30 - final world image
fill(c, BLACK)
image_cover(c, ASSETS / 'p07_i01.jpg', 38, 126, 536, 570, (0.5, 0.5))
label(c, 'ONE WORLD / MANY SIGNALS', 38, 91, CYAN)
text(c, 'THE CROWD COMPLETES THE PICTURE.', 38, 49, 'Cityburn', 24, WHITE)
folio(c, 30, WHITE)
show(c)

# 31 - final statement
fill(c, PINK)
text(c, 'THE SHOW', 38, 542, 'Bodoni-Bold', 94, BLACK)
text(c, 'ENDS.', 38, 448, 'Bodoni-Bold', 94, BLACK)
text(c, 'THE SIGNAL', 38, 306, 'Bodoni-Italic', 84, WHITE)
text(c, 'CONTINUES.', 38, 222, 'Bodoni-Italic', 84, WHITE)
bars(c, 412, 52, 162, 125, BLACK, 7, 5)
folio(c, 31, BLACK)
show(c)

# 32 - back cover
image_cover(c, ASSETS / 'p28_i01.jpg', 0, 0, W, H, (0.5, 0.5))
overlay(c, BLACK, 0.25)
text(c, 'WWIMF', 38, 58, 'Bodoni-Bold', 34, WHITE)
text_right(c, 'JAMES KORDIC / 2025', 574, 62, 'CourierNew-Bold', 7.5, WHITE)
show(c)

c.save()

# Preserve the original front cover exactly, then append the redesigned interior.
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

final_reader = PdfReader(str(OUTPUT))
assert len(final_reader.pages) == 32

print(OUTPUT)
