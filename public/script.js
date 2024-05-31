// public/script.js
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', document.getElementById('fileInput').files[0]);

    const loading = document.getElementById('loading');
    const copyBtn = document.getElementById('copy-ico');
    loading.style.display = 'block';

    try {
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    document.getElementById('result').textContent = result.text;
    }catch(err) {
        console.error('Error', err);
        document.getElementById('result').textContent = 'An error occurred while processing the image.';
    } finally {
        loading.style.display = 'none';
        copyBtn.style.display = 'flex';
        CopyToClipboard('result')
    }
    
    
});


function CopyToClipboard(id)
{
    var r = document.createRange();
    r.selectNode(document.getElementById(id));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const previewImage = document.getElementById('previewImage');
    const reader = new FileReader();

    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'grid'; 
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        previewImage.src = '#';
        previewImage.style.display = 'none';
    }
});
