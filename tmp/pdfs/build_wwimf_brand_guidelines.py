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
MASK_DIR = ROOT / 'tmp/pdfs/wwimf_guideline_masks'
INTERIOR = ROOT / 'tmp/pdfs/wwimf_brand_guidelines_interior.pdf'
OUTPUT = ROOT / 'output/pdf/wwimf-brand-guidelines.pdf'

MASK_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

W, H = letter
M = 40
INK = HexColor('#191919')
PAPER = HexColor('#F7F7FB')
WHITE = HexColor('#FFFFFF')
PINK = HexColor('#ED1D7E')
CYAN = HexColor('#6FCCDD')
YELLOW = HexColor('#FED700')
PURPLE = HexColor('#5D53A3')
ORANGE = HexColor('#F04923')
GREEN = HexColor('#73BF44')
RED = HexColor('#E5342B')
LIGHT = HexColor('#E4E4E8')
GRAY = HexColor('#77777F')
COLORS = [PINK, CYAN, YELLOW, PURPLE, ORANGE, GREEN]

CITYBURN_PATH = next(Path('/Users/jameskordic/Library/Fonts').glob('cityburn-*.ttf'))
pdfmetrics.registerFont(TTFont('Cityburn', str(CITYBURN_PATH)))
pdfmetrics.registerFont(TTFont('CourierNew', '/System/Library/Fonts/Supplemental/Courier New.ttf'))
pdfmetrics.registerFont(TTFont('CourierNew-Bold', '/System/Library/Fonts/Supplemental/Courier New Bold.ttf'))
pdfmetrics.registerFontFamily('CourierNew', normal='CourierNew', bold='CourierNew-Bold', italic='CourierNew', boldItalic='CourierNew-Bold')


def extract_mask(source_path: Path, crop, output: Path):
    source = Image.open(source_path).convert('RGB').crop(crop)
    channels = source.point(lambda v: 255 if v > 230 else 0).split()
    mask = ImageChops.multiply(ImageChops.multiply(channels[0], channels[1]), channels[2])
    bbox = mask.getbbox()
    if bbox is None:
        raise RuntimeError(f'Could not extract artwork from {source_path}')
    mask = mask.crop(bbox).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    out = Image.new('RGBA', mask.size, (255, 255, 255, 0))
    out.putalpha(mask)
    out.save(output)


LOGO_SOURCE = PUBLIC / 'visual-identity-logos.png'
WORDMARK = MASK_DIR / 'wordmark.png'
HAND = MASK_DIR / 'hand.png'
extract_mask(LOGO_SOURCE, (0, 0, 1672, 494), WORDMARK)
extract_mask(LOGO_SOURCE, (0, 494, 836, 941), HAND)


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


def tint_asset(path: Path, color):
    mask = Image.open(path).convert('RGBA')
    alpha = mask.getchannel('A')
    tinted = Image.new('RGBA', mask.size, (
        round(color.red * 255), round(color.green * 255), round(color.blue * 255), 0
    ))
    tinted.putalpha(alpha)
    return tinted


def mark(c, path, x, y, w, color=INK, h=None, rotate=0):
    image = tint_asset(path, color)
    iw, ih = image.size
    if h is None:
        h = w * ih / iw
    c.saveState()
    if rotate:
        c.translate(x + w / 2, y + h / 2)
        c.rotate(rotate)
        c.drawImage(ImageReader(image), -w / 2, -h / 2, w, h, preserveAspectRatio=False, mask='auto')
    else:
        c.drawImage(ImageReader(image), x, y, w, h, preserveAspectRatio=False, mask='auto')
    c.restoreState()
    return h


def hand(c, x, y, w, color=INK, h=None):
    return mark(c, HAND, x, y, w, color, h)


def wordmark(c, x, y, w, color=INK, h=None):
    return mark(c, WORDMARK, x, y, w, color, h)


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


def image_row(c, paths, x, y, width, max_height, gap=6):
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
    return row_h


