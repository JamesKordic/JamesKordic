from __future__ import annotations

import hashlib
from pathlib import Path

from PIL import Image, ImageOps
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path('/Users/jameskordic/JamesKordic')
ASSETS = ROOT / 'tmp/pdfs/wwimf_source/assets'
DOWNLOADS = ROOT / 'tmp/pdfs/wwimf_source/downloads'
PUBLIC = ROOT / 'public/projects/wwimf'
CACHE = ROOT / 'tmp/pdfs/wwimf_redesign_cache'
OUTPUT = ROOT / 'output/pdf/wwimf-book-redesign.pdf'
CACHE.mkdir(parents=True, exist_ok=True)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

W, H = letter
M = 36

INK = HexColor('#111111')
PAPER = HexColor('#F7F7FB')
WHITE = HexColor('#FFFFFF')
PINK = HexColor('#ED1D7E')
CYAN = HexColor('#6FCCDD')
YELLOW = HexColor('#FED700')
PURPLE = HexColor('#5D53A3')
ORANGE = HexColor('#F04923')
GREEN = HexColor('#73BF44')
GRAY = HexColor('#A9A9B0')

PALETTE = [PINK, CYAN, YELLOW, PURPLE, ORANGE, GREEN]


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont('DIN', '/System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf'))
    pdfmetrics.registerFont(TTFont('Arial', '/System/Library/Fonts/Supplemental/Arial.ttf'))
    pdfmetrics.registerFont(TTFont('Arial-Bold', '/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
    pdfmetrics.registerFont(TTFont('CourierNew', '/System/Library/Fonts/Supplemental/Courier New.ttf'))
    pdfmetrics.registerFont(TTFont('CourierNew-Bold', '/System/Library/Fonts/Supplemental/Courier New Bold.ttf'))


def cached_cover(path: Path, width: int, height: int, anchor=(0.5, 0.5)) -> Path:
    key = hashlib.sha1(f'{path}:{width}:{height}:{anchor}'.encode()).hexdigest()[:16]
    out = CACHE / f'{key}.jpg'
    if not out.exists():
        image = Image.open(path).convert('RGB')
        fitted = ImageOps.fit(image, (max(1, width), max(1, height)), method=Image.Resampling.LANCZOS, centering=anchor)
        fitted.save(out, quality=94, subsampling=0)
    return out


def draw_cover(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float, anchor=(0.5, 0.5)) -> None:
    scale = 2.2
    fitted = cached_cover(path, int(w * scale), int(h * scale), anchor)
    c.drawImage(ImageReader(str(fitted)), x, y, w, h, preserveAspectRatio=False, mask='auto')


def draw_contain(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float, pad=0) -> None:
    image = Image.open(path)
    iw, ih = image.size
    ratio = min((w - 2 * pad) / iw, (h - 2 * pad) / ih)
    rw, rh = iw * ratio, ih * ratio
    c.drawImage(ImageReader(str(path)), x + (w - rw) / 2, y + (h - rh) / 2, rw, rh, mask='auto')


def overlay(c: canvas.Canvas, color=INK, alpha=0.55) -> None:
    c.saveState()
    c.setFillColor(color)
    c.setFillAlpha(alpha)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()


def gradient_band(c: canvas.Canvas, x: float, y: float, w: float, h: float, steps=120) -> None:
    stops = [PINK, ORANGE, YELLOW, GREEN, CYAN, PURPLE, PINK]
    for i in range(steps):
        pos = i / max(1, steps - 1)
        si = min(len(stops) - 2, int(pos * (len(stops) - 1)))
        local = pos * (len(stops) - 1) - si
        a, b = stops[si], stops[si + 1]
        color = Color(a.red + (b.red - a.red) * local, a.green + (b.green - a.green) * local, a.blue + (b.blue - a.blue) * local)
        c.setFillColor(color)
        c.rect(x + w * i / steps, y, w / steps + 0.5, h, fill=1, stroke=0)


def visualizer(c: canvas.Canvas, x: float, y: float, w: float, h: float, color=WHITE, seed=0) -> None:
    patterns = [0.42, 0.76, 0.56, 0.94, 0.68, 0.35, 0.82, 0.48, 0.72]
    count = 7
    gap = w * 0.035
    bw = (w - gap * (count - 1)) / count
    for i in range(count):
        frac = patterns[(i + seed) % len(patterns)]
        c.setFillColor(color)
        c.rect(x + i * (bw + gap), y, bw, h * frac, fill=1, stroke=0)


def line(c: canvas.Canvas, x1, y1, x2, y2, color=INK, width=0.6) -> None:
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)


def paragraph(c: canvas.Canvas, text: str, x: float, top: float, w: float, size=10.5, leading=14.5,
              color=INK, font='Arial', align=TA_LEFT) -> float:
    style = ParagraphStyle(
        'body', fontName=font, fontSize=size, leading=leading, textColor=color,
        alignment=align, spaceAfter=0, splitLongWords=True, allowWidows=0, allowOrphans=0,
    )
    p = Paragraph(text, style)
    _, ph = p.wrap(w, H)
    p.drawOn(c, x, top - ph)
    return top - ph


def label(c: canvas.Canvas, text: str, x: float, y: float, color=INK, size=8.5) -> None:
    c.setFillColor(color)
    c.setFont('CourierNew-Bold', size)
    c.drawString(x, y, text.upper())


def display(c: canvas.Canvas, text: str, x: float, y: float, size: float, color=INK, max_width=None) -> None:
    c.setFillColor(color)
    actual = size
    if max_width:
        while actual > 12 and pdfmetrics.stringWidth(text, 'DIN', actual) > max_width:
            actual -= 1
    c.setFont('DIN', actual)
    c.drawString(x, y, text)


def page_furniture(c: canvas.Canvas, page: int, chapter: str, dark=False) -> None:
    color = WHITE if dark else INK
    line(c, M, 25, W - M, 25, color, 0.45)
    label(c, f'{page:02d}', M, 13, color, 7.5)
    c.setFillColor(color)
    c.setFont('CourierNew', 7.5)
    c.drawRightString(W - M, 13, chapter.upper())


def new_page(c: canvas.Canvas, bg=PAPER) -> None:
    c.setFillColor(bg)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def chapter_title(c: canvas.Canvas, number: str, title: str, page: int) -> None:
    new_page(c, INK)
    gradient_band(c, 0, 0, 12, H)
    label(c, f'CHAPTER {number}', M, H - 54, WHITE, 9)
    display(c, title.upper(), M, 112, 76, WHITE, W - 2 * M)
    visualizer(c, M, H - 340, W - 2 * M, 210, PINK, int(number))
    page_furniture(c, page, title, dark=True)
    c.showPage()


register_fonts()
c = canvas.Canvas(str(OUTPUT), pagesize=letter, pageCompression=1)
c.setTitle('WorldWide Interactive Music Festival - Redesigned')
c.setAuthor('James Kordic')
c.setSubject('WWIMF capstone brand book')

# 01 - Cover
draw_cover(c, DOWNLOADS / 'stage-01.png', 0, 0, W, H, (0.5, 0.5))
overlay(c, INK, 0.50)
gradient_band(c, 0, H - 14, W, 14)
label(c, 'RIT GRAPHIC DESIGN CAPSTONE / 2025', M, H - 48, WHITE, 8.5)
display(c, 'WWIMF', M, 136, 124, WHITE, W - 2 * M)
c.setFillColor(WHITE)
c.setFont('CourierNew-Bold', 11)
c.drawString(M, 108, 'WORLDWIDE INTERACTIVE MUSIC FESTIVAL')
visualizer(c, W - 180, 44, 144, 100, PINK, 2)
c.showPage()

# 02 - Opening statement I
draw_cover(c, ASSETS / 'p02_i01.jp2', 0, 0, W, H, (0.5, 0.5))
overlay(c, INK, 0.20)
display(c, 'MUSIC IS NOT', M, 62, 78, WHITE, W - 2 * M)
page_furniture(c, 2, 'Manifesto', dark=True)
c.showPage()

# 03 - Opening statement II
draw_cover(c, ASSETS / 'p03_i01.jp2', 0, 0, W, H, (0.5, 0.5))
overlay(c, INK, 0.25)
display(c, 'A SPECTATOR SPORT.', M, 62, 66, WHITE, W - 2 * M)
page_furniture(c, 3, 'Manifesto', dark=True)
c.showPage()

# 04 - Contents
new_page(c, PAPER)
label(c, 'FIELD GUIDE / CONTENTS', M, H - 44, PINK, 9)
display(c, 'FOUR SIGNALS.', M, H - 116, 58, INK, W - 2 * M)
contents = [
    ('01', 'PREMISE', '05-12', PINK),
    ('02', 'IDENTITY', '13-19', CYAN),
    ('03', 'APPLICATIONS', '20-26', YELLOW),
    ('04', 'CLOSING', '27-28', GREEN),
]
y = H - 190
for num, title, pages, color in contents:
    c.setFillColor(color)
    c.rect(M, y - 28, 9, 40, fill=1, stroke=0)
    label(c, num, M + 24, y, INK, 9)
    display(c, title, M + 68, y - 8, 30, INK, 340)
    c.setFillColor(INK)
    c.setFont('CourierNew', 9)
    c.drawRightString(W - M, y, pages)
    line(c, M, y - 38, W - M, y - 38, HexColor('#D8D8DD'))
    y -= 96
gradient_band(c, M, 62, W - 2 * M, 18)
page_furniture(c, 4, 'Contents')
c.showPage()

# 05 - Overview
new_page(c)
label(c, '01 / PREMISE', M, H - 44, PINK, 9)
display(c, 'THE FESTIVAL, REWIRED.', M, H - 108, 48, INK, W - 2 * M)
paragraph(c,
          '<b>WWIMF is a conceptual global music festival where music, visual art, and emerging technology converge through active participation.</b>',
          M, H - 146, 250, 15, 20, INK, 'Arial-Bold')
paragraph(c,
          'Traditional festivals often position the audience as spectators. WWIMF proposes a different model: environments, stages, and tools that respond to presence, gesture, and movement - turning every attendee into a contributor.',
          326, H - 146, 250, 10.5, 15, INK)
draw_cover(c, ASSETS / 'p07_i01.jpg', M, 56, W - 2 * M, 390, (0.5, 0.42))
c.setFillColor(PINK)
c.rect(M, 56, 10, 390, fill=1, stroke=0)
page_furniture(c, 5, 'Premise')
c.showPage()

# 06 - The question
new_page(c, INK)
label(c, 'THE QUESTION', M, H - 44, CYAN, 9)
paragraph(c, 'WHAT IF THE CROWD COULD SHAPE THE SHOW?', M, H - 104, W - 2 * M, 41, 43, WHITE, 'DIN')
gradient_band(c, M, 250, W - 2 * M, 22)
paragraph(c,
          'The project began with a simple tension: live music is communal, but the experience is usually one-directional. WWIMF explores how identity, environment, and technology can make participation visible and meaningful.',
          M, 205, 350, 12, 17, WHITE, 'Arial')
visualizer(c, 420, 58, 156, 140, WHITE, 1)
page_furniture(c, 6, 'Premise', dark=True)
c.showPage()

# 07 - The answer
new_page(c)
draw_cover(c, DOWNLOADS / 'interactive-01.png', 0, 316, W, 476, (0.5, 0.5))
label(c, 'THE ANSWER', M, 280, PINK, 9)
display(c, 'MAKE THE AUDIENCE THE INSTRUMENT.', M, 220, 42, INK, W - 2 * M)
paragraph(c,
          'Smart wearables trigger effects. Interactive stages react to movement. Immersive tunnels turn navigation into performance. Every touchpoint is designed to show the audience that their presence changes the world around them.',
          M, 152, 420, 12, 17, INK)
page_furniture(c, 7, 'Premise')
c.showPage()

# 08 - Process and AI
new_page(c)
label(c, 'PROCESS / RAPID WORLD-BUILDING', M, H - 44, PINK, 9)
display(c, 'IDEATE FAST. EDIT HARD.', M, H - 104, 48, INK, W - 2 * M)
draw_cover(c, ASSETS / 'p09_i01.jp2', M, 325, 258, 300, (0.5, 0.5))
draw_cover(c, ASSETS / 'p09_i02.jp2', 318, 325, 258, 300, (0.5, 0.5))
paragraph(c,
          '<b>AI supported the earliest phase of the project as an ideation tool.</b> It accelerated moodboarding, naming, and environment studies, making it possible to compare more directions before committing to a system.',
          M, 287, 250, 10.5, 15, INK)
paragraph(c,
          'The generated references were treated as raw material, not final design. Each idea was filtered through a clear design intent, then rebuilt through typography, identity, spatial mockups, and motion.',
          326, 287, 250, 10.5, 15, INK)
label(c, 'CONCEPT IMAGERY GENERATED WITH GROK AND CHATGPT', M, 60, GRAY, 7)
page_furniture(c, 8, 'Premise')
c.showPage()

# 09 - Stage worlds
new_page(c, INK)
draw_cover(c, DOWNLOADS / 'stage-03.png', 0, 0, W, H, (0.5, 0.5))
overlay(c, INK, 0.24)
label(c, 'ENVIRONMENT STUDY / 01', M, H - 44, CYAN, 9)
display(c, 'WORLDS BEFORE WALLS.', M, 68, 54, WHITE, W - 2 * M)
page_furniture(c, 9, 'Premise', dark=True)
c.showPage()

# 10 - Stage systems
new_page(c)
label(c, 'ENVIRONMENT SYSTEMS', M, H - 44, PINK, 9)
display(c, 'STAGES THAT RESPOND.', M, H - 104, 48, INK, W - 2 * M)
draw_cover(c, DOWNLOADS / 'stage-02.png', M, 404, 330, 250, (0.5, 0.5))
draw_cover(c, DOWNLOADS / 'stage-04.png', 378, 404, 198, 250, (0.5, 0.5))
draw_cover(c, DOWNLOADS / 'stage-01.png', M, 164, 540, 205, (0.5, 0.52))
paragraph(c,
          'Biomorphic structures, theatrical light, augmented scenery, and reactive installations extend performance beyond a conventional stage. The architecture becomes part of the instrument.',
          M, 132, 440, 10.5, 15, INK)
page_furniture(c, 10, 'Premise')
c.showPage()

# 11 - Interaction principle
draw_cover(c, DOWNLOADS / 'interactive-03.png', 0, 0, W, H, (0.5, 0.5))
overlay(c, INK, 0.34)
label(c, 'INTERACTION PRINCIPLE', M, H - 44, YELLOW, 9)
paragraph(c, 'DESIGN THE RESPONSE, NOT JUST THE OBJECT.', M, 176, W - 2 * M, 43, 45, WHITE, 'DIN')
page_furniture(c, 11, 'Premise', dark=True)
c.showPage()

# 12 - Interactive tools
new_page(c)
label(c, 'TOOLS FOR PARTICIPATION', M, H - 44, PINK, 9)
display(c, 'TOUCH. MOVE. TRIGGER.', M, H - 104, 48, INK, W - 2 * M)
draw_cover(c, PUBLIC / 'merch-wristband-new.png', M, 393, 258, 245, (0.5, 0.5))
draw_cover(c, PUBLIC / 'interactive-pen-new.png', 318, 393, 258, 245, (0.5, 0.5))
label(c, '01 / RESPONSIVE WRISTBAND', M, 372, PURPLE, 8)
label(c, '02 / GLOW MARK-MAKING TOOL', 318, 372, GREEN, 8)
draw_cover(c, DOWNLOADS / 'interactive-02.png', M, 91, 540, 244, (0.5, 0.5))
page_furniture(c, 12, 'Premise')
c.showPage()

# 13 - Identity chapter divider
chapter_title(c, '02', 'Identity', 13)

# 14 - Primary identity
new_page(c)
label(c, 'PRIMARY IDENTITY', M, H - 44, PINK, 9)
display(c, 'SOUND, MADE VISIBLE.', M, H - 104, 48, INK, W - 2 * M)
draw_cover(c, PUBLIC / 'visual-identity-logos.png', M, 318, 540, 330, (0.0, 0.10))
paragraph(c,
          '<b>The primary wordmark begins with a music visualizer.</b> Its bars become letterforms, rhythm, pattern, and motion - one structural idea that can carry the identity from a wristband to a stage wall.',
          M, 275, 320, 12, 17, INK)
visualizer(c, 400, 90, 176, 150, PINK, 2)
page_furniture(c, 14, 'Identity')
c.showPage()

# 15 - Secondary mark
new_page(c, PURPLE)
label(c, 'SECONDARY IDENTITY', M, H - 44, WHITE, 9)
display(c, 'THE HAND IS THE INTERFACE.', M, H - 104, 45, WHITE, W - 2 * M)
draw_cover(c, PUBLIC / 'visual-identity-logos.png', M, 290, 540, 330, (0.80, 0.78))
paragraph(c,
          'The hand mark combines a universal gesture of participation with the visualizer bars. Changing the bar heights creates an open-ended family of marks without losing recognition.',
          M, 238, 360, 12, 17, WHITE)
page_furniture(c, 15, 'Identity', dark=True)
c.showPage()

# 16 - Typography
new_page(c)
label(c, 'TYPE SYSTEM', M, H - 44, PINK, 9)
display(c, 'LOUD / TECHNICAL / HUMAN', M, H - 104, 45, INK, W - 2 * M)
display(c, 'Aa', M, 500, 172, INK)
label(c, 'DIN CONDENSED BOLD / DISPLAY', M, 458, PINK, 8)
c.setFillColor(INK)
c.setFont('CourierNew-Bold', 28)
c.drawString(320, 570, 'Aa Bb Cc')
c.setFont('CourierNew', 12)
c.drawString(320, 535, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
c.drawString(320, 511, 'abcdefghijklmnopqrstuvwxyz')
c.drawString(320, 487, '0123456789 / : ; + - =')
label(c, 'COURIER NEW / INFORMATION', 320, 458, CYAN, 8)
line(c, M, 420, W - M, 420, HexColor('#CFCFD4'))
paragraph(c,
          '<b>Display type carries the volume.</b> Condensed forms create impact at distance and work like stage architecture on the page.',
          M, 382, 240, 11, 16, INK)
paragraph(c,
          '<b>Monospaced type carries the signal.</b> It organizes labels, captions, specifications, and wayfinding with a technical cadence.',
          326, 382, 250, 11, 16, INK)
gradient_band(c, M, 82, W - 2 * M, 44)
page_furniture(c, 16, 'Identity')
c.showPage()

# 17 - Palette
new_page(c, INK)
label(c, 'COLOR SYSTEM', M, H - 44, WHITE, 9)
display(c, 'SIX FREQUENCIES.', M, H - 104, 50, WHITE, W - 2 * M)
chips = [
    ('SIGNAL PINK', '#ED1D7E', PINK), ('PULSE CYAN', '#6FCCDD', CYAN),
    ('BEAM YELLOW', '#FED700', YELLOW), ('NIGHT PURPLE', '#5D53A3', PURPLE),
    ('HEAT ORANGE', '#F04923', ORANGE), ('FIELD GREEN', '#73BF44', GREEN),
]
cw, ch = 168, 178
for i, (name, hx, color) in enumerate(chips):
    col, row = i % 3, i // 3
    x, y = M + col * (cw + 18), 370 - row * (ch + 26)
    c.setFillColor(color)
    c.rect(x, y, cw, ch, fill=1, stroke=0)
    c.setFillColor(INK if color in (CYAN, YELLOW, GREEN) else WHITE)
    c.setFont('CourierNew-Bold', 8)
    c.drawString(x + 12, y + 24, name)
    c.setFont('CourierNew', 8)
    c.drawString(x + 12, y + 11, hx)
page_furniture(c, 17, 'Identity', dark=True)
c.showPage()

# 18 - System page
new_page(c)
label(c, 'THE SYSTEM', M, H - 44, PINK, 9)
display(c, 'ONE MOTIF. MANY STATES.', M, H - 104, 48, INK, W - 2 * M)
for row in range(6):
    color = PALETTE[row]
    visualizer(c, M, 495 - row * 72, W - 2 * M, 54, color, row)
paragraph(c,
          'The visualizer is not decoration. It is a flexible behavior: a wordmark, a hand, a stage silhouette, a background pattern, or a motion rhythm. Repetition makes the system recognizable; variation keeps it alive.',
          M, 108, 480, 11, 16, INK)
page_furniture(c, 18, 'Identity')
c.showPage()

# 19 - Identity in context
new_page(c, INK)
draw_cover(c, PUBLIC / 'visual-identity-exhibition.png', M, 224, W - 2 * M, 402, (0.5, 0.5))
label(c, 'IDENTITY / IN CONTEXT', M, H - 44, CYAN, 9)
display(c, 'BUILT TO SCALE.', M, 156, 54, WHITE, W - 2 * M)
paragraph(c, 'The same signal holds across gallery walls, screens, print, merchandise, and environmental graphics.', M, 112, 400, 11, 16, WHITE)
page_furniture(c, 19, 'Identity', dark=True)
c.showPage()

# 20 - Applications chapter divider
chapter_title(c, '03', 'Applications', 20)

# 21 - Merchandise
new_page(c)
label(c, 'MERCHANDISE', M, H - 44, PINK, 9)
display(c, 'TAKE THE SIGNAL WITH YOU.', M, H - 104, 45, INK, W - 2 * M)
draw_cover(c, PUBLIC / 'merch-wristband-new.png', M, 410, 252, 236, (0.5, 0.5))
draw_cover(c, PUBLIC / 'Totebag-cooler.png', 324, 410, 252, 236, (0.5, 0.5))
draw_cover(c, PUBLIC / 'wristband_on_someones_wrist.png', M, 130, 252, 236, (0.5, 0.5))
draw_cover(c, PUBLIC / 'person_wearing_back_of_shirt.png', 324, 130, 252, 236, (0.5, 0.5))
page_furniture(c, 21, 'Applications')
c.showPage()

# 22 - Social system
new_page(c, INK)
label(c, 'SOCIAL / ARTIST ANNOUNCEMENTS', M, H - 44, WHITE, 9)
display(c, 'A GRID THAT LETS ARTISTS CHANGE THE COLOR.', M, H - 104, 39, WHITE, W - 2 * M)
social = [ASSETS / f'p22_i{i:02d}.jpg' for i in range(1, 5)]
positions = [(M, 348), (318, 348), (M, 82), (318, 82)]
for path, (x, y) in zip(social, positions):
    draw_cover(c, path, x, y, 258, 242, (0.5, 0.5))
page_furniture(c, 22, 'Applications', dark=True)
c.showPage()

# 23 - Poster system
new_page(c)
label(c, 'LINEUP POSTERS', M, H - 44, PINK, 9)
display(c, 'THREE DAYS. ONE SYSTEM.', M, H - 104, 48, INK, W - 2 * M)
posters = [DOWNLOADS / f'poster-0{i}.png' for i in range(1, 4)]
for i, path in enumerate(posters):
    draw_cover(c, path, M + i * 180, 120, 168, 506, (0.5, 0.5))
page_furniture(c, 23, 'Applications')
c.showPage()

# 24 - OOH
new_page(c)
label(c, 'OUT OF HOME', M, H - 44, PINK, 9)
display(c, 'THE CAMPAIGN ENTERS THE CITY.', M, H - 104, 43, INK, W - 2 * M)
ooh = [DOWNLOADS / f'ooh-0{i}.png' for i in range(1, 4)] + [DOWNLOADS / 'ooh-04.jpg']
positions = [(M, 372), (318, 372), (M, 90), (318, 90)]
for path, (x, y) in zip(ooh, positions):
    draw_cover(c, path, x, y, 258, 244, (0.5, 0.5))
page_furniture(c, 24, 'Applications')
c.showPage()

# 25 - Motion
new_page(c, INK)
label(c, 'MOTION SYSTEM', M, H - 44, WHITE, 9)
display(c, 'THE BRAND STARTS BEHAVING LIKE SOUND.', M, H - 104, 41, WHITE, W - 2 * M)
motion = [ASSETS / f'p24_i{i:02d}.jpg' for i in range(1, 4)]
for i, path in enumerate(motion):
    draw_cover(c, path, M, 410 - i * 155, 430, 135, (0.5, 0.5))
draw_contain(c, ASSETS / 'p25_i05.png', 490, 88, 86, 86, 4)
label(c, 'MOTION PREVIEW', 488, 72, WHITE, 6.5)
page_furniture(c, 25, 'Applications', dark=True)
c.showPage()

# 26 - Exhibition
new_page(c)
label(c, 'FUSION / RIT CAPSTONE SHOW', M, H - 44, PINK, 9)
display(c, 'THE FICTION BECOMES PHYSICAL.', M, H - 104, 43, INK, W - 2 * M)
draw_cover(c, DOWNLOADS / 'show-01.png', M, 248, 258, 396, (0.5, 0.5))
draw_cover(c, DOWNLOADS / 'show-02.png', 318, 248, 258, 396, (0.5, 0.5))
paragraph(c,
          'For the 2025 RIT Graphic Design Capstone Show, WWIMF became a complete installation: moving screens, lineup posters, identity panels, environmental graphics, and the printed book gathered into one physical experience.',
          M, 205, 480, 11, 16, INK)
page_furniture(c, 26, 'Applications')
c.showPage()

# 27 - Thank you
new_page(c)
label(c, '04 / CLOSING', M, H - 44, PINK, 9)
display(c, 'THANK YOU.', M, H - 104, 62, INK, W - 2 * M)
draw_cover(c, ASSETS / 'p27_i01.jpg', M, 112, 224, 462, (0.5, 0.5))
y = 574
y = paragraph(c,
          'To my dad, my role model and a constant source of inspiration behind my creative work. To my mom, for always being there when I needed it most. To my brothers, for being the smartest, funniest, and most supportive people I could ask for. And to my dog, the best goober in the universe.',
          292, y, 284, 10.5, 15, INK)
y -= 22
y = paragraph(c,
          'Thank you to the people I met at RIT and to the professors who shaped my time there - especially my guidance counselor, Nate. Thank you as well to the friends outside RIT who stayed with me through thick and thin.',
          292, y, 284, 10.5, 15, INK)
y -= 22
y = paragraph(c,
          'College felt endless until suddenly it was over. The lesson I am carrying forward is simple: do the things you love, and do not let anyone stop you.',
          292, y, 284, 10.5, 15, INK)
y -= 26
paragraph(c, '<b>See ya, space cowboy.<br/>- James Kordic</b>', 292, y, 284, 11, 16, PINK, 'CourierNew-Bold')
page_furniture(c, 27, 'Closing')
c.showPage()

# 28 - Back cover
draw_cover(c, ASSETS / 'p28_i01.jpg', 0, 0, W, H, (0.5, 0.5))
overlay(c, INK, 0.30)
gradient_band(c, 0, 0, W, 14)
display(c, 'WWIMF', M, 110, 84, WHITE, W - 2 * M)
label(c, 'DESIGNED BY JAMES KORDIC / 2025', M, 78, WHITE, 8.5)
c.setFillColor(WHITE)
c.setFont('CourierNew', 8)
c.drawString(M, 52, 'WORLDWIDE INTERACTIVE MUSIC FESTIVAL')
c.showPage()

c.save()
print(OUTPUT)
