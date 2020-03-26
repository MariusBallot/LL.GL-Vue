export default class TextureLoader {
    static load(gl, name, url, doYFlip, _onLoad) {
        var img = new Image(1024, 1024)
        img.src = url

        img.onload = () => {
            var tex = gl.createTexture();
            if (doYFlip == true) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);	//Flip the texture by the Y Position, So 0,0 is bottom left corner.

            gl.bindTexture(gl.TEXTURE_2D, tex);														//Set text buffer for work
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);			//Push image to GPU.

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);					//Setup up scaling
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);	//Setup down scaling
            gl.generateMipmap(gl.TEXTURE_2D);	//Precalc different sizes of texture for better quality rendering.

            gl.bindTexture(gl.TEXTURE_2D, null);									//Unbind
            gl.mTextureCache[name] = tex;											//Save ID for later unloading
            if (doYFlip == true) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);	//Stop flipping textures
            _onLoad(tex);
        }
    }
}