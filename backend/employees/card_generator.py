"""
Carte de visite TDM — 90mm x 60mm HORIZONTALE
Design fidèle à la vraie carte TDM
"""
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image
import io, os

CARD_W = 90 * mm
CARD_H = 60 * mm

BORDEAUX  = HexColor('#6B2737')
OLIVE     = HexColor('#8BAD3F')   # vert olive exact de la photo
DARK      = HexColor('#1C1C1C')

BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for _n in ['tdm_logo_transparent.png', 'tdm_logo.png']:
    _p = os.path.join(BASE_DIR, _n)
    if os.path.exists(_p):
        LOGO_PATH = _p; break
else:
    LOGO_PATH = None


def get_logo():
    return ImageReader(LOGO_PATH) if LOGO_PATH else None


def get_employee_photo(employee):
    """Retourne ImageReader de la photo employé ou None"""
    try:
        if employee.photo:
            path = employee.photo.path
            if os.path.exists(path):
                # Crop en cercle ou carré — retourner tel quel
                return ImageReader(path)
    except Exception:
        pass
    return None


def draw_olive_bloc(c, W, H):
    """
    Bloc vert olive haut-droit avec bord inférieur en vague douce
    Commence après le logo (~33mm) jusqu'au bord droit
    """
    start_x = 33 * mm
    bloc_h   = 17 * mm

    p = c.beginPath()
    p.moveTo(start_x, H)
    p.lineTo(W, H)
    p.lineTo(W, H - bloc_h)
    # Bord inférieur vague : descend légèrement vers la gauche
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

    # ── Fond entièrement blanc ──────────────────────────
    c.setFillColor(HexColor('#F7FEE7'))
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # ── Bloc vert olive ─────────────────────────────────
    draw_olive_bloc(c, W, H)

    # ── Texte dans le bloc vert ──────────────────────────
    if lang == 'fr':
        header_text = "TELEDIFFUSION DE MAURITANIE TDM.S.A"
    else:
        header_text = "البث الإذاعي والتلفزي الموريتاني ش.م"

    c.setFillColor(DARK)
    c.setFont("Helvetica-Bold", 7.8)
    tw = c.stringWidth(header_text, "Helvetica-Bold", 7.8)
    # Zone verte : 33mm → 90mm  (largeur ~57mm)
    zone_cx = (33*mm + W) / 2
    c.drawString(zone_cx - tw/2, H - 10*mm, header_text)

    # ── Logo TDM (haut-gauche, plus petit) ───────────────
    logo = get_logo()
    lw = 28 * mm   # réduit
    lh = 16 * mm
    if logo:
        c.drawImage(logo, 2*mm, H - lh - 1*mm,
                    width=lw, height=lh,
                    mask='auto', preserveAspectRatio=True)

    # ── Photo employé (10mm x 16mm) à droite du logo ─────
    # Positionnée dans la zone blanche, côté droit de l'en-tête
    photo_w = 10 * mm
    photo_h = 16 * mm
    photo_x = W - photo_w - 3*mm
    photo_y = H - photo_h - 19*mm   # juste sous le bloc vert

    emp_photo = get_employee_photo(emp)
    if emp_photo:
        # Fond gris clair derrière photo
        c.setFillColor(HexColor('#E5E5E5'))
        c.rect(photo_x - 0.5*mm, photo_y - 0.5*mm,
               photo_w + 1*mm, photo_h + 1*mm, fill=1, stroke=0)
        c.drawImage(emp_photo, photo_x, photo_y,
                    width=photo_w, height=photo_h,
                    preserveAspectRatio=True, mask='auto')
    # Pas de photo = rien du tout

    # ── NOM — centré horizontalement ────────────────────
    if lang == 'fr':
        name = f"{emp.first_name.upper()} {emp.last_name.upper()}"
    else:
        name = f"{emp.first_name_ar} {emp.last_name_ar}" if emp.first_name_ar else f"{emp.first_name} {emp.last_name}"

    c.setFillColor(DARK)
    fs_name = 11
    c.setFont("Helvetica-Bold", fs_name)
    while c.stringWidth(name, "Helvetica-Bold", fs_name) > W - photo_w - 14*mm and fs_name > 7:
        fs_name -= 0.5
        c.setFont("Helvetica-Bold", fs_name)

    # Centrer dans la zone sans la photo
    zone_w = W - photo_w - 8*mm
    nw = c.stringWidth(name, "Helvetica-Bold", fs_name)
    nx = (zone_w - nw) / 2 + 3*mm
    c.drawString(nx, H - 29*mm, name)

    # ── POSTE — centré ────────────────────────────────────
    if lang == 'fr':
        pos = emp.position.upper()
    else:
        pos = emp.position_ar if emp.position_ar else emp.position

    c.setFillColor(BORDEAUX)
    fs_pos = 9
    c.setFont("Helvetica-Bold", fs_pos)
    while c.stringWidth(pos, "Helvetica-Bold", fs_pos) > W - photo_w - 14*mm and fs_pos > 6:
        fs_pos -= 0.5
        c.setFont("Helvetica-Bold", fs_pos)

    pw = c.stringWidth(pos, "Helvetica-Bold", fs_pos)
    px = (zone_w - pw) / 2 + 3*mm
    c.drawString(px, H - 38*mm, pos)

    # ── Ligne bordeaux ────────────────────────────────────
    sep_y = H - 42*mm
    c.setStrokeColor(BORDEAUX)
    c.setLineWidth(0.7)
    c.line(3*mm, sep_y, W - 3*mm, sep_y)

    # ── CONTACT — centré en bas ───────────────────────────
    c.setFillColor(DARK)
    cy = sep_y - 4.5*mm
    gap = 4*mm

    def cline(text, size=7.2):
        nonlocal cy
        c.setFont("Helvetica-Bold", size)
        tw2 = c.stringWidth(text, "Helvetica-Bold", size)
        c.drawString((W - tw2)/2, cy, text)
        cy -= gap

    if lang == 'fr':
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
    Disposition : 2 colonnes x 3 lignes, avec traits de coupe
    """
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm

    A4_W, A4_H = A4   # 210mm x 297mm

    CARD_W_local = 90 * mm
    CARD_H_local = 60 * mm

    # Marges et espacement
    margin_x = (A4_W - 2 * CARD_W_local) / 3   # espace entre colonnes et bords
    margin_y = (A4_H - 3 * CARD_H_local) / 4   # espace entre lignes et bords

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)

    for lang_page in ['fr', 'ar']:
        # Dessiner 6 cartes : 2 colonnes x 3 lignes
        for row in range(3):
            for col in range(2):
                x = margin_x + col * (CARD_W_local + margin_x)
                y = A4_H - margin_y - (row + 1) * CARD_H_local - row * margin_y

                # Sauvegarder l'état et translater au coin de la carte
                c.saveState()
                c.translate(x, y)

                # Dessiner la carte dans cet espace
                draw_face(c, employee, lang=lang_page)

                c.restoreState()

                # Traits de coupe (tirets fins gris autour de chaque carte)
                c.setStrokeColor(HexColor('#BBBBBB'))
                c.setLineWidth(0.3)
                cut = 3 * mm  # longueur du trait de coupe

                # Coins : haut-gauche, haut-droit, bas-gauche, bas-droit
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
