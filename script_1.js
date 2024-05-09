class KeywordHighlighter {
    constructor() {
        this.keywordColors = {};
        this.fileContent = "";
    }

    readFile() {
        let fileInput = document.getElementById('fileInput');
        let file = fileInput.files[0];

        if (!file) {
            alert('Please select a file.');
            return;
        }

        let reader = new FileReader();

        reader.onload = (e) => {
            this.fileContent = e.target.result;
            document.getElementById("cal").innerHTML = this.fileContent;
        };

        reader.readAsText(file);
    }

    highlightKeyword(inputId) {
        let keywordsInput = document.getElementById(inputId).value.trim();
        let keywordsArray = keywordsInput.split(',').map(keyword => keyword.trim());

        if (keywordsArray.length === 0 || keywordsArray[0] === "") {
            alert("Please enter at least one keyword.");
            return;
        }

        keywordsArray.forEach(keyword => {
            if (!this.keywordColors.hasOwnProperty(keyword)) {
                let color = this.getRandomColor();
                this.keywordColors[keyword] = color;
            }

            let regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            this.fileContent = this.fileContent.replace(regex, (match) => {
                return `<span style="background-color: ${this.keywordColors[keyword]};">${match}</span>`;
            });
        });

        document.getElementById("cal").innerHTML = this.fileContent;
    }

   generateExtractedHTML() {
    // Find the first and last index of highlighted keywords
    let firstIndex = this.fileContent.indexOf('<span');
    let lastIndex = this.fileContent.lastIndexOf('</span>');

    if (firstIndex === -1 || lastIndex === -1) {
        alert('No highlighted keywords found.');
        return;
    }

    // Extract the portion of content between the first and last highlight
    let extractedContent = this.fileContent.substring(firstIndex, lastIndex + 7);

    // Generate the HTML structure for the extracted content
    let extractedHTML = `
        <html>
        <head>
            <title>Extracted HTML</title>
            <style>
                .keyword {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            ${extractedContent}
        </body>
        </html>`;

    // Download the extracted HTML content
    this.downloadFile("extracted_html.html", extractedHTML);
}


    downloadFile(filename, content) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    getRandomColor() {
        let colorPalette = ['#FF5733', '#33FF57', '#5733FF', '#33FFFF', '#FF33FF', '#FFFF33']; // Array of colors
        return colorPalette[Math.floor(Math.random() * colorPalette.length)];
    }

    reloadPage() {
    window.location.reload();
}

}

const keywordHighlighter = new KeywordHighlighter();
