from flask import request, jsonify
from PIL import Image

def register_routes(app):
    @app.route('/')
    def root():
        return jsonify({'message': 'PaletteGen API is running ✅'}), 200
    @app.route('/generate-palette', methods=['POST'])
    def generate_palette():
        image = request.files['image']
        b64image = request.form.get('b64image')

        image = Image.open(image)
        image = image.convert('P', palette=Image.ADAPTIVE, colors=16)
        image_palette = image.getpalette()
        image_colors = sorted(image.getcolors())[::-1]

        color_palette = []
        for i in range(16):
            idx = image_colors[i][1]
            dominant_color = image_palette[idx * 3 : idx * 3 + 3]
            color_palette.append('rgb({},{},{})'.format(*dominant_color))

        return jsonify({'palette': color_palette})
