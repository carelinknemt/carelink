import { create } from 'qrcode';

const QR_SIZE = 1024;
const QUIET_ZONE_MODULES = 2;
const DARK_COLOR = '#0e508a';
const LIGHT_COLOR = '#ffffff';
const LOGO_PATH = '/images/qrlogo.jpeg';

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Could not load ${src}`));
        image.src = src;
    });
}

function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

/**
 * Render a branded PNG QR code (CareLink colors and logo) for an absolute
 * link. Returns a PNG data URL ready for display or download.
 */
export async function renderQrCode(link: string): Promise<string> {
    const qr = create(link, { errorCorrectionLevel: 'H' });
    const size = qr.modules.size;
    const moduleSize = QR_SIZE / (size + QUIET_ZONE_MODULES * 2);

    const canvas = document.createElement('canvas');
    canvas.width = QR_SIZE;
    canvas.height = QR_SIZE;

    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('2D canvas context unavailable');
    }

    const ctx: CanvasRenderingContext2D = context;

    const offset = QUIET_ZONE_MODULES * moduleSize;
    const radius = moduleSize * 2;

    roundRect(ctx, 0, 0, QR_SIZE, QR_SIZE, radius);
    ctx.fillStyle = LIGHT_COLOR;
    ctx.fill();

    function isFinder(row: number, col: number): boolean {
        return (
            (row < 7 && col < 7) ||
            (row < 7 && col >= size - 7) ||
            (row >= size - 7 && col < 7)
        );
    }

    function drawFinder(rowStart: number, colStart: number): void {
        const x = offset + colStart * moduleSize;
        const y = offset + rowStart * moduleSize;

        roundRect(ctx, x, y, moduleSize * 7, moduleSize * 7, radius);
        ctx.fillStyle = DARK_COLOR;
        ctx.fill();

        ctx.fillStyle = LIGHT_COLOR;
        ctx.fillRect(
            x + moduleSize,
            y + moduleSize,
            moduleSize * 5,
            moduleSize * 5,
        );

        roundRect(
            ctx,
            x + moduleSize * 2,
            y + moduleSize * 2,
            moduleSize * 3,
            moduleSize * 3,
            moduleSize,
        );
        ctx.fillStyle = DARK_COLOR;
        ctx.fill();
    }

    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    ctx.fillStyle = DARK_COLOR;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!isFinder(row, col) && qr.modules.get(row, col)) {
                ctx.fillRect(
                    offset + col * moduleSize,
                    offset + row * moduleSize,
                    moduleSize,
                    moduleSize,
                );
            }
        }
    }

    try {
        const logo = await loadImage(LOGO_PATH);
        const box = QR_SIZE * 0.22;
        const boxX = (QR_SIZE - box) / 2;
        const boxY = (QR_SIZE - box) / 2;

        ctx.fillStyle = LIGHT_COLOR;
        roundRect(ctx, boxX, boxY, box, box, 24);
        ctx.fill();

        const logoMax = box * 0.72;
        const scale = Math.min(logoMax / logo.width, logoMax / logo.height);
        const logoWidth = logo.width * scale;
        const logoHeight = logo.height * scale;
        ctx.drawImage(
            logo,
            (QR_SIZE - logoWidth) / 2,
            (QR_SIZE - logoHeight) / 2,
            logoWidth,
            logoHeight,
        );
    } catch {
        // A plain QR without the logo is still valid.
    }

    return canvas.toDataURL('image/png');
}

/**
 * Build a slugged file name for a downloaded QR PNG, falling back to the
 * given slug when the label does not contain anything slugifiable.
 */
export function qrFileName(label: string, fallbackSlug: string): string {
    const slug = label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${slug || fallbackSlug}-qr.png`;
}
