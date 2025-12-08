# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Install system dependencies
# Pandoc is required for the conversion
# texlive-xetex is optional but good for PDF, but we only do docx so pandoc is enough
RUN apt-get update && apt-get install -y \
    pandoc \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Make port 8000 available to the world outside this container
# Cloud providers (like Render) will set the PORT env var, we'll use it in CMD
ENV PORT=8000

# Run app.py when the container launches
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