def label(c, value, x, y, color=INK, size=7.4):
    c.saveState()
    c.setFillColor(color)
    t = c.beginText(x, y)
    t.setFont('CourierNew-Bold', size)
    t.setCharSpace(0.7)
    t.textLine(value.upper())
    c.drawText(t)
    c.restoreState()


def title(c, value, x, y, size=40, color=INK, max_width=None):
    actual = size
    if max_width:
        while actual > 12 and pdfmetrics.stringWidth(value.upper(), 'Cityburn', actual) > max_width:
            actual -= 1
    c.setFillColor(color)
    c.setFont('Cityburn', actual)
    c.drawString(x, y, value.upper())


def body(c, value, x, top, width, size=9, leading=13, color=INK, bold=False):
    style = ParagraphStyle(
        'body', fontName='CourierNew-Bold' if bold else 'CourierNew',
        fontSize=size, leading=leading, textColor=color, alignment=TA_LEFT,
        splitLongWords=True, allowWidows=0, allowOrphans=0,
    )
    p = Paragraph(value, style)
    _, ph = p.wrap(width, H)
    p.drawOn(c, x, top - ph)
    return top - ph


def rule(c, x1, y1, x2, y2, color=INK, width=0.5, dash=None):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    if dash:
        c.setDash(dash)
    c.line(x1, y1, x2, y2)
    c.setDash()


def box(c, x, y, w, h, fill=None, stroke=LIGHT, width=0.7):
    if fill:
        c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(width)
    c.rect(x, y, w, h, fill=1 if fill else 0, stroke=1)


def cross(c, x, y, w, h):
    c.setStrokeColor(RED)
    c.setLineWidth(2.4)
    c.line(x, y, x + w, y + h)
    c.line(x + w, y, x, y + h)


def folio(c, page, section, color=INK):
    rule(c, M, 25, W - M, 25, color, 0.45)
    label(c, f'{page:02d}', M, 13, color, 6.8)
    c.setFillColor(color)
    c.setFont('CourierNew', 6.8)
    c.drawRightString(W - M, 13, section.upper())


def chapter(c, page, number, name, descriptor):
    gradient(c)
    hand(c, 115, 154, 382, WHITE)
    label(c, f'{number} / {name}', M, H - 42, WHITE, 8.4)
    title(c, name, M, 82, 50, WHITE, W - 2 * M)
    body(c, descriptor, M, 56, 360, 7.8, 11, WHITE, True)
    folio(c, page, name, WHITE)
    c.showPage()


c = canvas.Canvas(str(INTERIOR), pagesize=letter, pageCompression=1)
c.setTitle('WWIMF Brand Guidelines')
c.setAuthor('James Kordic')
c.setSubject('WorldWide Interactive Music Festival brand standards')

# 02 - inside cover
bg(c, INK)
wordmark(c, M, 360, W - 2 * M, WHITE)
label(c, 'BRAND GUIDELINES / VERSION 1.0', M, H - 42, CYAN)
label(c, 'WORLDWIDE INTERACTIVE MUSIC FESTIVAL', M, 54, WHITE)
hand(c, W - 150, 48, 104, PINK)
c.showPage()

# 03 - contents
bg(c, WHITE)
label(c, 'CONTENTS / BRAND SYSTEM', M, H - 42, PINK)
title(c, 'THE SYSTEM.', M, H - 102, 47, INK, W - 2 * M)
items = [('01', 'FOUNDATION', '04-07'), ('02', 'LOGO', '08-14'), ('03', 'COLOR + TYPE', '15-19'), ('04', 'GRAPHIC LANGUAGE', '20-23'), ('05', 'APPLICATIONS', '24-31')]
y = H - 178
for i, (num, name, pages) in enumerate(items):
    color = COLORS[i % len(COLORS)]
    hand(c, M, y - 28, 47, color)
    label(c, num, 110, y + 18, color)
    title(c, name, 146, y + 2, 26, INK, 320)
    label(c, pages, 514, y + 12, INK)
    rule(c, 110, y - 18, W - M, y - 18, LIGHT)
    y -= 112
folio(c, 3, 'Contents')
c.showPage()

