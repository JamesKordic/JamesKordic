from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path('/Users/jameskordic/JamesKordic')
OUT = ROOT / 'output/pdf/JamesKordic_Kith_Resume.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont('Noto', '/Library/Fonts/NotoSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoBold', '/Library/Fonts/NotoSans-Bold.ttf'))
pdfmetrics.registerFontFamily('Noto', normal='Noto', bold='NotoBold')

PAGE_W, PAGE_H = 612, 792
LEFT, MAIN_W, SIDE, SIDE_W = 40.4, 362, 452, 119.6
INK = HexColor('#111111')
MUTED = HexColor('#585858')
c = canvas.Canvas(str(OUT), pagesize=(PAGE_W, PAGE_H), pageCompression=1)
c.setTitle('James Kordic | Graphic & Motion Designer')
c.setAuthor('James Kordic')
c.setSubject('Resume - Kith Associate Graphic Designer')
layout = []


def para(text, x, top, width, size=9.5, leading=13.2, bold=False, color=INK):
    style = ParagraphStyle('text', fontName='NotoBold' if bold else 'Noto',
                           fontSize=size, leading=leading, textColor=color,
                           splitLongWords=False)
    # Keep the final two words together so wrapping cannot strand one word.
    parts = escape(text).rsplit(' ', 1)
    p = Paragraph('&#160;'.join(parts), style)
    _, height = p.wrap(width, PAGE_H)
    p.drawOn(c, x, PAGE_H-top-height)
    layout.append((text, x, top, width, height))
    return top + height


def heading(text, x, top, width):
    return para(text, x, top, width, size=15.5, leading=19, bold=True) + 10


def bullet(text, top):
    para('-', LEFT, top, 10, size=9.4, leading=13)
    return para(text, LEFT+14, top, MAIN_W-14, size=9.4, leading=13) + 3


def role(title, dates, employer, top, bullets):
    title_end = LEFT + pdfmetrics.stringWidth(title, 'NotoBold', 9.7)
    dates_width = pdfmetrics.stringWidth(dates, 'Noto', 9.1)
    date_x = LEFT + MAIN_W - dates_width
    assert title_end + 8 < date_x, (title, title_end, date_x)
    para(title, LEFT, top, date_x-LEFT-8, size=9.7, leading=13.2, bold=True)
    para(dates, date_x, top+0.5, dates_width+1, size=9.1, leading=12.7)
    top = para(employer, LEFT, top+15, MAIN_W, size=9.4, leading=13, color=MUTED) + 4
    for b in bullets:
        top = bullet(b, top)
    return top + 8


# Preserve the original two-column structure and typography.
para('James Kordic', LEFT, 45, MAIN_W, size=19, leading=23, bold=True)
para('Graphic & Motion Designer', LEFT, 70, MAIN_W, size=14, leading=18, color=HexColor('#777777'))
for i, (label, uri) in enumerate([
    ('jkordic@me.com', 'mailto:jkordic@me.com'),
    ('631.742.8043', 'tel:+16317428043'),
    ('jameskordic.com', 'https://jameskordic.com'),
]):
    top = 43+i*13.45
    bottom = para(label, SIDE, top, SIDE_W, size=9, leading=12)
    c.linkURL(uri, (SIDE, PAGE_H-bottom, SIDE+pdfmetrics.stringWidth(label, 'Noto', 9), PAGE_H-top), relative=0)

top = heading('Summary', LEFT, 115, MAIN_W)
top = para(
    'Graphic and motion designer creating cohesive brand campaigns, social content and event collateral across digital and print. Experienced in visual systems, stakeholder presentations and production-ready artwork.',
    LEFT, top, MAIN_W, size=9.7, leading=14.6,
) + 18
top = heading('Experience', LEFT, top, MAIN_W)
top = role('Freelance Designer', 'Jun 2026 - Present', 'Lisa Heller  |  New York, NY, USA', top, [
    'Created album and single artwork to establish a cohesive identity across streaming, social and print.',
    'Designed social announcements and printed posters to promote live shows.',
    'Animated cover artwork for streaming and social release announcements.',
])
top = role('Multidisciplinary Design Consultant', 'Apr 2026 - May 2026', 'THE\u00b7TEAM  |  Remote, USA', top, [
    'Designed materials for a national cultural event, maintaining visual consistency across multiple workstreams.',
    'Presented visual strategy to directors and stakeholders through design directions, decks and mockups.',
    'Delivered graphics, 2D flats and production-ready mechanicals.',
])
top = role('Freelance Graphic & Motion Designer', 'May 2025 - Mar 2026', 'The Syndicate  |  Weehawken, NJ, USA', top, [
    "Created digital, print and motion assets for Taco Bell, Guns N' Roses, A2IM and FX, reaching 500K+ across digital platforms.",
    'Increased engagement 15% with targeted ad and social campaigns.',
    'Built reusable templates and design systems, cutting turnaround time 20%.',
])
top = role('Video, Motion, Design & Content Intern', 'Aug 2024 - May 2025', 'The Syndicate  |  Remote, USA', top, [
    'Supported the Creative Director and Senior Designers in producing multichannel print and digital campaign assets.',
])
top = role('Visual Designer', 'Oct 2022 - May 2025', 'Rochester Institute of Technology  |  Rochester, NY, USA', top, [
    'Managed visual identity and marketing collateral for 20+ departments across Student Life and GCCIS.',
    'Built campaigns that reached 19K+ students and increased attendance 15%.',
    'Improved social media reach 28% by acting on performance data.',
])

side_top = heading('Education', SIDE, 115, SIDE_W)
side_top = para('Rochester Institute of Technology', SIDE, side_top, SIDE_W, bold=True, leading=13.95)
side_top = para('BFA, Graphic Design', SIDE, side_top, SIDE_W, leading=13.95)
side_top = para('2025', SIDE, side_top, SIDE_W, leading=13.95) + 20
side_top = heading('Skills', SIDE, side_top, SIDE_W)
for item in [
    'Brand Identity', 'Typography', 'Grid & Layout', 'Digital & Print Design',
    'Social Campaigns', 'Event Collateral', 'Design Systems',
    'Motion Graphics', 'Video Editing', 'Photography',
]:
    side_top = para(item, SIDE, side_top, SIDE_W, leading=14.45)
side_top = heading('Software', SIDE, side_top+20, SIDE_W)
for item in [
    'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma',
    'Adobe After Effects', 'Adobe Premiere Pro', 'Adobe Lightroom',
    'Keynote / Slides', 'Microsoft Office',
]:
    side_top = para(item, SIDE, side_top, SIDE_W, leading=14.45)
side_top = heading('AI Tools', SIDE, side_top+20, SIDE_W)
for item in ['Midjourney', 'Adobe Firefly', 'ChatGPT', 'Claude']:
    side_top = para(item, SIDE, side_top, SIDE_W, leading=14.45)

assert top <= 756, f'Experience extends too far: {top}'
assert side_top <= 756, f'Sidebar extends too far: {side_top}'
for text, x, y, width, height in layout:
    assert y >= 35 and y+height <= 756, (text, y, height)
    assert x >= LEFT and x+width <= PAGE_W-39, (text, x, width)
c.showPage()
c.save()
print(f'Saved {OUT}')
print(f'Experience bottom: {top:.1f}; sidebar bottom: {side_top:.1f}')
