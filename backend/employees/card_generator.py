"""
Carte de visite TDM — 90mm x 60mm HORIZONTALE
Design fidèle à la vraie carte TDM
"""
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image
import io, os

CARD_W = 90 * mm
CARD_H = 60 * mm

BORDEAUX  = HexColor('#6B2737')
OLIVE     = HexColor('#8BAD3F')
DARK      = HexColor('#1C1C1C')

BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for _n in ['tdm_logo_transparent.png', 'tdm_logo.png']:
    _p = os.path.join(BASE_DIR, _n)
    if os.path.exists(_p):
        LOGO_PATH = _p; break
else:
    LOGO_PATH = None

# ── Arabic font detection ──────────────────────────────────────
# Place Amiri-Regular.ttf in backend/fonts/ for best results.
# Download free at: https://fonts.google.com/specimen/Amiri
_ARABIC_FONT = None
_ARABIC_FONT_PATHS = [
    os.path.join(BASE_DIR, 'fonts', 'Amiri-Regular.ttf'),
    os.path.join(BASE_DIR, 'fonts', 'arabic.ttf'),
    # Windows system fonts with Arabic support
    r'C:\Windows\Fonts\tahoma.ttf',
    r'C:\Windows\Fonts\arial.ttf',
    r'C:\Windows\Fonts\calibri.ttf',
    # Linux
    '/usr/share/fonts/truetype/amiri/Amiri-Regular.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
    # macOS
    '/Library/Fonts/Arial Unicode MS.ttf',
]

for _fp in _ARABIC_FONT_PATHS:
    if os.path.exists(_fp):
        try:
            pdfmetrics.registerFont(TTFont('ArabicFont', _fp))
            _ARABIC_FONT = 'ArabicFont'
            break
        except Exception:
            continue


def process_arabic(text):
    """Reshape + bidi Arabic text so it renders correctly in PDF."""
    if not text:
        return ''
    try:
        import arabic_reshaper
        from bidi.algorithm import get_display
        return get_display(arabic_reshaper.reshape(str(text)))
    except ImportError:
        return str(text)


def ar_font():
    return _ARABIC_FONT or 'Helvetica-Bold'


def get_logo():
    return ImageReader(LOGO_PATH) if LOGO_PATH else None


def get_employee_photo(employee):
    try:
        if employee.photo:
            path = employee.photo.path
            if os.path.exists(path):
                return ImageReader(path)
    except Exception:
        pass
    return None


def draw_olive_bloc(c, W, H):
    start_x = 33 * mm
    bloc_h   = 17 * mm

    p = c.beginPath()
    p.moveTo(start_x, H)
    p.lineTo(W, H)
    p.lineTo(W, H - bloc_h)
    p.curveTo(
        W - 18*mm, H - bloc_h,
        start_x + 12*mm, H - bloc_h + 6*mm,
        start_x, H - bloc_h + 5*mm
    )
    p.close()
    c.setFillColor(OLIVE)
    c.drawPath(p, fill=1, stroke=0)