# 04 - brand overview
bg(c)
label(c, '01 / FOUNDATION', M, H - 42, PINK)
title(c, 'BRAND OVERVIEW', M, H - 102, 44, INK, W - 2 * M)
body(c, '<b>WWIMF is a conceptual global music festival where music, visual art, and emerging technology converge through active participation.</b>', M, H - 152, 250, 10.2, 15, INK, True)
body(c, 'The brand should feel like a live signal: energetic, immersive, experimental, and always shaped by the audience. Every expression should make participation visible.', 326, H - 152, 246, 10, 15)
place(c, ASSETS / 'p10_i01.jpg', M, 100, W - 2 * M, 430)
folio(c, 4, 'Foundation')
c.showPage()

# 05 - brand idea
bg(c, INK)
label(c, 'THE BRAND IDEA', M, H - 42, CYAN)
title(c, 'THE FESTIVAL', M, 545, 69, WHITE, W - 2 * M)
title(c, 'LISTENS BACK.', M, 478, 69, PINK, W - 2 * M)
hand(c, 388, 88, 176, WHITE)
body(c, 'WWIMF turns spectators into contributors. The identity translates sound, gesture, and participation into one visible system.', M, 384, 330, 11, 16, WHITE, True)
folio(c, 5, 'Foundation', WHITE)
c.showPage()

# 06 - brand pillars
bg(c, WHITE)
label(c, 'BRAND PILLARS', M, H - 42, PINK)
title(c, 'FOUR BEHAVIORS', M, H - 102, 42, INK, W - 2 * M)
pillars = [
    ('01', 'IMMERSIVE', 'Create a world, not a backdrop.', PINK),
    ('02', 'PARTICIPATORY', 'Invite the audience to affect the experience.', CYAN),
    ('03', 'EXPERIMENTAL', 'Pair emerging tools with clear design intent.', PURPLE),
    ('04', 'HUMAN', 'Technology should amplify connection, not replace it.', GREEN),
]
y = 495
for num, name, desc, color in pillars:
    box(c, M, y, W - 2 * M, 92, PAPER, LIGHT)
    hand(c, M + 18, y + 14, 42, color)
    label(c, num, 116, y + 62, color)
    title(c, name, 150, y + 43, 24, INK, 240)
    body(c, desc, 398, y + 61, 154, 8.5, 12)
    y -= 108
folio(c, 6, 'Foundation')
c.showPage()

# 07 - experience principles
bg(c)
label(c, 'EXPERIENCE PRINCIPLES', M, H - 42, PURPLE)
title(c, 'DESIGN THE RESPONSE.', M, H - 102, 42, INK, W - 2 * M)
place(c, ASSETS / 'p12_i01.jpg', M, 335, W - 2 * M, 310)
principles = [('1', 'MAKE INPUT VISIBLE', 'Show how movement, touch, or presence changes the environment.'), ('2', 'REWARD CURIOSITY', 'Build moments that reveal more when people explore.'), ('3', 'KEEP IT LEGIBLE', 'The audience should understand what to do without instructions.'), ('4', 'DESIGN FOR SCALE', 'Every system must work from a wristband to a stage wall.')]
x = M
for num, head, desc in principles:
    label(c, num, x, 278, PINK, 8)
    title(c, head, x, 245, 17, INK, 118)
    body(c, desc, x, 218, 118, 7.3, 10.4)
    x += 135
folio(c, 7, 'Foundation')
c.showPage()

# 08 - logo chapter
chapter(c, 8, '02', 'LOGO', 'PRIMARY WORDMARK / SECONDARY HAND / RESPONSIVE VARIATIONS')

# 09 - primary logo
bg(c, WHITE)
label(c, 'PRIMARY WORDMARK', M, H - 42, PINK)
title(c, 'THE MASTER MARK', M, H - 102, 41, INK, W - 2 * M)
box(c, M, 360, W - 2 * M, 280, INK, INK)
wordmark(c, M + 40, 455, W - 2 * M - 80, WHITE)
body(c, 'Use the primary wordmark when the full festival name or context is present. It is the preferred mark for covers, title cards, headers, and major environmental moments.', M, 310, 330, 9.5, 13.5)
label(c, 'PREFERRED VERSION / WHITE ON INK', 410, 288, PINK)
folio(c, 9, 'Logo')
c.showPage()

