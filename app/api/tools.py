from drf_extra_fields.fields import Base64FileField


class FileField(Base64FileField):
    ALLOWED_TYPES = ["ptart"]

    def get_file_extension(self, filename, decoded_file):
        return "ptart"
    
class MermaidUtils:

    @staticmethod
    def generate_mermaid_id(mermaid_code):
        import hashlib
        return hashlib.md5(mermaid_code.encode("utf-8")).hexdigest()
    
    @staticmethod
    def replace_mermaid_diagram_by_md_images(markdown):
        import re

        mermaid_pattern = re.compile(r'```mermaid\n(.*?)\n```', re.DOTALL)
        matches = mermaid_pattern.findall(markdown)

        for match in matches:
            mermaid_id = MermaidUtils.generate_mermaid_id(match)
            mermaid_png_filename = f"mermaid_{mermaid_id}.png"
            replacement = f"![](mermaid/{mermaid_png_filename})"
            markdown = markdown.replace(f"```mermaid\n{match}\n```", replacement)
        
        return markdown
    
    @staticmethod
    def process_mermaid_diagrams(markdown_text, zip_file):
        import os
        import re

        mermaid_pattern = re.compile(r'```mermaid\n(.*?)\n```', re.DOTALL)
        matches = mermaid_pattern.findall(markdown_text)

        for match in matches:
            mermaid_id = MermaidUtils.generate_mermaid_id(match)
            mermaid_png_filename = f"mermaid_{mermaid_id}.png"

            # Generate PNG from Mermaid diagram.
            png_path = MermaidUtils.generate_mermaid_png(match)

            # Add PNG to zip file.
            with open(png_path, "rb") as png_file:
                zip_file.writestr(f"mermaid/{mermaid_png_filename}", png_file.read())
            os.remove(png_path)


    @staticmethod
    def generate_mermaid_png(mermaid_code):
        import os
        import subprocess
        import tempfile

        with tempfile.NamedTemporaryFile(mode="w+", suffix=".mmd", delete=False) as mmd_file:
            mmd_file.write(mermaid_code)
            temp_input = mmd_file.name

        temp_output = tempfile.NamedTemporaryFile(mode="w+b", suffix=".png", delete=False)

        try:
            subprocess.run(
                ["mmdc", "-i", temp_input, "-o", temp_output.name],
                check=True,
            )
        finally:
            os.remove(temp_input)
        return temp_output.name
