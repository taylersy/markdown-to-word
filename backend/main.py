from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pypandoc
import os
import uuid
import tempfile
import shutil

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Markdown to Word Converter"}

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure Pandoc is available
try:
    # Check if pandoc is installed
    pypandoc.get_pandoc_version()
except OSError:
    print("Pandoc not found. Downloading...")
    try:
        # In Vercel or read-only environments, we must use /tmp
        download_folder = '/tmp' if os.path.exists('/tmp') else None
        pypandoc.download_pandoc(targetfolder=download_folder)
        print("Pandoc downloaded successfully.")
    except Exception as e:
        print(f"Failed to download Pandoc: {e}")
        # Continue, but conversion might fail if not resolved

class MarkdownInput(BaseModel):
    content: str

@app.post("/convert")
async def convert_markdown(data: MarkdownInput):
    try:
        # Create a temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            input_file = os.path.join(temp_dir, "input.md")
            output_file = os.path.join(temp_dir, "output.docx")
            
            # Write markdown content to file
            with open(input_file, "w", encoding="utf-8") as f:
                f.write(data.content)
            
            # Convert using pypandoc
            # Note: 'docx' is the format name for Word documents
            # We use --webtex to render math if pure native isn't desired, 
            # but for native Word equations, we usually rely on default pandoc behavior.
            extra_args = [
                '--standalone',
                '--mathjax' # or just let pandoc handle it natively
            ]
            
            pypandoc.convert_file(
                input_file,
                'docx',
                outputfile=output_file,
                extra_args=extra_args
            )
            
            # We need to return the file. Since the temp dir will be deleted,
            # we read the bytes and stream them, or copy to a persistent temp location?
            # Better: Copy to a non-context-managed temp file or stream directly.
            
            # Create a persistent temp file to return
            temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=".docx")
            temp_output.close()
            shutil.copy(output_file, temp_output.name)
            
            return FileResponse(
                temp_output.name, 
                media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                filename="document.docx"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