# 10 - clear space and minimum size
bg(c)
label(c, 'CLEAR SPACE / MINIMUM SIZE', M, H - 42, PURPLE)
title(c, 'PROTECT THE SIGNAL.', M, H - 102, 40, INK, W - 2 * M)
c.setStrokeColor(PURPLE)
c.setLineWidth(0.8)
c.setDash(4, 3)
c.rect(M + 40, 398, W - 2 * M - 80, 210, fill=0, stroke=1)
c.setDash()
wordmark(c, M + 90, 462, W - 2 * M - 180, INK)
label(c, 'X', M + 20, 500, PURPLE, 10)
rule(c, M + 30, 494, M + 76, 494, PURPLE, 0.8)
body(c, 'Maintain clear space equal to the width of one vertical bar (X) on every side of the wordmark.', M, 352, 260, 9.2, 13.5)
box(c, M, 112, 250, 170, WHITE, LIGHT)
wordmark(c, M + 28, 195, 194, INK)
label(c, 'PRINT / 1.25 IN MINIMUM', M + 28, 142, PINK)
box(c, 322, 112, 250, 170, WHITE, LIGHT)
wordmark(c, 350, 195, 194, INK)
label(c, 'DIGITAL / 120 PX MINIMUM', 350, 142, CYAN)
folio(c, 10, 'Logo')
c.showPage()

# 11 - logo colorways
bg(c, WHITE)
label(c, 'APPROVED COLORWAYS', M, H - 42, PINK)
title(c, 'HIGH CONTRAST FIRST.', M, H - 102, 40, INK, W - 2 * M)
cards = [(M, 420, 250, 210, INK, WHITE, 'WHITE / INK'), (322, 420, 250, 210, WHITE, INK, 'INK / WHITE'), (M, 180, 250, 210, PINK, WHITE, 'WHITE / PINK'), (322, 180, 250, 210, PURPLE, WHITE, 'WHITE / PURPLE')]
for x, y, w, h, fill, logo_color, cap in cards:
    box(c, x, y, w, h, fill, fill)
    wordmark(c, x + 22, y + 86, w - 44, logo_color)
    label(c, cap, x + 16, y + 16, logo_color, 6.5)
body(c, 'Use only approved high-contrast pairings. On complex imagery, place the mark over a controlled solid field.', M, 132, 430, 8.8, 12.5)
folio(c, 11, 'Logo')
c.showPage()

# 12 - incorrect logo use
bg(c)
label(c, 'INCORRECT USE', M, H - 42, RED)
title(c, 'KEEP THE MARK INTACT.', M, H - 102, 39, INK, W - 2 * M)
examples = [(M, 410, 'DO NOT STRETCH'), (322, 410, 'DO NOT ROTATE'), (M, 170, 'DO NOT USE LOW CONTRAST'), (322, 170, 'DO NOT ADD EFFECTS')]
for idx, (x, y, cap) in enumerate(examples):
    box(c, x, y, 250, 190, WHITE, LIGHT)
    if idx == 0:
        mark(c, WORDMARK, x + 24, y + 70, 202, INK, 45)
    elif idx == 1:
        mark(c, WORDMARK, x + 38, y + 70, 174, INK, rotate=12)
    elif idx == 2:
        c.setFillColor(CYAN)
        c.rect(x + 18, y + 44, 214, 112, fill=1, stroke=0)
        wordmark(c, x + 34, y + 83, 182, WHITE)
    else:
        wordmark(c, x + 34, y + 84, 182, PURPLE)
        wordmark(c, x + 39, y + 79, 182, PINK)
    cross(c, x + 15, y + 38, 220, 122)
    label(c, cap, x + 18, y + 16, RED, 6.5)
folio(c, 12, 'Logo')
c.showPage()