def draw_face(c, emp, lang='fr'):
    W, H = CARD_W, CARD_H
    is_ar = (lang == 'ar')

    # ── Fond blanc ──────────────────────────────────────────────
    c.setFillColor(HexColor('#F7FEE7'))
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # ── Bloc vert olive ─────────────────────────────────────────
    draw_olive_bloc(c, W, H)

    # ── Texte dans le bloc vert ──────────────────────────────────
    if is_ar:
        raw_header = "البث الإذاعي والتلفزي الموريتاني ش.م"
        header_text = process_arabic(raw_header)
        font_h = ar_font()
    else:
        header_text = "TELEDIFFUSION DE MAURITANIE TDM.S.A"
        font_h = "Helvetica-Bold"

    c.setFillColor(DARK)
    c.setFont(font_h, 7.8)
    tw = c.stringWidth(header_text, font_h, 7.8)
    zone_cx = (33*mm + W) / 2
    c.drawString(zone_cx - tw/2, H - 10*mm, header_text)

    # ── Logo TDM ────────────────────────────────────────────────
    logo = get_logo()
    lw = 28 * mm
    lh = 16 * mm
    if logo:
        c.drawImage(logo, 2*mm, H - lh - 1*mm,
                    width=lw, height=lh,
                    mask='auto', preserveAspectRatio=True)

    # ── Photo employé ────────────────────────────────────────────
    photo_w = 10 * mm
    photo_h = 16 * mm
    photo_x = W - photo_w - 3*mm
    photo_y = H - photo_h - 19*mm

    emp_photo = get_employee_photo(emp)
    if emp_photo:
        c.setFillColor(HexColor('#E5E5E5'))
        c.rect(photo_x - 0.5*mm, photo_y - 0.5*mm,
               photo_w + 1*mm, photo_h + 1*mm, fill=1, stroke=0)
        c.drawImage(emp_photo, photo_x, photo_y,
                    width=photo_w, height=photo_h,
                    preserveAspectRatio=True, mask='auto')

    # ── NOM ──────────────────────────────────────────────────────
    if is_ar:
        raw_name = (f"{emp.first_name_ar} {emp.last_name_ar}"
                    if emp.first_name_ar else f"{emp.first_name} {emp.last_name}")
        name = process_arabic(raw_name)
        name_font = ar_font()
    else:
        name = f"{emp.first_name.upper()} {emp.last_name.upper()}"
        name_font = "Helvetica-Bold"

    c.setFillColor(DARK)
    fs_name = 11
    c.setFont(name_font, fs_name)
    while c.stringWidth(name, name_font, fs_name) > W - photo_w - 14*mm and fs_name > 7:
        fs_name -= 0.5
        c.setFont(name_font, fs_name)

    zone_w = W - photo_w - 8*mm
    nw = c.stringWidth(name, name_font, fs_name)
    nx = (zone_w - nw) / 2 + 3*mm
    c.drawString(nx, H - 29*mm, name)

    # ── POSTE ────────────────────────────────────────────────────
    if is_ar:
        raw_pos = emp.position_ar if emp.position_ar else emp.position
        pos = process_arabic(raw_pos)
        pos_font = ar_font()
    else:
        pos = emp.position.upper()
        pos_font = "Helvetica-Bold"

    c.setFillColor(BORDEAUX)
    fs_pos = 9
    c.setFont(pos_font, fs_pos)
    while c.stringWidth(pos, pos_font, fs_pos) > W - photo_w - 14*mm and fs_pos > 6:
        fs_pos -= 0.5
        c.setFont(pos_font, fs_pos)

    pw = c.stringWidth(pos, pos_font, fs_pos)
    px = (zone_w - pw) / 2 + 3*mm
    c.drawString(px, H - 38*mm, pos)

    # ── Ligne bordeaux ────────────────────────────────────────────
    sep_y = H - 42*mm
    c.setStrokeColor(BORDEAUX)
    c.setLineWidth(0.7)
    c.line(3*mm, sep_y, W - 3*mm, sep_y)

    # ── CONTACT ───────────────────────────────────────────────────
    c.setFillColor(DARK)
    cy = sep_y - 4.5*mm
    gap = 4*mm

    def cline(text, size=7.2):
        nonlocal cy
        if is_ar:
            processed = process_arabic(text)
            font = ar_font()
        else:
            processed = text
            font = 'Helvetica-Bold'
        c.setFont(font, size)
        tw2 = c.stringWidth(processed, font, size)
        c.drawString((W - tw2) / 2, cy, processed)
        cy -= gap

    if not is_ar:
        if emp.address:
            cline(emp.address)
        parts = []
        if emp.phone: parts.append(f"Tél: {emp.phone}")
        if emp.fax:   parts.append(f"Fax:{emp.fax}")
        if parts: cline("-".join(parts))
        if emp.email: cline(f"E-mail:  {emp.email}")
    else:
        addr = emp.address_ar or emp.address
        if addr: cline(addr)
        parts = []
        if emp.phone: parts.append(f"هاتف: {emp.phone}")
        if emp.fax:   parts.append(f"فاكس: {emp.fax}")
        if parts: cline(" / ".join(parts))
        if emp.email: cline(f"البريد الإلكتروني: {emp.email}")


def generate_business_card(employee, lang='both'):
    """
    Génère un PDF avec :
    - Page 1 : 6 cartes RECTO (FR) sur une feuille A4
    - Page 2 : 6 cartes VERSO (AR) sur une feuille A4
    """
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm

    A4_W, A4_H = A4

    CARD_W_local = 90 * mm
    CARD_H_local = 60 * mm

    margin_x = (A4_W - 2 * CARD_W_local) / 3
    margin_y = (A4_H - 3 * CARD_H_local) / 4

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)

    for lang_page in ['fr', 'ar']:
        for row in range(3):
            for col in range(2):
                x = margin_x + col * (CARD_W_local + margin_x)
                y = A4_H - margin_y - (row + 1) * CARD_H_local - row * margin_y

                c.saveState()
                c.translate(x, y)
                draw_face(c, employee, lang=lang_page)
                c.restoreState()

                c.setStrokeColor(HexColor('#BBBBBB'))
                c.setLineWidth(0.3)
                cut = 3 * mm

                for cx, cy, dx, dy in [
                    (x, y + CARD_H_local, 1, 0), (x, y + CARD_H_local, 0, -1),
                    (x + CARD_W_local, y + CARD_H_local, -1, 0), (x + CARD_W_local, y + CARD_H_local, 0, -1),
                    (x, y, 1, 0), (x, y, 0, 1),
                    (x + CARD_W_local, y, -1, 0), (x + CARD_W_local, y, 0, 1),
                ]:
                    c.line(cx, cy, cx + dx * cut, cy + dy * cut)

        c.showPage()

    c.save()
    buffer.seek(0)
    return buffer.read()
