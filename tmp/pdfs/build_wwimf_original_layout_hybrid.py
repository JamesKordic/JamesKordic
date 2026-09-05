from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageFilter
from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path('/Users/jameskordic/JamesKordic')
SOURCE = Path('/Users/jameskordic/Downloads/WorldWide Interactive Music Festival.pdf')
HAND_SOURCE = ROOT / 'tmp/pdfs/wwimf_source/assets/p24_i02.jpg'
HAND_ASSET = ROOT / 'tmp/pdfs/wwimf_exact_hand.png'
CLOSING = ROOT / 'tmp/pdfs/wwimf_original_layout_closing.pdf'
OUTPUT = ROOT / 'output/pdf/wwimf-art-concept-book.pdf'

W, H = letter
PAPER = HexColor('#F7F7FB')
INK = HexColor('#191919')
PINK = HexColor('#ED1D7E')
CYAN = HexColor('#6FCCDD')

CITYBURN_PATH = next(Path('/Users/jameskordic/Library/Fonts').glob('cityburn-*.ttf'))
pdfmetrics.registerFont(TTFont('Cityburn', str(CITYBURN_PATH)))
pdfmetrics.registerFont(TTFont('CourierNew', '/System/Library/Fonts/Supplemental/Courier New.ttf'))
pdfmetrics.registerFont(TTFont('CourierNew-Bold', '/System/Library/Fonts/Supplemental/Courier New Bold.ttf'))


def extract_exact_hand() -> None:
    """Extract the exact white hand silhouette from the original animation artwork."""
    source = Image.open(HAND_SOURCE).convert('RGB')
    channels = source.point(lambda v: 255 if v > 245 else 0).split()
    mask = ImageChops.multiply(ImageChops.multiply(channels[0], channels[1]), channels[2])
    bbox = mask.getbbox()
    if bbox is None:
        raise RuntimeError('Could not isolate the original hand logo')
    mask = mask.crop(bbox)
    # Close tiny JPEG pinholes without redrawing or changing the original silhouette.
    mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    rgba = Image.new('RGBA', mask.size, (25, 25, 25, 0))
    rgba.putalpha(mask)
    rgba.save(HAND_ASSET)


def draw_exact_hand(c: canvas.Canvas, x: float, y: float, w: float, color=INK) -> float:
    mask = Image.open(HAND_ASSET).convert('RGBA')
    alpha = mask.getchannel('A')
    tinted = Image.new('RGBA', mask.size, (
        round(color.red * 255), round(color.green * 255), round(color.blue * 255), 0
    ))
    tinted.putalpha(alpha)
    h = w * mask.height / mask.width
    c.drawImage(ImageReader(tinted), x, y, w, h, preserveAspectRatio=True, mask='auto')
    return h


extract_exact_hand()

# Replacement for the removed thank-you page. The exact hand is the only image.
c = canvas.Canvas(str(CLOSING), pagesize=letter, pageCompression=1)
c.setFillColor(PAPER)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(CYAN)
c.rect(0, H - 14, W, 14, fill=1, stroke=0)
draw_exact_hand(c, 136, 188, 340, INK)
c.setFillColor(PINK)
c.setFont('CourierNew-Bold', 9)
c.drawString(40, H - 48, 'A LAST WORD / 2025')
c.setFillColor(INK)
c.setFont('Cityburn', 38)
c.drawCentredString(W / 2, 132, 'THE SIGNAL CONTINUES.')
c.setFont('CourierNew', 8)
c.drawCentredString(W / 2, 102, 'WORLDWIDE INTERACTIVE MUSIC FESTIVAL')
c.drawString(40, 26, '27')
c.showPage()
c.save()

# Preserve the original page architecture and all original image compositions.
# Only page 27 (the thank-you page) is replaced.
source = PdfReader(str(SOURCE))
closing = PdfReader(str(CLOSING))
writer = PdfWriter()
for index, page in enumerate(source.pages):
    if index == 26:
        writer.add_page(closing.pages[0])
    else:
        writer.add_page(page)

writer.add_metadata({
    '/Title': 'WorldWide Interactive Music Festival - Art and Concept Book',
    '/Author': 'James Kordic',
    '/Subject': 'WWIMF concept book with original image compositions',
})
with OUTPUT.open('wb') as stream:
    writer.write(stream)

assert len(PdfReader(str(OUTPUT)).pages) == 28
print(OUTPUT)