# 13 - secondary hand
bg(c, WHITE)
label(c, 'SECONDARY MARK / THE HAND', M, H - 42, PURPLE)
title(c, 'INTERACTION, MADE VISIBLE.', M, H - 102, 37, INK, W - 2 * M)
hand(c, M + 15, 150, 300, INK)
body(c, 'The hand represents the audience as an active participant. Use it as an icon, responsive trigger, navigation device, or large environmental gesture.', 420, 540, 150, 9, 13)
label(c, 'USE FOR', 420, 388, PINK)
body(c, 'APP ICONS<br/>WEARABLES<br/>WAYFINDING<br/>MOTION TRIGGERS<br/>SOCIAL AVATARS', 420, 365, 150, 8.2, 14, INK, True)
folio(c, 13, 'Logo')
c.showPage()

# 14 - dynamic hand system
bg(c)
label(c, 'RESPONSIVE HAND SYSTEM', M, H - 42, PINK)
title(c, 'THE BARS CAN MOVE.', M, H - 102, 40, INK, W - 2 * M)
place(c, PUBLIC / 'visual-identity-logos.png', M, 330, W - 2 * M, 335)
for i, color in enumerate(COLORS):
    hand(c, M + i * 86, 120, 64, color)
body(c, 'The bar rhythm may change to express sound or input. The palm, baseline, proportions, and overall silhouette must remain consistent.', M, 92, 500, 8.8, 12.5)
folio(c, 14, 'Logo')
c.showPage()

# 15 - color + type chapter
chapter(c, 15, '03', 'COLOR + TYPE', 'PALETTE / GRADIENTS / TYPOGRAPHY / HIERARCHY')

# 16 - complete palette
bg(c, WHITE)
label(c, 'PRIMARY PALETTE', M, H - 42, PINK)
title(c, 'COLOR SPECIFICATIONS', M, H - 102, 39, INK, W - 2 * M)
specs = [
    ('PINK', PINK, '0 97 15 0', '237 29 126', '#ED1D7E'),
    ('CYAN', CYAN, '52 0 13 0', '111 204 221', '#6FCCDD'),
    ('YELLOW', YELLOW, '1 13 100 0', '254 215 0', '#FED700'),
    ('PURPLE', PURPLE, '75 78 0 0', '93 83 163', '#5D53A3'),
    ('ORANGE', ORANGE, '0 87 100 0', '240 73 35', '#F04923'),
    ('GREEN', GREEN, '59 0 100 0', '115 191 68', '#73BF44'),
]
sw = (W - 2 * M) / 6
for i, (name, color, cmyk, rgb, hexx) in enumerate(specs):
    x = M + i * sw
    c.setFillColor(color)
    c.rect(x, 286, sw, 345, fill=1, stroke=0)
    hand(c, x + 13, 445, sw - 26, WHITE)
    label(c, name, x + 5, 268, INK, 5.7)
    body(c, f'CMYK<br/>{cmyk}<br/><br/>RGB<br/>{rgb}<br/><br/>{hexx}', x + 5, 242, sw - 10, 6.1, 8.7, INK, True)
box(c, M, 72, 250, 78, INK, INK)
label(c, 'INK / #191919 / RGB 25 25 25', M + 12, 105, WHITE, 6.4)
box(c, 322, 72, 250, 78, PAPER, LIGHT)
label(c, 'PAPER / #F7F7FB / RGB 247 247 251', 334, 105, INK, 6.4)
folio(c, 16, 'Color + Type')
c.showPage()

# 17 - gradient system
bg(c)
label(c, 'GRADIENT SYSTEM', M, H - 42, PURPLE)
title(c, 'ENERGY IN TRANSITION.', M, H - 102, 39, INK, W - 2 * M)
gradient(c, M, 330, W - 2 * M, 300, True)
wordmark(c, M + 78, 452, W - 2 * M - 156, WHITE)
body(c, '<b>Use gradients as atmospheric fields, not decoration.</b> Keep transitions broad, soft, and high-energy. Avoid muddy blends or more than four dominant color zones in a single application.', M, 278, 330, 9, 13)
label(c, 'APPROVED / BROAD + SATURATED', 414, 244, GREEN)
folio(c, 17, 'Color + Type')
c.showPage()

