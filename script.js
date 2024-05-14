function encode() {
    var imageInput = document.getElementById('imageInput');
    var textToHide = document.getElementById('textToHide').value;
    if (imageInput.files && imageInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var data = imageData.data;
                var textBytes = textToHide.split('').map(function (c) { return c.charCodeAt(0); });
                textBytes.push(0); // Terminator character
                var byteIndex = 0, bitIndex = 0;
                for (var i = 0; i < data.length; i++) {
                    if (byteIndex < textBytes.length) {
                        data[i] = (data[i] & 0xFE) | ((textBytes[byteIndex] >> (7 - bitIndex)) & 1);
                        bitIndex++;
                        if (bitIndex === 8) {
                            bitIndex = 0;
                            byteIndex++;
                        }
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                var encodedImage = canvas.toDataURL('image/png');
                var download = document.getElementById('download');
                download.href = encodedImage;
                download.style.display = 'block';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
}

function decode() {
    var imageInputDecode = document.getElementById('imageInputDecode');
    if (imageInputDecode.files && imageInputDecode.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var data = imageData.data;
                var hiddenText = '';
                var byteValue = 0, bitCount = 0;
                for (var i = 0; i < data.length; i++) {
                    byteValue = (byteValue << 1) | (data[i] & 1);
                    bitCount++;
                    if (bitCount % 8 === 0) {
                        if (byteValue === 0) {
                            break;
                        }
                        hiddenText += String.fromCharCode(byteValue);
                        byteValue = 0;
                    }
                }
                document.getElementById('hiddenText').value = hiddenText;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(imageInputDecode.files[0]);
    }
}
