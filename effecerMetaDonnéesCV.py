from PyPDF2 import PdfReader, PdfWriter

reader = PdfReader("./assets/CV_Romain.pdf")
writer = PdfWriter()

writer.append_pages_from_reader(reader)
writer.add_metadata({
    "/Title": "CV Romain Mines Alès",
    "/Author": "Romain",
    "/Creator": "Romain",
    "/Producer": "Romain",
    "/Keywords": "CV, ingénieur, IA, urbanisme",
})

with open("CV_Romain_2.pdf", "wb") as f:  # ⚠️ même nom que le fichier original
    writer.write(f)