# 18 - typography
bg(c, WHITE)
label(c, 'TYPOGRAPHY', M, H - 42, PINK)
title(c, 'TWO FONTS. TWO JOBS.', M, H - 102, 40, INK, W - 2 * M)
title(c, 'Aa', M, 435, 150, INK)
title(c, 'CITYBURN REGULAR', M, 390, 25, PINK)
label(c, 'DISPLAY / HEADLINES / CALLOUTS', M, 360, INK)
c.setFillColor(INK)
c.setFont('Cityburn', 15)
for index, sample in enumerate(['ABCDEFGHIJKLM', 'NOPQRSTUVWXYZ', '0123456789']):
    c.drawString(325, 520 - index * 24, sample)
rule(c, M, 320, W - M, 320, LIGHT)
c.setFillColor(INK)
c.setFont('CourierNew-Bold', 112)
c.drawString(M, 170, 'Aa')
label(c, 'COURIER NEW BOLD + REGULAR', M, 140, CYAN)
label(c, 'BODY / DATA / CAPTIONS / WAYFINDING', M, 114, INK)
body(c, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>abcdefghijklmnopqrstuvwxyz<br/>0123456789', 325, 236, 245, 9.6, 17)
folio(c, 18, 'Color + Type')
c.showPage()

# 19 - hierarchy
bg(c)
label(c, 'TYPE HIERARCHY', M, H - 42, PURPLE)
title(c, 'BUILD A CLEAR SIGNAL.', M, H - 102, 39, INK, W - 2 * M)
box(c, M, 125, W - 2 * M, 510, WHITE, LIGHT)
label(c, '01 / DISPLAY', M + 25, 596, PINK)
title(c, 'THE STAGE LISTENS BACK.', M + 25, 535, 46, INK, W - 2 * M - 50)
label(c, '02 / SUBHEAD', M + 25, 474, CYAN)
c.setFillColor(INK)
c.setFont('CourierNew-Bold', 15)
c.drawString(M + 25, 442, 'RESPONSIVE ENVIRONMENTS / LIVE INPUT')
label(c, '03 / BODY', M + 25, 384, PURPLE)
body(c, 'The visual system should feel expressive at a distance and precise up close. Use generous spacing, short lines, and clear contrast.', M + 25, 354, 330, 10, 15)
label(c, '04 / CAPTION', M + 25, 235, GREEN)
label(c, 'IMAGE 01 / ENVIRONMENT STUDY / 2025', M + 25, 202, INK, 7)
body(c, 'DISPLAY: CITYBURN<br/>SUBHEAD: COURIER NEW BOLD<br/>BODY: COURIER NEW REGULAR<br/>CAPTION: COURIER NEW BOLD', 404, 365, 144, 7.4, 12, GRAY, True)
folio(c, 19, 'Color + Type')
c.showPage()

# 20 - graphic language chapter
chapter(c, 20, '04', 'GRAPHIC LANGUAGE', 'VISUALIZER / GRID / IMAGERY / COMPOSITION')

# 21 - visualizer bars
bg(c, WHITE)
label(c, 'PRIMARY GRAPHIC DEVICE', M, H - 42, PINK)
title(c, 'THE VISUALIZER', M, H - 102, 42, INK, W - 2 * M)
wordmark(c, M, 430, W - 2 * M, PINK)
rule(c, M, 400, W - M, 400, INK, 1)
for i, color in enumerate(COLORS):
    c.setFillColor(color)
    heights = [70, 115, 155, 92, 138, 58]
    c.rect(M + i * 87, 160, 58, heights[i], fill=1, stroke=0)
    label(c, f'0{i+1}', M + i * 87, 140, INK, 6)
body(c, 'Bars may change height and rhythm to respond to sound, data, or gesture. Keep edges square, spacing consistent, and alignment anchored to a shared baseline.', M, 104, 440, 8.8, 12.5)
folio(c, 21, 'Graphic Language')
c.showPage()

# 22 - layout grid
bg(c)
label(c, 'LAYOUT SYSTEM', M, H - 42, PURPLE)
title(c, 'SIX COLUMNS. ONE RHYTHM.', M, H - 102, 39, INK, W - 2 * M)
grid_x, grid_y, grid_w, grid_h = M, 185, W - 2 * M, 430
gutter = 10
col_w = (grid_w - gutter * 5) / 6
for i in range(6):
    c.setFillColor(Color(CYAN.red, CYAN.green, CYAN.blue, alpha=0.18))
    c.rect(grid_x + i * (col_w + gutter), grid_y, col_w, grid_h, fill=1, stroke=0)
    label(c, str(i + 1), grid_x + i * (col_w + gutter) + 4, grid_y + 8, CYAN, 6)
title(c, 'HEADLINES MAY SPAN 4-6 COLUMNS.', M, 550, 25, INK, W - 2 * M)
body(c, 'Body copy should span 2-3 columns. Images may occupy the full grid or align in connected modules. Keep the outer margin visible unless an image is intentionally full bleed.', M, 152, 420, 8.8, 12.5)
folio(c, 22, 'Graphic Language')
c.showPage()

# 23 - imagery direction
bg(c, WHITE)
label(c, 'IMAGERY DIRECTION', M, H - 42, PINK)
title(c, 'IMMERSIVE / HUMAN / REACTIVE', M, H - 102, 34, INK, W - 2 * M)
image_row(c, [ASSETS / 'p11_i01.png', ASSETS / 'p13_i04.jpg'], M, 390, W - 2 * M, 245, 8)
image_row(c, [ASSETS / 'p12_i01.jpg', ASSETS / 'p07_i01.jpg'], M, 176, W - 2 * M, 190, 8)
dos = '<b>DO</b><br/>SHOW SCALE<br/>INCLUDE HUMAN PRESENCE<br/>PRIORITIZE REACTIVE LIGHT<br/>USE HIGH-CONTRAST COLOR'
donts = '<b>AVOID</b><br/>GENERIC CROWD STOCK<br/>FLAT CORPORATE LIGHTING<br/>PASSIVE STAGE PHOTOS<br/>MUDDY OR DESATURATED COLOR'
body(c, dos, M, 148, 230, 7.4, 11, GREEN)
body(c, donts, 326, 148, 230, 7.4, 11, RED)
folio(c, 23, 'Graphic Language')
c.showPage()

# 24 - applications chapter
chapter(c, 24, '05', 'APPLICATIONS', 'SOCIAL / POSTERS / MERCHANDISE / ENVIRONMENT / MOTION')

# 25 - social
bg(c, WHITE)
label(c, 'SOCIAL SYSTEM', M, H - 42, PINK)
title(c, 'PORTRAITS AS SIGNALS.', M, H - 102, 39, INK, W - 2 * M)
image_row(c, [ASSETS / 'p22_i01.jpg', ASSETS / 'p22_i03.jpg'], M, 400, W - 2 * M, 245, 8)
image_row(c, [ASSETS / 'p22_i02.jpg', ASSETS / 'p22_i04.jpg'], M, 140, W - 2 * M, 245, 8)
label(c, 'KEEP THE HAND FRAME CONSISTENT / CHANGE COLOR BY PROGRAM', M, 102, PURPLE, 6.8)
folio(c, 25, 'Applications')
c.showPage()

# 26 - posters + OOH
bg(c)
label(c, 'POSTERS / OUT OF HOME', M, H - 42, PINK)
title(c, 'SCALE THE SYSTEM.', M, H - 102, 40, INK, W - 2 * M)
image_row(c, [DL / 'poster-01.png', DL / 'poster-02.png', DL / 'poster-03.png'], M, 315, W - 2 * M, 345, 8)
place(c, DL / 'ooh-04.jpg', M, 75, W - 2 * M, 210)
folio(c, 26, 'Applications')
c.showPage()

# 27 - merchandise
bg(c, WHITE)
label(c, 'MERCHANDISE', M, H - 42, PURPLE)
title(c, 'WEAR THE SIGNAL.', M, H - 102, 40, INK, W - 2 * M)
image_row(c, [ASSETS / 'p21_i01.jpg', ASSETS / 'p21_i02.jpg'], M, 392, W - 2 * M, 280, 10)
place(c, ASSETS / 'p21_i03.jpg', M, 88, W - 2 * M, 280)
folio(c, 27, 'Applications')
c.showPage()

# 28 - environmental
bg(c)
label(c, 'ENVIRONMENTAL', M, H - 42, PINK)
title(c, 'MAKE THE MARK PHYSICAL.', M, H - 102, 38, INK, W - 2 * M)
image_row(c, [ASSETS / 'p11_i03.jpg', ASSETS / 'p12_i01.jpg'], M, 365, W - 2 * M, 270, 8)
place(c, ASSETS / 'p13_i04.jpg', M, 108, W - 2 * M, 230)
body(c, 'At environmental scale, the hand becomes wayfinding, interface, stage architecture, and proof that participation is active.', M, 82, 490, 8.2, 11.5)
folio(c, 28, 'Applications')
c.showPage()

# 29 - motion
bg(c, WHITE)
label(c, 'MOTION BEHAVIOR', M, H - 42, PINK)
title(c, 'BARS RESPOND. THE HAND HOLDS.', M, H - 102, 35, INK, W - 2 * M)
place(c, ASSETS / 'p24_i01.jpg', M, 485, W - 2 * M, 180)
place(c, ASSETS / 'p24_i02.jpg', M, 283, W - 2 * M, 180)
place(c, ASSETS / 'p25_i04.jpg', M, 81, W - 2 * M, 180)
body(c, 'Motion should feel responsive, not ornamental. Animate bar height, rhythm, scale, and color while the baseline and palm remain stable.', M, 56, 470, 8.2, 11.5)
folio(c, 29, 'Applications')
c.showPage()

# 30 - digital + accessibility
bg(c)
label(c, 'DIGITAL / ACCESSIBILITY', M, H - 42, CYAN)
title(c, 'ENERGY NEEDS CLARITY.', M, H - 102, 40, INK, W - 2 * M)
cards = [
    ('CONTRAST', 'Use white or ink text on solid fields. Avoid body copy directly over gradients.'),
    ('MOTION', 'Respect reduced-motion settings. Never rely on animation alone to communicate state.'),
    ('COLOR', 'Pair color with labels, shape, or position. Do not use hue as the only signal.'),
    ('TYPE', 'Keep body copy at a readable size and maintain generous line spacing.'),
]
y = 510
for i, (head, desc) in enumerate(cards):
    color = COLORS[i]
    box(c, M, y, W - 2 * M, 112, WHITE, LIGHT)
    hand(c, M + 18, y + 20, 50, color)
    title(c, head, 125, y + 65, 24, INK, 180)
    body(c, desc, 330, y + 75, 220, 8.3, 12)
    y -= 130
folio(c, 30, 'Applications')
c.showPage()

# 31 - final standard
gradient(c)
hand(c, 116, 160, 380, WHITE)
label(c, 'WWIMF / BRAND GUIDELINES / VERSION 1.0', M, H - 42, WHITE)
title(c, 'MAKE PARTICIPATION VISIBLE.', M, 72, 36, WHITE, W - 2 * M)
folio(c, 31, 'Closing', WHITE)
c.showPage()

c.save()

# Preserve the established front and back covers; replace the entire interior.
source = PdfReader(str(SOURCE))
interior = PdfReader(str(INTERIOR))
writer = PdfWriter()
writer.add_page(source.pages[0])
for page in interior.pages:
    writer.add_page(page)
writer.add_page(source.pages[27])
writer.add_metadata({
    '/Title': 'WWIMF Brand Guidelines',
    '/Author': 'James Kordic',
    '/Subject': 'WorldWide Interactive Music Festival brand standards',
})
with OUTPUT.open('wb') as stream:
    writer.write(stream)

assert len(PdfReader(str(OUTPUT)).pages) == 32
print(OUTPUT)
