function init() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 800;
    document.body.appendChild(canvas);

    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    const baseHue = genify.randInt(0, 360);
    const shapeCount = genify.randInt(5, 10);
    const layerCount = genify.randInt(3, 6);
    const baseSize = genify.randInt(100, 200);
    
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawG(ctx, canvas.width/2, canvas.height/2, baseSize * 2, baseHue);

    for(let layer = 0; layer < layerCount; layer++) {
        const hue = (baseHue + layer * 30) % 360;
        const alpha = genify.randFloat(0.3, 0.7);
        
        for(let i = 0; i < shapeCount; i++) {
            const x = genify.randInt(0, canvas.width);
            const y = genify.randInt(0, canvas.height);
            const size = baseSize * genify.randFloat(0.3, 0.8);
            const rotation = genify.randFloat(0, Math.PI * 2);
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            const shapeType = genify.choice(['circle', 'glyph', 'line']);
            switch(shapeType) {
                case 'circle':
                    drawCircle(ctx, 0, 0, size, hue, alpha);
                    break;
                case 'glyph':
                    drawGlyph(ctx, 0, 0, size, hue, alpha);
                    break;
                case 'line':
                    drawLine(ctx, 0, 0, size, hue, alpha);
                    break;
            }
            
            ctx.restore();
        }
    }

    genify.setFeatures({
        baseHue: baseHue.toString(),
        shapeCount: shapeCount.toString(),
        layerCount: layerCount.toString()
    });

    genify.renderDone();
}

function drawG(ctx, x, y, size, hue) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for(let i = 0; i < 100; i++) {
        const t = i / 100;
        const angle = t * Math.PI * 1.5;
        const r = size * 0.4 * (1 + Math.sin(angle * 2) * 0.1);
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        
        if(i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    
    ctx.lineTo(size * 0.2, 0);
    ctx.stroke();
    ctx.restore();
}

function drawCircle(ctx, x, y, size, hue, alpha) {
    ctx.beginPath();
    ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
    ctx.lineWidth = genify.randFloat(1, 3);
    ctx.arc(x, y, size/2, 0, Math.PI * 2);
    ctx.stroke();
}

function drawGlyph(ctx, x, y, size, hue, alpha) {
    ctx.font = `${size}px Arial`;
    ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
    ctx.fillText('G', x - size/3, y + size/3);
}

function drawLine(ctx, x, y, size, hue, alpha) {
    ctx.beginPath();
    ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
    ctx.lineWidth = genify.randFloat(1, 3);
    
    const angle = genify.randFloat(0, Math.PI * 2);
    const length = size * genify.randFloat(0.5, 1.5);
    
    ctx.moveTo(x - Math.cos(angle) * length/2, y - Math.sin(angle) * length/2);
    ctx.lineTo(x + Math.cos(angle) * length/2, y + Math.sin(angle) * length/2);
    ctx.stroke();
}

init();